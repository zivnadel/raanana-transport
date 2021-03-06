import { NextPage } from 'next';
import { RefObject, useRef, useState } from 'react';
import Button from '../components/ui/buttons/Button';
import ReportHoursInput from '../components/reportHours/ReportHoursInput';
import DoubleRadioGroup from '../components/reportHours/DoubleRadioGroup';
import DateAndHours from '../components/reportHours/DateAndHours';

// IMPORTANT: This form uses state mechanism of multiple refs and states for storing
// and managing values. This is a bit bloated but works well !-MAY-! change in the future
// to a store (context/redux) based solution in the future

const ReportHours: NextPage = () => {
  // States for managing validation of form
  const [firstNameInvalid, setFirstNameInvalid] = useState(true);
  const [lastNameInvalid, setLastNameInvalid] = useState(true);
  const [dateIsEmpty, setDateIsEmpty] = useState(true);

  // Refs to collect submitted data
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // States to collect the chosen action and hour
  const [action, setAction] = useState('REMOVE');
  const [hour, setHour] = useState('morning');

  // Ref function to occur changes on the input fields (childs)
  const invokeFirstNameErrorStyles = useRef<Function>(null);
  const clearFirstNameInput = useRef<Function>(null);

  const invokeLastNameErrorStyles = useRef<Function>(null);
  const clearLastNameInput = useRef<Function>(null);

  const invokeDateErrorStyles = useRef<Function>(null);
  const hideHourSelect = useRef<Function>(null);

  const invokeErrorStyles = (flag: boolean, ref: RefObject<Function>) => {
    if (flag && ref.current !== null) {
      ref.current();
    }
  };

  const submitReportHoursHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (firstNameInvalid || lastNameInvalid || dateIsEmpty) {
      // form invalid
      invokeErrorStyles(firstNameInvalid, invokeFirstNameErrorStyles);
      invokeErrorStyles(lastNameInvalid, invokeLastNameErrorStyles);
      invokeErrorStyles(dateIsEmpty, invokeDateErrorStyles);
    } else {
      // TODO: handle form submission
      console.log({
        fullName:
          firstNameInputRef.current?.value +
          ' ' +
          lastNameInputRef.current?.value,
        action: action,
        date: dateInputRef.current?.value,
        hour: hour,
      });
      if (
        clearFirstNameInput.current !== null &&
        clearLastNameInput.current !== null &&
        hideHourSelect.current !== null
      ) {
        // clearing name inputs
        clearFirstNameInput.current();
        clearLastNameInput.current();
        // hiding the hours select
        hideHourSelect.current();
      }

      // clearing date input
      dateInputRef.current!.value = '';

      // resetting the states
      setFirstNameInvalid(true);
      setLastNameInvalid(true);
      setDateIsEmpty(true);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={submitReportHoursHandler}
        className="w-12/12 m-3 mt-32 flex h-5/6 flex-col items-center rounded-3xl p-2 text-center md:mt-5 md:w-4/12"
      >
        <h1 className="mt-10 mb-5 text-3xl font-semibold text-primary md:mt-24">
          ?????????? ???? ?????????? ???????????? ???????? ??????????
        </h1>
        <p className="mb-5 text-2xl">!???? ???????????? ?????????? ??????????????</p>
        <ReportHoursInput
          ref={firstNameInputRef}
          clear={clearFirstNameInput}
          formSubmittedWithErrorHandler={invokeFirstNameErrorStyles}
          label="???? ????????"
          name="firstName"
          type="text"
          regex={/^[\u0590-\u05FF]+$/}
          errorMessage="???????? ???? ???????? ????????"
          setError={setFirstNameInvalid}
        />
        <ReportHoursInput
          ref={lastNameInputRef}
          clear={clearLastNameInput}
          formSubmittedWithErrorHandler={invokeLastNameErrorStyles}
          label="???? ??????????"
          name="lastName"
          type="text"
          regex={/^[\u0590-\u05FF]+$/}
          errorMessage="???????? ???? ?????????? ????????"
          setError={setLastNameInvalid}
        />
        <DoubleRadioGroup action={action} setAction={setAction} />
        <DateAndHours
          ref={dateInputRef}
          setIsEmpty={setDateIsEmpty}
          setHour={setHour}
          formSubmittedWithErrorHandler={invokeDateErrorStyles}
          hideHourSelect={hideHourSelect}
        />
        <Button type="submit" chevron={true}>
          ??????
        </Button>
      </form>
    </div>
  );
};

export default ReportHours;
