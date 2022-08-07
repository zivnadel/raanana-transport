import React from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { DashboardContext } from "../../store/DashboardContext";
import DateObjectType, { busType } from "../../types/DateObjectType";
import PricesObjectType from "../../types/PricesObjectType";
import {
	calculateBusType,
	calculateLearningYear,
	calculatePrice,
} from "../../utils/dateUtils";
import { _get, _patch } from "../../utils/http";
import Button from "../ui/buttons/Button";
import ErrorParagraph from "../ui/ErrorParagraph";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";
import SelectHoursCheckbox from "./SelectHoursCheckbox";

interface Props {
	initialDate: DateObjectType;
}

const ViewWeek: React.FC<Props> = ({ initialDate }) => {
	const dashboardContext = React.useContext(DashboardContext);

	const [currentWeekDate, setCurrentWeekDate] = React.useState(
		new Date(initialDate.date)
	);
	const [currentWeek, setCurrentWeek] = React.useState<DateObjectType[]>([]);
	const [modeledWeek, setModeledWeek] = React.useState<
		{ day: number; hours: string[]; date?: string }[]
	>([]);
	const [error, setError] = React.useState<Error | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	const onModalDismissedHandler = () => {
		dashboardContext?.action({ type: "setShowViewWeek", payload: false });
	};

	React.useEffect(() => {
		(async () => {
			setIsLoading(true);
			const response = await _get<DateObjectType[]>(
				`/api/dates?week=${currentWeekDate}`
			).catch((error) => setError(error));
			if (response) {
				setCurrentWeek(response);
				let modeledWeekData: { day: number; hours: string[]; date?: string }[] =
					[];
				response.map((date) => {
					modeledWeekData.push({
						day: date.day,
						hours: Object.keys(date.transportations),
						date: date.date,
					});
				});
				setModeledWeek(modeledWeekData);
			}
			setIsLoading(false);
		})();
	}, [currentWeekDate]);

	const leftChevronClickedHandler = () => {
		setCurrentWeekDate((prevWeekDate) => {
			const nextWeekDate = new Date(prevWeekDate);
			nextWeekDate.setDate(prevWeekDate.getDate() + 7);
			return nextWeekDate;
		});
	};

	const rightChevronClickedHandler = () => {
		setCurrentWeekDate((prevWeekDate) => {
			const nextWeekDate = new Date(prevWeekDate);
			nextWeekDate.setDate(prevWeekDate.getDate() - 7);
			return nextWeekDate;
		});
	};

	const dateChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentWeekDate(new Date(event.target.value));
	};

	const onCheckboxCheckedHandler = (
		event: React.ChangeEvent<HTMLInputElement>,
		date: string
	) => {
		setModeledWeek((prevWeek) => {
			let copyWeek = prevWeek.map((day) => {
				return { ...day };
			});
			copyWeek.map((day) => {
				if (day.date === date) {
					if (event.target.checked) {
						day.hours.push(event.target.value);
					} else {
						day.hours = day.hours.filter((hour) => hour !== event.target.value);
					}
				}
			});
			return copyWeek;
		});
	};

	const submitClickedHandler = async () => {
		setIsLoading(true);
		const prices = await _get<PricesObjectType>("/api/prices");
		let weekData: typeof currentWeek = JSON.parse(JSON.stringify(currentWeek));

		for (let day of weekData) {
			for (let modeledDay of modeledWeek) {
				if (day.date === modeledDay.date) {
					Object.keys(day.transportations).map((hour) => {
						if (!modeledDay.hours.includes(hour)) {
							delete day.transportations[
								hour as keyof typeof day.transportations
							];
						}
					});
					for (let hour of modeledDay.hours) {
						if (
							!day.transportations[hour as keyof typeof day.transportations]
						) {
							const pupils = await _get<string[]>(
								`/api/pupils?day=${day.day}&hour=${hour}`
							);

							let dayBusType: busType[] = [];

							if (hour === "morning") {
								dayBusType = [busType.morning];
							} else {
								dayBusType = calculateBusType(pupils.length);
							}

							const price = calculatePrice(dayBusType, prices);

							day.transportations[hour as keyof typeof day.transportations] = {
								pupils,
								busType: dayBusType,
								price,
							};

							day.totalAmount += price;
						}
					}
				}
			}
		}

		await _patch("/api/dates", weekData);

		alert("עדכון נתוני השבוע בוצע בהצלחה!");

		setIsLoading(false);
	};

	return (
		<Modal
			onDismiss={onModalDismissedHandler}
			error={error ? error.message : ""}>
			{isLoading && <LoadingSpinner />}
			{!isLoading && (
				<div className="w-full px-3">
					<div className="flex w-full items-center justify-between rounded-full bg-primary/50 py-3 px-8">
						<FaChevronCircleLeft
							onClick={leftChevronClickedHandler}
							className="cursor-pointer text-2xl text-green-800 hover:text-green-800/70"
						/>
						<input
							type="date"
							min={`${calculateLearningYear()}-09-01`}
							max={`${calculateLearningYear() + 1}-06-20`}
							onChange={dateChangedHandler}
							value={`${currentWeekDate.getFullYear()}-${(
								"0" +
								(currentWeekDate.getMonth() + 1)
							).slice(-2)}-${("0" + currentWeekDate.getDate()).slice(-2)}`}
							className={`border-0 border-b-2 border-green-800 bg-transparent px-0 py-1 text-center text-sm text-gray-900 selection:appearance-none focus:outline-none focus:ring-0`}
						/>
						<FaChevronCircleRight
							onClick={rightChevronClickedHandler}
							className="cursor-pointer text-2xl text-green-800 hover:text-green-800/70"
						/>
					</div>
				</div>
			)}
			{!isLoading && currentWeek.length !== 0 && (
				<>
					<div className="py-6">
						{modeledWeek.map((day) => (
							<SelectHoursCheckbox
								onChangeWithDate={onCheckboxCheckedHandler}
								day={day.day}
								date={day.date}
								key={day.date}
								selected={modeledWeek}
							/>
						))}
					</div>
					<div className="w-full text-center">
						<Button onClick={submitClickedHandler} className="mt-0 mb-5">
							שלחי
						</Button>
					</div>
				</>
			)}
			{!isLoading && currentWeek.length === 0 && (
				<ErrorParagraph error="תאריך זה אינו בתחום שנת הלימודים! בחרי תאריך אחר" />
			)}
		</Modal>
	);
};

export default ViewWeek;
