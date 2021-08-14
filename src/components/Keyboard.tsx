import React, { useState, useEffect } from 'react'

interface Props {
    currentKey: string,
    currentCharacter: string,
    keyboards: string[][],
    isKeyDown: boolean,
    isNavi: boolean,
}
interface KeysProps {
    currentKey: string,
    values: string[][],
}
interface KeyProps {
    currentKey: string,
    id: number,
    value: string,
}
export const Keyboard: React.FC<Props> = (props: Props) => {
    const [isKeyDown, setIsKeyDown] = useState<boolean>(props.isKeyDown);
    const [isNavi, setIsNavi] = useState<boolean>(props.isNavi);
    const [currentCharacter, setCurrentCharacter] = useState<string>(props.currentCharacter);

    useEffect(() => {
        setIsKeyDown(props.isKeyDown)
        setIsNavi(props.isNavi)
        setCurrentCharacter(props.currentCharacter)
    })

    const KeyUnits: React.VFC<KeysProps> = (keysProps: KeysProps) => {
        return <div>
            {keysProps.values.map((rows: string[], row_index: number) =>
                <div className="d-flex justify-content-center" key={row_index}>
                    {
                        rows.map((value: string, value_index: number) => {
                            return <KeyUnit
                                id={value_index}
                                key={value_index}
                                value={value}
                                currentKey={keysProps.currentKey}
                            />
                        })
                    }
                </div>
            )}
        </div>
    }
    const keyClassName = (value: string, target: string) => {
        let className = 'btn-key btn btn-outline-primary';
        if (isKeyDown && value == target) {
            className += ' active';
        } else if (isNavi
            && currentCharacter
            && target == currentCharacter.toUpperCase()) {
            className += ' navi-active';
        }
        return className;
    }
    const KeyUnit: React.VFC<KeyProps> = (props: KeyProps) => {
        return <button
            id={'key-' + props.id}
            className={keyClassName(props.currentKey, props.value)}>
            {props.value}
        </button >
    }

    return (
        <div className="m-3">
            <KeyUnits values={props.keyboards} currentKey={props.currentKey} />
        </div>
    )

}

export default Keyboard;