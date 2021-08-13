import { allowedNodeEnvironmentFlags } from 'process';
import React, { Component, useEffect, useState } from 'react';
import './App.css';
import Keyboard from './Models/Keyboard';
import { characters, defaultKeys, shiftKeys, kana50, romaji50 } from './Models/KeyCharacter'

function App() {
    const [isShiftKey, setIsShiftKey] = useState<boolean>(false);
    const [questionMode, setQuestionMode] = useState<string>('');
    const [isKeyDown, setIsKeyDown] = useState<boolean>(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [questionsJP, setQuestionsJP] = useState<string[]>([]);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [currentKey, setCurrentKey] = useState<string>('');
    const [currentKeyCode, setCurrentKeyCode] = useState<number>(0);
    const [currentCharacter, setCurrentCharacter] = useState<string>('');
    const [currentCharacterJP, setCurrentCharacterJP] = useState<string>('');
    const [isStart, setIsStart] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);

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
    }
    const select = () => {
        createQuestionKana50()
    }
    const createQuestionKana50 = () => {
        const mode = 'a'
        setQuestionMode(mode)
        setQuestions(romaji50[mode])
        setQuestionsJP(kana50[mode])
    }
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isStart) return
        if (isKeyDown) return
        setIsKeyDown(true)
        if (e.shiftKey) {
            setIsShiftKey(e.shiftKey);
        } else if (characters[e.key]) {
            setCurrentKey(characters[e.key].label);
            setCurrentKeyCode(e.keyCode)
            checkAnswer(e.key)
        }
    };
    const checkAnswer = (input: string) => {
        if (questions && questionIndex < questions.length) {
            // console.log(currentCharacter, input)
            if (currentCharacter == input) {
                setQuestionIndex(questionIndex + 1);
            }
        }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
        setIsKeyDown(false)
        setIsShiftKey(e.shiftKey);
    };
    const RenderKeyboard: React.VFC = () => {
        if (isShiftKey) {
            return <Keyboard currentKey='' keyboards={shiftKeys} />
        } else {
            return <Keyboard currentKey='' keyboards={defaultKeys} />
        }
    }
    const ButtonKana50: React.VFC = () => {
        if (isStart) {
            return <div></div>
        } else {
            return <div>
                <button className="btn btn-primary" onClick={select}>五十音</button>
            </div>
        }
    }
    const ButtonStart: React.VFC = () => {
        if (!isStart && questions && questions.length > 0) {
            return <div>
                <button className="btn btn-primary" onClick={start}>スタート</button>
            </div>
        } else {
            return <div></div>
        }
    }
    const DisplayCharacter: React.VFC = () => {
        if (isStart) {
            return <div className="typing-display">{currentCharacterJP}</div>
        } else {
            return <div></div>
        }
    }
    const randRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

    return (
        <div className="App">
            <RenderKeyboard />
            <ButtonKana50 />
            <ButtonStart />
            <DisplayCharacter />
        </div>
    );
}

export default App;
