import React, { useRef, useState, Dispatch, SetStateAction } from 'react'

interface Props {
  label: string
  name: string
  type: string
  regex: RegExp
  errorMessage: string
  setError: Dispatch<SetStateAction<boolean>>
  formSubmittedWithErrorHandler: any
}

const Input = ({
  label,
  name,
  type,
  regex,
  setError,
  errorMessage,
  formSubmittedWithErrorHandler,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // This is used so at first, there is an error (because fields are empty), so it
  // is not possible to submit the form, but styles are not yet shows because the
  // user didn't get a chance to fill the form.
  const [showErrorStyles, setShowErrorStyles] = useState(false)

  // this call being invoked from parent
  formSubmittedWithErrorHandler.current = setShowErrorStyles.bind(null, true)

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(!regex.test(inputRef.current?.value!))
    setShowErrorStyles(!regex.test(inputRef.current?.value!))
  }

  if (inputRef.current?.value! === '') {
    errorMessage = 'שדה זה הינו חובה'
  }

  return (
    <div className="relative z-0 w-10/12 m-3">
      <input
        onChange={inputChangeHandler}
        ref={inputRef}
        type={type}
        id={name}
        className={`peer block w-full appearance-none border-0 border-b-2 border-gray-500 bg-transparent py-2.5 px-0 text-right text-sm text-gray-900 ${
          showErrorStyles
            ? 'border-secondary focus:border-secondary'
            : 'focus:border-primary'
        } focus:outline-none focus:ring-0`}
        placeholder=" "
      />
      <label
        htmlFor={name}
        className={`absolute right-0 top-3 -z-10 -translate-y-6 scale-75 transform text-sm text-gray-700 duration-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:right-0 peer-focus:-translate-y-6 peer-focus:scale-75 ${
          showErrorStyles
            ? 'text-secondary peer-focus:text-secondary'
            : 'peer-focus:text-primary'
        }`}
      >
        {label}
      </label>
      {showErrorStyles && (
        <p
          id="standard_error_help"
          className="mt-2 text-xs text-right text-red-600"
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Input
