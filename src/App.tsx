import { allowedNodeEnvironmentFlags } from 'process';
import Q from 'q';
import React, { Component, useEffect, useState } from 'react';
import './App.css';
import Keyboard from './components/Keyboard';
import { characters, defaultKeys, shiftKeys, kana50, romaji50 } from './models/KeyCharacter'

function App() {
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
    const [currentOtherCharacter, setCurrentOtherCharacter] = useState<string>('');
    const [currentAlphabet, setCurrentAlphabet] = useState<string>('');
    const [currentCharacterJP, setCurrentCharacterJP] = useState<string>('');
    const [isStart, setIsStart] = useState<boolean>(false);
    const [isEnd, setIsEnd] = useState<boolean>(false);

    //TODO state params
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown,)
        window.addEventListener('keyup', handleKeyUp,)

        updateQuestion();
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    })
    const updateQuestion = () => {
        if (!questions) return
        if (currentCharacter) {
            const character: string = currentCharacter[characterIndex];
            setCurrentAlphabet(character);
        }

        setQuestionMode(questionMode)
        let question: any = questions[questionIndex];
        if (Array.isArray(question)) {
            setCurrentCharacter(questions[questionIndex][0])
            setCurrentOtherCharacter(questions[questionIndex][1])
        } else {
            setCurrentCharacter(questions[questionIndex])
            setCurrentOtherCharacter('')
        }
        setCurrentCharacterJP(questionsJP[questionIndex])
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
        // setQuestions([])
        // setQuestionsJP([])
    }
    const end = (isForce: boolean = false) => {
        if (isForce) {
            reset()
        } else if (isRepeat) {
            start()
        } else {
            reset()
        }
    }
    const handleEnd = () => {
        end(true)
    }
    const select = (e: any) => {
        createQuestionKana50(e.target.dataset.mode)
    }
    const createQuestionKana50 = (mode: string) => {
        setQuestionMode(mode)
        setQuestions(romaji50[mode])
        setQuestionsJP(kana50[mode])
        setQuestionModeLabel(kana50[mode][0])
    }
    const handleKeyDown = (e: KeyboardEvent) => {
        // if (isKeyDown) return
        setIsKeyDown(true)
        if (e.shiftKey) {
            setIsShiftKey(e.shiftKey);
        } else if (characters[e.key]) {
            setCurrentKey(characters[e.key].label);
            setCurrentKeyCode(e.keyCode)
            if (!isStart) return
            checkAnswer(e.key)
        }
    };
    const handleNaviCheck = (e: any) => {
        setIsNavi(!isNavi)
    }
    const handleRepeatCheck = (e: any) => {
        setIsRepeat(!isRepeat)
    }
    const checkAnswer = (input: string) => {
        if (!questions) return;
        if (questionIndex >= questions.length) return

        let isCorrect: boolean = (currentCharacter.length > 1) ?
            checkCharacter(input) : (currentCharacter == input)
        // console.log(currentOtherCharacter);
        if (!isCorrect) isCorrect = (currentOtherCharacter.length > 1) ?
            checkCharacter(input, true) : (currentOtherCharacter == input)
        if (!isCorrect) return;
        setQuestionIndex(questionIndex + 1);
        if (questionIndex == questions.length - 1) end()
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
    const handleKeyUp = (e: KeyboardEvent) => {
        setIsKeyDown(false)
        setIsShiftKey(e.shiftKey);
    };
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
    const ButtonKana50: React.VFC = () => {
        if (!isStart || isEnd) {
            return <div>
                <h2 className="h2">五十音</h2>
                <h3 className="h3">{questionModeLabel}</h3>
                <div className="row ml-5 mr-5">
                    {Object.keys(kana50).map((mode, index: number) => {
                        return <div className="col-1" key={'mode-' + index}>
                            <a
                                className="btn btn-outline-primary m-1"
                                data-mode={mode}
                                onClick={select}>
                                {kana50[mode][0]}
                            </a>
                        </div>
                    }
                    )}
                </div>
            </div>
        } else {
            return <div></div>
        }
    }
    const ButtonStart: React.VFC = () => {
        if (!isStart && questions && questions.length > 0 && questionMode) {
            return <div>
                <button className="m-1 btn btn-primary" onClick={start}>スタート</button>
            </div>
        } else {
            return <div></div>
        }
    }
    const ButtonRetry: React.VFC = () => {
        if (isEnd) {
            return <div>
                <button className="m-1 btn btn-primary" onClick={start}>リトライ</button>
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
        if (isStart) {
            return <div className="typing-display">{currentCharacterJP}</div>
        } else {
            return <div className="typing-display"></div>
        }
    }
    const randRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

    return (
        <div className="App">
            <DisplayCharacter />
            <div className="d-flex justify-content-start m-3">
                <div className="form-check p-3">
                    <input
                        id="navi"
                        className="form-check-input"
                        type="checkbox"
                        checked={isNavi}
                        onChange={handleNaviCheck}
                    />
                    <label className="form-check-label" htmlFor="navi">ナビ</label>
                </div>
                <div className="form-check p-3">
                    <input
                        id="repeat"
                        className="form-check-input"
                        type="checkbox"
                        checked={isRepeat}
                        onChange={handleRepeatCheck}
                    />
                    <label className="form-check-label" htmlFor="repeat">リピート</label>
                </div>
            </div>
            <RenderKeyboard />
            <ButtonStart />
            <ButtonEnd />
            <ButtonKana50 />

        </div>
    );
}

export default App;