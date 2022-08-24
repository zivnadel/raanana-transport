import React, { Dispatch, forwardRef, SetStateAction, useState } from 'react';

interface Props {
  label: string;
  name: string;
  type: string;
  regex: RegExp;
  errorMessage: string;
  setError: Dispatch<SetStateAction<boolean>>;
  formSubmittedWithErrorHandler: any;
  clear: any;
}

const ReportHoursInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      name,
      type,
      regex,
      setError,
      errorMessage,
      formSubmittedWithErrorHandler,
      clear,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');
    // This is used so at first, there is an error (because fields are empty), so it
    // is not possible to submit the form, but styles are not yet shows because the
    // user didn't get a chance to fill the form.
    const [showErrorStyles, setShowErrorStyles] = useState(false);

    // this call being invoked from parent
    formSubmittedWithErrorHandler.current = setShowErrorStyles.bind(null, true);
    clear.current = setInputValue.bind(null, '');

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setError(!regex.test(event.target.value));
      setShowErrorStyles(!regex.test(event.target.value));
      if (event.target.value === '') {
        errorMessage = 'שדה זה הינו חובה';
      }
    };

    return (
      <div className="relative z-0 m-3 w-10/12">
        <input
          ref={ref}
          onChange={inputChangeHandler}
          type={type}
          id={name}
          value={inputValue}
          className={`peer block w-full appearance-none border-0 border-b-2 bg-transparent py-2.5 px-0 text-right text-sm text-gray-900 ${
            showErrorStyles
              ? 'border-secondary focus:border-secondary'
              : 'border-gray-500 focus:border-primary'
          } focus:outline-none focus:ring-0`}
          placeholder=" "
        />
        <label
          htmlFor={name}
          className={`absolute right-0 top-3 -z-10 -translate-y-6 scale-75 transform text-sm duration-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:right-0 peer-focus:-translate-y-6 peer-focus:scale-75 ${
            showErrorStyles
              ? 'text-secondary peer-focus:text-secondary'
              : 'text-gray-700 peer-focus:text-primary'
          }`}
        >
          {label}
        </label>
        {showErrorStyles && (
          <p
            id="standard_error_help"
            className="mt-2 text-right text-xs text-red-600"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

ReportHoursInput.displayName = 'Custom Complex Input';

export default ReportHoursInput;
