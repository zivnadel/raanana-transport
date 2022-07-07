interface Props {
    id1: string;
    text1: string;
    id2: string;
    text2: string;
}

const DoubleRadioGroup = ({ id1, text1, id2, text2}: Props) => {
  return (
    <div className="flex">
      <div className="flex flex-row-reverse items-end p-5 mr-4">
        <input
          defaultChecked
          id={id1}
          type="radio"
          value=""
          name="double-radio-group"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        />
        <label
          htmlFor={id1}
          className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {text1}
        </label>
      </div>
      <div className="flex flex-row-reverse items-center mr-4">
        <input
          id={id2}
          type="radio"
          value=""
          name="double-radio-group"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
        />
        <label
          htmlFor={id2}
          className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {text2}
        </label>
      </div>
    </div>
  )
}

export default DoubleRadioGroup
