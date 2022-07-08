import React, { Dispatch, SetStateAction } from 'react'

interface Props {
  setAction: Dispatch<SetStateAction<string>>
  action: string
}

const DoubleRadioGroup = ({ action, setAction }: Props) => {
  const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAction(event.target.value)
  }

  return (
    <div className="flex">
      <div className="flex flex-row-reverse items-end p-5 mr-4">
        <input
          onChange={handleActionChange}
          checked={action === 'ADD'}
          id="addRides"
          type="radio"
          value="ADD"
          name="double-radio-group"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        />
        <label
          htmlFor="addRides"
          className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          הוסף הסעות
        </label>
      </div>
      <div className="flex flex-row-reverse items-center mr-4">
        <input
          onChange={handleActionChange}
          checked={action === 'REMOVE'}
          id="removeRides"
          type="radio"
          value="REMOVE"
          name="double-radio-group"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        />
        <label
          htmlFor="removeRides"
          className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          הסר הסעות
        </label>
      </div>
    </div>
  )
}

export default DoubleRadioGroup
