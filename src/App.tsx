import { allowedNodeEnvironmentFlags } from 'process';
import React, { Component, useEffect, useState } from 'react';
import './App.css';
import Keyboard from './components/Keyboard';
import { characters, defaultKeys, shiftKeys, kana50, romaji50 } from './models/KeyCharacter'

function App() {
    const [isShiftKey, setIsShiftKey] = useState<boolean>(false);
    const [questionMode, setQuestionMode] = useState<string>('');
    const [isKeyDown, setIsKeyDown] = useState<boolean>(false);
    const [isNavi, setIsNavi] = useState<boolean>(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [questionsJP, setQuestionsJP] = useState<string[]>([]);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [characterIndex, setCharacterIndex] = useState<number>(0);
    const [currentKey, setCurrentKey] = useState<string>('');
    const [currentKeyCode, setCurrentKeyCode] = useState<number>(0);
    const [currentCharacter, setCurrentCharacter] = useState<string>('');
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
        setQuestionMode(questionMode)
        setCurrentCharacter(questions[questionIndex])
        setCurrentCharacterJP(questionsJP[questionIndex])
    }
    const start = () => {
        setIsStart(true)
        setIsEnd(false)
    }
    const end = () => {
        setIsEnd(true)
    }
    const retry = () => {
        setIsStart(true)
        setIsEnd(false)
        setQuestionIndex(0)
    }
    const select = (e: any) => {
        createQuestionKana50(e.target.dataset.mode)
    }
    const createQuestionKana50 = (mode: string) => {
        setQuestionMode(mode)
        setQuestions(romaji50[mode])
        setQuestionsJP(kana50[mode])
    }
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isKeyDown) return
        setIsKeyDown(true)
        if (e.shiftKey) {
            setIsShiftKey(e.shiftKey);
        } else if (characters[e.key]) {
            // console.log(currentKey)
            // console.log(currentCharacter)
            // console.log(id)
            setCurrentKey(characters[e.key].label);
            setCurrentKeyCode(e.keyCode)
            if (!isStart) return
            checkAnswer(e.key)
        }
    };
    const handleNaviCheck = (e: any) => {
        console.log(e)
        setIsNavi(!isNavi)
    }
    const checkAnswer = (input: string) => {
        if (!questions) return;
        if (questionIndex >= questions.length) return

        let isCorrect: boolean = (currentCharacter.length > 1) ?
            checkCharacter(input) : (currentCharacter == input)
        if (!isCorrect) return;
        setQuestionIndex(questionIndex + 1);
        if (questionIndex == questions.length - 1) end()
    }
    const checkCharacter = (input: string) => {
        const character: string = currentCharacter[characterIndex];
        // console.log(currentCharacter, character, characterIndex)
        if (character == input) {
            if (characterIndex == currentCharacter.length - 1) {
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
                currentCharacter={currentCharacter}
                isKeyDown={isKeyDown}
                isNavi={isNavi && isStart}
                keyboards={shiftKeys} />
        } else {
            return <Keyboard
                currentKey={currentKey}
                currentCharacter={currentCharacter}
                isKeyDown={isKeyDown}
                isNavi={isNavi && isStart}
                keyboards={defaultKeys} />
        }
    }
    const ButtonKana50: React.VFC = () => {
        if (!isStart || isEnd) {
            return <div className="d-flex">
                {Object.keys(kana50).map((mode, index: number) => {
                    return <div key={'mode-' + index}>
                        <button
                            className="btn btn-outline-primary m-1"
                            data-mode={mode}
                            onClick={select}>
                            {kana50[mode][0]}
                        </button>
                    </div>
                }
                )}
            </div>
        } else {
            return <div></div>
        }
    }
    const ButtonStart: React.VFC = () => {
        if (!isStart && questions && questions.length > 0) {
            return <div>
                <button className="m-3 btn btn-primary" onClick={start}>スタート</button>
            </div>
        } else {
            return <div></div>
        }
    }
    const ButtonRetry: React.VFC = () => {
        if (isEnd) {
            return <div>
                <button className="m-3 btn btn-primary" onClick={retry}>リトライ</button>
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
            <RenderKeyboard />
            <ButtonKana50 />
            <ButtonStart />
            <ButtonRetry />

            <div className="d-flex justify-content-center">
                <div className="form-check">
                    <input
                        id="navi"
                        className="form-check-input"
                        type="checkbox"
                        checked={isNavi}
                        onChange={handleNaviCheck}
                    />
                    <label className="form-check-label" htmlFor="navi">ナビ</label>
                </div>
            </div>
        </div>
    );
}

export default App;
