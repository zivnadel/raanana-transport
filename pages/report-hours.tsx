import { NextPage } from "next";
import { RefObject, useRef, useState } from "react";
import Button from "../components/ui/buttons/Button";
import ReportHoursInput from "../components/reportHours/ReportHoursInput";
import DoubleRadioGroup from "../components/reportHours/DoubleRadioGroup";
import DateAndHours from "../components/reportHours/DateAndHours";
import { _post } from "../utils/http";
import Modal from "../components/ui/modals/Modal";
import ErrorParagraph from "../components/ui/paragraphs/ErrorParagraph";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import SuccessParagraph from "../components/ui/paragraphs/SuccessParagraph";

// ! IMPORTANT: This form uses state mechanism of multiple refs and states for storing
// ! and managing values. This is a bit bloated but works well and !-MAY-! be change in the future
// ! to a store (context/redux) based solution.

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
	const [action, setAction] = useState("REMOVE");
	const [hour, setHour] = useState("morning");

	// Ref function to occur changes on the input fields (childs)
	const invokeFirstNameErrorStyles = useRef<Function>(null);
	const clearFirstNameInput = useRef<Function>(null);

	const invokeLastNameErrorStyles = useRef<Function>(null);
	const clearLastNameInput = useRef<Function>(null);

	const invokeDateErrorStyles = useRef<Function>(null);
	const hideHourSelect = useRef<Function>(null);

	const [fetchError, setFetchError] = useState("");
	const [fetchSuccess, setFetchSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const invokeErrorStyles = (flag: boolean, ref: RefObject<Function>) => {
		if (flag && ref.current !== null) {
			ref.current();
		}
	};

	const submitReportHoursHandler = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		if (firstNameInvalid || lastNameInvalid || dateIsEmpty) {
			// form invalid
			invokeErrorStyles(firstNameInvalid, invokeFirstNameErrorStyles);
			invokeErrorStyles(lastNameInvalid, invokeLastNameErrorStyles);
			invokeErrorStyles(dateIsEmpty, invokeDateErrorStyles);
		} else {
			setIsLoading(true);
			const { response, status } = await _post("/api/report", {
				name:
					firstNameInputRef.current?.value +
					" " +
					lastNameInputRef.current?.value,
				action: action,
				date: dateInputRef.current?.value,
				hour: hour,
			});
			setIsLoading(false);

			if (status === 406) {
				setFetchError(response.message);
				return;
			}

			setFetchSuccess(true);
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
			dateInputRef.current!.value = "";

			// resetting the states
			setFirstNameInvalid(true);
			setLastNameInvalid(true);
			setDateIsEmpty(true);
			setHour("morning");
		}
	};

	return (
		<div className="flex w-full items-center overflow-x-hidden overflow-y-scroll lg:h-full lg:justify-center">
			<form
				onSubmit={submitReportHoursHandler}
				className="m-3 flex h-5/6 w-full flex-col items-center rounded-3xl p-2 text-center md:mt-5 lg:justify-center">
				<h1 className="mb-5 w-full text-3xl font-semibold text-primary lg:mt-0">
					דיווח על עדכון ושינוי שעות ההסעה
				</h1>
				<p className="mb-5 text-2xl">!נא להכניס פרטים מדויקים</p>
				<div className="flex w-full flex-col items-center justify-center md:w-2/6">
					<ReportHoursInput
						ref={firstNameInputRef}
						clear={clearFirstNameInput}
						formSubmittedWithErrorHandler={invokeFirstNameErrorStyles}
						label="שם פרטי"
						name="firstName"
						type="text"
						regex={/^[\u0590-\u05FF]+$/}
						errorMessage="הכנס שם פרטי תקין"
						setError={setFirstNameInvalid}
					/>
					<ReportHoursInput
						ref={lastNameInputRef}
						clear={clearLastNameInput}
						formSubmittedWithErrorHandler={invokeLastNameErrorStyles}
						label="שם משפחה"
						name="lastName"
						type="text"
						regex={/^[\u0590-\u05FF]+$/}
						errorMessage="הכנס שם משפחה תקין"
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
					<Button type="submit" chevron={true} className="mt-10 md:z-0">
						שלח
					</Button>
				</div>
				{(fetchError || fetchSuccess || isLoading) && (
					<Modal
						onDismiss={
							fetchError
								? () => setFetchError("")
								: fetchSuccess
								? () => setFetchSuccess(false)
								: undefined
						}>
						{isLoading && <LoadingSpinner />}
						{fetchError && <ErrorParagraph error={fetchError} />}
						{fetchSuccess && <SuccessParagraph message="!המידע עודכן בהצלחה" />}
					</Modal>
				)}
			</form>
		</div>
	);
};

export default ReportHours;
