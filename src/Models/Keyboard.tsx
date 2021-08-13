import React from 'react'

interface Props {
    currentKey: string,
    keyboards: string[][],
}
interface KeysProps {
    values: string[][],
}
interface KeyProps {
    value: string,
}
export const Keyboard: React.FC<Props> = (props: Props) => {

    const KeyUnits: React.VFC<KeysProps> = (props: KeysProps) => {
        return <div>
            {props.values.map((rows: string[], row_index: number) =>
                <div className="d-flex justify-content-center" key={row_index}>
                    {
                        rows.map((value: string, value_index: number) => {
                            return <KeyUnit key={value_index} value={value}></KeyUnit>
                        })
                    }
                </div>
            )}
        </div>
    }
    const KeyUnit: React.VFC<KeyProps> = (props: KeyProps) => {
        return <div className="keyboard-key" >
            <div className="keyboard-key-inner">
                {props.value}
            </div>
        </div >
    }

    return (
        <div className="m-5">
            <KeyUnits values={props.keyboards}></KeyUnits>
        </div>
    )

}

export default Keyboard;