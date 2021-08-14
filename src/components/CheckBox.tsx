import React from 'react'

interface Props {
    id: string,
    label: string,
    checked: boolean,
    handler: any,
}

export const CheckBox: React.FC<Props> = (props: Props) => {
    return (
        <div className="mt-3 form-check form-switch form-check-inline">
            <input
                id={props.id}
                className="form-check-input"
                type="checkbox"
                checked={props.checked}
                onChange={props.handler}
            />
            <label className="form-check-label" htmlFor={props.id}>{props.label}</label>
        </div>
    )
}

export default CheckBox;