import React, { ForwardRefExoticComponent, useImperativeHandle } from "react";
import { Dispatch, SetStateAction, useState, useRef } from "react";
import DateObjectType from "../../types/DateObjectType";
import { get } from "../../utils/http";

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
		const [errorMessage, setErrorMessage] = useState("שדה זה הינוי חובה");

		// loading state for fetching
		const [isLoading, setIsLoading] = useState(false);

		const dateInputRef = useRef<HTMLInputElement>(null);

		// forwarded ref
		useImperativeHandle(ref, () => dateInputRef.current!);

		const [hours, setHours] = useState<string[]>([]);

		// this call being invoked from parent
		formSubmittedWithErrorHandler.current = setShowErrorStyles.bind(null, true);
		hideHourSelect.current = setHours.bind(null, []);

		const fetchDates = async () => {
			// setIsEmpty is actually indicator for error so this is used to prevent users from
			// submitting form while the fetching in happening
			setIsEmpty(true);
			setIsLoading(true);

			const response = await get<DateObjectType>(
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
			// TODO: upgrade datepicker to also block holidays and so on
			const day = new Date(dateInputRef.current!.value).getDay() + 1;
			if (day === 6 || day === 7) {
				setErrorMessage("בימי שישי ושבת אין הסעות! הכנס תאריך מתאים");
				setShowErrorStyles(true);

				// setIsEmpty is actually indicator for error so
				setIsEmpty(true);
			} else {
				setErrorMessage("שדה זה הינו חובה");
				setShowErrorStyles(false);
				setIsEmpty(false);
				fetchDates();
			}
		};

		const hourListChangedHandler = (
			event: React.ChangeEvent<HTMLSelectElement>
		) => {
			setHour(event.target.value);
		};

		return (
			<div className="flex w-10/12 flex-col items-center justify-center">
				<input
					ref={dateInputRef}
					onChange={dateChangedHandler}
					type="date"
					min="2022-09-01"
					max="2023-06-20"
					className={`mb-2 block w-full border-0 border-b-2 bg-transparent px-0 py-3 text-right text-sm text-gray-900 ${
						showErrorStyles
							? "border-secondary text-secondary focus:border-secondary"
							: "border-gray-500 focus:border-primary"
					} appearance-none focus:outline-none focus:ring-0`}
					placeholder="Select date"
				/>
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
				{hours.length !== 0 && !isLoading && !showErrorStyles && (
					<select
						onChange={hourListChangedHandler}
						defaultValue="morning"
						id="chooseHour"
						className="m-2 w-full appearance-none border-0 border-b-2 border-gray-500 bg-transparent px-0 py-3 text-right text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-0">
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
