import React, {
	ForwardRefExoticComponent,
	useEffect,
	useImperativeHandle,
} from "react";
import { Dispatch, SetStateAction, useState, useRef } from "react";
import DateObjectType from "../../types/DateObjectType";
import {
	calculateLearningYear,
	calculateMin,
	toNormalDateString,
} from "../../utils/dateUtils";
import { _get } from "../../utils/http";

interface Props {
	setIsEmpty: Dispatch<SetStateAction<boolean>>;
	setHour: Dispatch<SetStateAction<string>>;
	formSubmittedWithErrorHandler: any;
	hideHourSelect: any;
}

const DateAndHours = React.forwardRef<HTMLInputElement, Props>(
	(
		{ setIsEmpty, setHour, formSubmittedWithErrorHandler, hideHourSelect },
		ref
	) => {
		// This is used so at first, there is an error (because fields are empty), so it
		// is not possible to submit the form, but styles are not yet shows because the
		// user didn't get a chance to fill the form.
		const [showErrorStyles, setShowErrorStyles] = useState(false);
		const [errorMessage, setErrorMessage] = useState("שדה זה הינו חובה");

		// loading state for fetching
		const [isLoading, setIsLoading] = useState(false);

		const dateInputRef = useRef<HTMLInputElement>(null);

		// forwarded ref
		useImperativeHandle(ref, () => dateInputRef.current!);

		const [hours, setHours] = useState<string[] | null>(null);

		useEffect(() => {
			if (hours && hours.length == 0) {
				setErrorMessage("כרגע, בתאריך זה לא קיימות הסעות");
				setShowErrorStyles(true);
			}
		}, [hours]);

		// this call being invoked from parent
		formSubmittedWithErrorHandler.current = setShowErrorStyles.bind(null, true);
		hideHourSelect.current = setHours.bind(null, null);

		const fetchDates = async () => {
			// setIsEmpty is actually indicator for error so this is used to prevent users from
			// submitting form while the fetching in happening
			setIsEmpty(true);
			setIsLoading(true);

			const { response } = await _get<DateObjectType>(
				`/api/dates/?date=${new Date(dateInputRef.current?.value!)}`
			);

			setIsEmpty(false);
			setShowErrorStyles(false);
			setIsLoading(false);

			let hours: string[] = [];
			const transportations = response.transportations;
			if (transportations.hasOwnProperty("morning")) {
				hours.push("morning");
			}
			if (transportations.hasOwnProperty("15:30")) {
				hours.push("15:30");
			}
			if (transportations.hasOwnProperty("17:00")) {
				hours.push("17:00");
			}

			return setHours(hours);
		};

		const dateChangedHandler = async () => {
			const date = new Date(dateInputRef.current!.value);
			const day = date.getDay() + 1;
			const year = calculateLearningYear();

			if (
				day === 6 ||
				day === 7 ||
				date < calculateMin() ||
				date > new Date(`${year + 1}-06-20`)
			) {
				if (
					day !== 6 &&
					day !== 7 &&
					date >= new Date(`${year}-09-01`) &&
					date < calculateMin()
				) {
					setErrorMessage("לא ניתן לערוך שינויים בתאריכים שעברו");
				} else {
					setErrorMessage("בתאריך זה אין הסעות! הכנס תאריך מתאים");
				}

				setShowErrorStyles(true);

				// setIsEmpty is actually indicator for error so
				setIsEmpty(true);
			} else {
				setErrorMessage("שדה זה הינו חובה");
				setShowErrorStyles(false);
				setIsEmpty(false);
				setHour("morning");
				fetchDates();
			}
		};

		const hourListChangedHandler = (
			event: React.ChangeEvent<HTMLSelectElement>
		) => {
			setHour(event.target.value);
		};

		return (
			<div className="relative mt-5 flex w-10/12 flex-col items-center justify-center md:mt-0">
				<input
					ref={dateInputRef}
					id="date"
					onClick={(e: any) => e.target.showPicker()}
					onChange={dateChangedHandler}
					type="date"
					className={`peer block w-full appearance-none border-0 border-b-2 bg-transparent py-2.5 px-0 text-right text-sm text-gray-900 ${
						showErrorStyles
							? "border-secondary focus:border-secondary"
							: "border-gray-500 focus:border-primary"
					} focus:outline-none focus:ring-0`}
				/>
				<label
					htmlFor="date"
					className={`absolute right-0 top-3 -z-10 -translate-y-8 scale-75 transform text-lg duration-500 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:right-0 peer-focus:-translate-y-8 peer-focus:scale-75 md:hidden ${
						showErrorStyles
							? "text-secondary peer-focus:text-secondary"
							: "text-gray-700 peer-focus:text-primary"
					}`}>
					תאריך
				</label>
				{isLoading && (
					<p
						id="standard_error_help"
						className="mt-2 block w-full text-right text-xs text-primary">
						...טוען שעות
					</p>
				)}
				{showErrorStyles && (
					<p
						id="standard_error_help"
						className="mt-2 block w-full text-right text-xs text-red-600">
						{errorMessage}
					</p>
				)}
				{/* Will show hours conditinally after receieving date info from db */}
				{hours && hours.length !== 0 && !isLoading && !showErrorStyles && (
					<select
						onChange={hourListChangedHandler}
						defaultValue="morning"
						id="chooseHour"
						className="m-2 w-full appearance-none border-0 border-b-2 border-gray-500 bg-transparent py-3 text-right text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-0">
						{hours.map((hour) => (
							<option key={hour} value={hour}>
								{hour === "morning" ? "בוקר" : hour}
							</option>
						))}
					</select>
				)}
			</div>
		);
	}
);

DateAndHours.displayName = "Date and Hours";

export default DateAndHours;
