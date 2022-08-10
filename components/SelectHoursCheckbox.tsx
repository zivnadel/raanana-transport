import React from "react";
import DayObjectType from "../types/DayObjectType";
import { BiCalendarExclamation } from "react-icons/bi";
import { mapDayToString } from "../utils/dateUtils";

interface Props {
	day: number;
	date?: string;
	onChangeWithDay?: (
		event: React.ChangeEvent<HTMLInputElement>,
		day: number
	) => void;
	onChangeWithDate?: (
		event: React.ChangeEvent<HTMLInputElement>,
		date: string
	) => void;
	selected?: { day: number; hours: string[]; date?: string }[];
	weekSchedule?: DayObjectType[];
	disabled?: boolean;
}

const SelectHoursCheckbox: React.FC<Props> = ({
	day,
	date,
	onChangeWithDay,
	onChangeWithDate,
	selected,
	weekSchedule,
	disabled,
}) => {
	const hourExistsInDay = (
		day: number,
		hour: string,
		schedule:
			| { day: number; hours: string[]; date?: string }[]
			| DayObjectType[]
	) => {
		let flag = false;

		schedule!.forEach((entry) => {
			if (
				entry.day === day &&
				entry.hours.includes(hour as "morning" | "15:30" | "17:00")
			) {
				flag = true;
			}
		});
		return flag;
	};

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChangeWithDay) {
			return onChangeWithDay(event, day);
		}
		if (onChangeWithDate && date) {
			return onChangeWithDate(event, date);
		}
	};

	return (
		<div className="flex w-full flex-col items-center">
			<h3 className="mb-0.5 font-semibold text-gray-900">
				{date ? `${date} - ${mapDayToString(day)}` : mapDayToString(day)}
			</h3>
			<ul className="mx-3 mb-2 flex w-5/6 items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900">
				<li className="w-2/6 border-b border-gray-200 sm:border-b-0 sm:border-r">
					<div className="flex items-center pl-3 pr-2.5">
						<input
							onChange={changeHandler}
							defaultChecked={
								selected && hourExistsInDay(day, "morning", selected)
							}
							id={`checkbox-morning-${day}`}
							type="checkbox"
							value="morning"
							disabled={disabled}
							className={`${
								weekSchedule && !hourExistsInDay(day, "morning", weekSchedule)
									? "text-red-600 disabled:text-red-600"
									: "text-blue-600 disabled:text-primary"
							} h-6 w-6 rounded border-gray-300 bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500`}
						/>
						<label
							htmlFor={`checkbox-morning-${day}`}
							className="ml-2 w-full py-3 text-sm font-medium text-gray-900">
							בוקר
						</label>
					</div>
				</li>
				<li className="w-2/6 border-b border-gray-200 sm:border-b-0 sm:border-r">
					<div className="flex items-center pl-3 pr-2.5">
						<input
							onChange={changeHandler}
							defaultChecked={
								selected && hourExistsInDay(day, "15:30", selected)
							}
							id={`checkbox-15:30-${day}`}
							type="checkbox"
							value="15:30"
							disabled={disabled}
							className={`${
								weekSchedule && !hourExistsInDay(day, "15:30", weekSchedule)
									? "text-red-600 disabled:text-red-600"
									: "text-blue-600 disabled:text-primary"
							} h-6 w-6 rounded border-gray-300 bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500`}
						/>
						<label
							htmlFor={`checkbox-15:30-${day}`}
							className="ml-2 w-full py-3 text-sm font-medium text-gray-900">
							15:30
						</label>
					</div>
				</li>
				<li className="w-2/6 border-b border-gray-200 sm:border-b-0 sm:border-r">
					<div className="flex items-center pl-3 pr-2.5">
						<input
							onChange={changeHandler}
							defaultChecked={
								selected && hourExistsInDay(day, "17:00", selected)
							}
							id={`checkbox-17:00-${day}`}
							type="checkbox"
							value="17:00"
							disabled={disabled}
							className={`${
								weekSchedule && !hourExistsInDay(day, "17:00", weekSchedule)
									? "text-red-600 disabled:text-red-600"
									: "text-blue-600 disabled:text-primary"
							} h-6 w-6 rounded border-gray-300 bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500`}
						/>
						<label
							htmlFor={`checkbox-17:00-${day}`}
							className="ml-2 mr-2 w-full py-3 text-sm font-medium text-gray-900">
							17:00
						</label>
					</div>
				</li>
			</ul>
		</div>
	);
};

export default SelectHoursCheckbox;
