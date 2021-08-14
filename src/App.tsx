import React, { useEffect, useState } from 'react';
import CheckBox from './components/CheckBox';
import './App.css';
import Keyboard from './components/Keyboard';
import Nav from './components/Nav'
import GameType from './components/GameType'
//TODO Questions
import {
    characters,
    defaultKeys,
    shiftKeys,
    kana50,
    romaji50,
    alphabets,
    upperAlphabets,
} from './models/KeyCharacter'

function App() {
    const defaultCharacter = 'タイピング'
    const [gameType, setGameType] = useState<string>('');
    const [isShiftKey, setIsShiftKey] = useState<boolean>(false);
    const [questionMode, setQuestionMode] = useState<string>('');
    const [questionModeLabel, setQuestionModeLabel] = useState<string>('');
    const [isKeyDown, setIsKeyDown] = useState<boolean>(false);
    const [isNavi, setIsNavi] = useState<boolean>(false);
    const [isRepeat, setIsRepeat] = useState<boolean>(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [questionsJP, setQuestionsJP] = useState<string[]>([]);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [characterIndex, setCharacterIndex] = useState<number>(0);
    const [currentKey, setCurrentKey] = useState<string>('');
    const [currentKeyCode, setCurrentKeyCode] = useState<number>(0);
    const [currentCharacter, setCurrentCharacter] = useState<string>('');
    const [currentCharacterJP, setCurrentCharacterJP] = useState<string>(defaultCharacter);
    const [currentOtherCharacter, setCurrentOtherCharacter] = useState<string>('');
    const [currentAlphabet, setCurrentAlphabet] = useState<string>('');
    const [isStart, setIsStart] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown,)
        window.addEventListener('keyup', handleKeyUp,)

        updateQuestion();
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    })

    const handleSelectMenu = (gameType: string) => {
        selectGameType(gameType)
    }
    const updateQuestion = () => {
        setIsNavi(defaultwBoolean('is_navi'))
        setIsRepeat(defaultwBoolean('is_repeat'))
        if (!isStart) return
        if (!questions) return
        if (currentCharacter) {
            const character: string = currentCharacter[characterIndex];
            setCurrentAlphabet(character);
        }
        setQuestionMode(questionMode)
        setCurrentCharacterJP(questionsJP[questionIndex])

        //question multi answer
        let question: string = questions[questionIndex];
        if (Array.isArray(question)) {
            setCurrentCharacter(questions[questionIndex][0])
            setCurrentOtherCharacter(questions[questionIndex][1])
        } else {
            setCurrentCharacter(questions[questionIndex])
            setCurrentOtherCharacter('')
        }
    }
    const start = () => {
        setCharacterIndex(0)
        setQuestionIndex(0)
        setIsStart(true)
        setIsEnd(false)
    }
    const reset = () => {
        setIsEnd(true)
        setIsStart(false)
        setCharacterIndex(0)
        setCurrentCharacter('')
        setCurrentOtherCharacter('')
        setCurrentAlphabet('')
        setCurrentKey('')
    }
    const end = (isForce: boolean = false) => {
        if (isForce || !isRepeat) {
            reset()
        } else {
            start()
        }
    }
    const handleEnd = () => {
        end(true)
    }
    const selectGameType = (type: string, mode: string = '') => {
        console.log(type, mode)
        setGameType(type)
        if (type === 'kana50') {
            if (!mode) return
            createQuestionKana50(mode)
        } else if (type === 'alphabet') {
            createQuestionAlphabet()
        }
    }
    //TODO Model/Question
    const createQuestionKana50 = (mode: string) => {
        setQuestionMode(mode)
        setQuestions(romaji50[mode])
        setQuestionsJP(kana50[mode])
        setQuestionModeLabel(kana50[mode][0])
    }
    const createQuestionAlphabet = () => {
        setQuestionMode('')
        setQuestions(alphabets)
        setQuestionsJP(upperAlphabets)
        setQuestionModeLabel('')
    }
    const handleKeyDown = (e: KeyboardEvent) => {
        // if (isKeyDown) return
        setIsKeyDown(true)
        console.log(e.keyCode);
        console.log(e.key);
        if (e.shiftKey) {
            setIsShiftKey(e.shiftKey);
        } else if (characters[e.key]) {
            setCurrentKey(characters[e.key].label);
            setCurrentKeyCode(e.keyCode)
            if (!isStart) return
            checkAnswer(e.key)
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        setIsKeyDown(false)
        setIsShiftKey(e.shiftKey);
    };
    const saveCookie = (key: string, value: string) => {
        document.cookie = key + '=' + value;
    }
    const loadCookie = (key: string) => {
        var cookies = document.cookie;
        var cookiesArray = cookies.split(';');
        for (var cookie of cookiesArray) {
            var array: string[] = cookie.split('=');
            if (array[0].trim() === key) return array[1]
        }
    }
    const defaultwBoolean = (key: string) => {
        var value = loadCookie(key);
        return (value === '1');
    }
    const handleNaviCheck = (e: any) => {
        var value: string = (!isNavi) ? '1' : '0';
        saveCookie('is_navi', value);
        setIsNavi(!isNavi)
    }
    const handleRepeatCheck = (e: any) => {
        var value: string = (!isRepeat) ? '1' : '0';
        saveCookie('is_repeat', value);
        setIsRepeat(!isRepeat)
    }
    const checkAnswer = (input: string) => {
        if (!questions) return;
        if (questionIndex >= questions.length) return

        let isCorrect: boolean = (currentCharacter.length > 1) ?
            checkCharacter(input) : (currentCharacter === input)
        // console.log(currentOtherCharacter);
        if (!isCorrect) isCorrect = (currentOtherCharacter.length > 1) ?
            checkCharacter(input, true) : (currentOtherCharacter === input)
        if (!isCorrect) return;
        setQuestionIndex(questionIndex + 1);
        if (questionIndex === questions.length - 1) end()
    }
    const checkCharacter = (input: string, isOther: boolean = false) => {
        let character: string = (isOther) ?
            currentOtherCharacter[characterIndex] : currentCharacter[characterIndex];
        // console.log(currentCharacter, character, currentOtherCharacter)
        if (character == input) {
            let length = (isOther) ? currentOtherCharacter.length : currentCharacter.length
            if (characterIndex == length - 1) {
                setCharacterIndex(0);
                return true;
            } else {
                setCharacterIndex(characterIndex + 1);
            }
        }
        return false;
    }
    const RenderKeyboard: React.VFC = () => {
        if (isShiftKey) {
            return <Keyboard
                currentKey={currentKey}
                currentCharacter={currentAlphabet}
                isKeyDown={isKeyDown}
                isNavi={isNavi && isStart}
                keyboards={shiftKeys} />
        } else {
            return <Keyboard
                currentKey={currentKey}
                currentCharacter={currentAlphabet}
                isKeyDown={isKeyDown}
                isNavi={isNavi && isStart}
                keyboards={defaultKeys} />
        }
    }
    const ButtonStart: React.VFC = () => {
        if (!isStart && questions && questions.length > 0) {
            return <div>
                <button className="m-1 btn btn-primary" onClick={start}>スタート</button>
            </div>
        } else {
            return <div></div>
        }
    }
    const ButtonEnd: React.VFC = () => {
        if (isStart) {
            return <div>
                <button className="m-1 btn btn-primary" onClick={handleEnd}>やめる</button>
            </div>
        } else {
            return <div></div>
        }
    }
    const DisplayCharacter: React.VFC = () => {
        return <div className="typing-display">{currentCharacterJP}</div>
    }
    const randRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

    return (
        <div>
            <Nav gameType={gameType} selectMenu={handleSelectMenu} />
            <div className="container">
                <div className="text-center">
                    <DisplayCharacter />
                    <GameType
                        gameType={gameType}
                        isStart={isStart}
                        isEnd={isEnd}
                        questionModeLabel={questionModeLabel}
                        selectGameType={selectGameType}
                    />
                    <ButtonStart />
                </div>
                <div className="">
                    <CheckBox id="navi" label="ヒント" checked={isNavi} handler={handleNaviCheck} />
                    <CheckBox id="repeat" label="リピート" checked={isRepeat} handler={handleRepeatCheck} />
                </div>
                <div className="text-center">
                    <ButtonEnd />
                </div>
                <RenderKeyboard />
            </div>
        </div>
    );
}

export default App;