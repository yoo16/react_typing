import React, { useState, useEffect } from 'react'
import { characters, kana50, romaji50 } from '../models/KeyCharacter'

interface Props {
    gameType: string,
    isStart: boolean,
    isEnd: boolean,
    questionModeLabel: string,
    selectGameType: any,
}

const GameType = (props: Props) => {
    const selectGameType = (e: any) => {
        props.selectGameType(e.target.dataset.type, e.target.dataset.mode)
    }
    const TypingKana50: React.VFC = () => {
        return <div className="">
            <h2 className="h2">五十音</h2>
            <h3 className="h3">{props.questionModeLabel}</h3>
            <div className="row">
                {Object.keys(kana50).map((mode, index: number) => {
                    return <div className="col-2" key={'mode-' + index}>
                        <button className="btn-kana btn btn-outline-primary m-1"
                            data-type='kana50'
                            data-mode={mode}
                            onClick={selectGameType}>{kana50[mode][0]}</button>
                    </div>
                }
                )}
            </div>
        </div>
    }
    const TypingAlphabet: React.VFC = () => {
        return <div className="">
            <h2 className="h2">アルファベット</h2>
        </div>
    }

    if (!props.isStart || props.isEnd) {
        if (props.gameType === 'kana50') {
            return <TypingKana50 />
        } else if (props.gameType === 'alphabet') {
            return <TypingAlphabet />
        }
    }
    return <div></div>
}

export default GameType