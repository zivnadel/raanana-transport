import React from 'react'
import { Dispatch, SetStateAction, useState } from 'react'

interface Props {
  setIsEmpty: Dispatch<SetStateAction<boolean>>
  formSubmittedWithErrorHandler: any
}

const DateAndHours = React.forwardRef<HTMLInputElement, Props>(
  ({ setIsEmpty, formSubmittedWithErrorHandler }, ref) => {
    // This is used so at first, there is an error (because fields are empty), so it
    // is not possible to submit the form, but styles are not yet shows because the
    // user didn't get a chance to fill the form.
    const [showErrorStyles, setShowErrorStyles] = useState(false)

    const [showHours, setShowHours] = useState(false)

    // this call being invoked from parent
    formSubmittedWithErrorHandler.current = setShowErrorStyles.bind(null, true)

    const dateChangedHandler = () => {
      setShowErrorStyles(false)
      setIsEmpty(false)
    }

    return (
      <div className="flex flex-col items-center justify-center w-10/12">
        <input
          ref={ref}
          onChange={dateChangedHandler}
          type="date"
          min="2022-09-01"
          max="2023-06-20"
          className={`mb-2 block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-right text-sm text-gray-900 ${
            showErrorStyles
              ? 'border-secondary text-secondary focus:border-secondary'
              : 'border-gray-500 focus:border-primary'
          } appearance-none focus:outline-none focus:ring-0`}
          placeholder="Select date"
        />
        {showErrorStyles && (
          <p
            id="standard_error_help"
            className="block w-full mt-2 text-xs text-right text-red-600"
          >
            שדה זה הינו חובה
          </p>
        )}
        {/* Will show hours conditinally after receieving date info from db */}
        {showHours && (
          <select
            id="chooseHour"
            className="w-full px-0 py-3 m-2 text-sm text-right text-gray-900 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:border-primary focus:outline-none focus:ring-0"
          >
            {/* Will be changed programatically */}
            <option selected value="morning">
              בוקר
            </option>
            <option value="15:30">15:30</option>
            <option value="17:00">17:00</option>
          </select>
        )}
      </div>
    )
  }
)

DateAndHours.displayName = 'Date and Hours'

export default DateAndHours
