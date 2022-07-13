import React from "react"

interface Props {
    name: string
    type: string
    value: string
    label: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const EditableInput: React.FC<Props> = ({ name, type, value, label, onChange }) => {
    return (
        <div className="flex flex-col items-center my-1">
            <label htmlFor={name} className="m-2">{label}</label>
            <div className="flex w-6/12">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300">
                    ₪
                </span>
                <input type={type} defaultValue={value} id={name} onChange={onChange} className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"/>
            </div>
        </div>)
}

export default EditableInput;