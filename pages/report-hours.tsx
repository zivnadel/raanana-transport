import { NextPage } from 'next'
import { RefObject, useRef, useState } from 'react'
import Button from '../components/ui/buttons/Button'
import Input from '../components/ui/form/Input'
import DoubleRadioGroup from '../components/ui/form/DoubleRadioGroup'
import DateAndHours from '../components/ui/form/DateAndHours'

const ReportHours: NextPage = () => {
  const [firstNameInvalid, setFirstNameInvalid] = useState(true)
  const [lastNameInvalid, setLastNameInvalid] = useState(true)
  const [dateIsEmpty, setDateIsEmpty] = useState(true)

  const invokeFirstNameErrorStyles = useRef<Function>(null)
  const invokeLastNameErrorStyles = useRef<Function>(null)
  const invokeDateErrorStyles = useRef<Function>(null)

  const invokeErrorStyles = (flag: boolean, ref: RefObject<Function>) => {
    if (flag && ref.current !== null) {
      ref.current()
    }
  }

  const submitReportHoursHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (firstNameInvalid || lastNameInvalid || dateIsEmpty) {
      invokeErrorStyles(firstNameInvalid, invokeFirstNameErrorStyles)
      invokeErrorStyles(lastNameInvalid, invokeLastNameErrorStyles)
      invokeErrorStyles(dateIsEmpty, invokeDateErrorStyles)
    } else {
      // TODO: handle form submission
      console.log('submitted')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={submitReportHoursHandler}
        className="flex flex-col items-center p-2 m-3 mt-32 text-center w-12/12 h-5/6 rounded-3xl md:mt-5 md:w-4/12"
      >
        <h1 className="mt-10 mb-5 text-3xl font-semibold text-primary md:mt-24">
          דיווח על עדכון ושינוי שעות ההסעה
        </h1>
        <p className="mb-5 text-2xl">!נא להכניס פרטים מדויקים</p>
        <Input
          formSubmittedWithErrorHandler={invokeFirstNameErrorStyles}
          label="שם פרטי"
          name="firstName"
          type="text"
          regex={/^[\u0590-\u05FF]+$/}
          errorMessage="הכנס שם פרטי תקין"
          setError={setFirstNameInvalid}
        />
        <Input
          formSubmittedWithErrorHandler={invokeLastNameErrorStyles}
          label="שם משפחה"
          name="lastName"
          type="text"
          regex={/^[\u0590-\u05FF]+$/}
          errorMessage="הכנס שם משפחה תקין"
          setError={setLastNameInvalid}
        />
        <DoubleRadioGroup
          id1="removeRides"
          text1="הסר הסעות"
          id2="addRides"
          text2="הוסף הסעות"
        />
        <DateAndHours
          setIsEmpty={setDateIsEmpty}
          formSubmittedWithErrorHandler={invokeDateErrorStyles}
        />
        <Button type="submit" chevron={true}>
          שלח
        </Button>
      </form>
    </div>
  )
}

export default ReportHours
