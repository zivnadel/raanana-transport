import React from "react";

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
}

const SelectHoursCheckbox: React.FC<Props> = ({
	day,
	date,
	onChangeWithDay,
	onChangeWithDate,
	selected,
}) => {
	const isSelected = (day: number, hour: string) => {
		let flag = false;

		selected!.map((entry) => {
			if (
				entry.day === day &&
				entry.hours.find((entryHour) => entryHour === hour)
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
				<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
					<div className="flex items-center pl-3">
						<input
							onChange={changeHandler}
							defaultChecked={selected && isSelected(day, "morning")}
							id={`checkbox-morning-${day}`}
							type="checkbox"
							value="morning"
							className="h-8 w-8 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label
							htmlFor={`checkbox-morning-${day}`}
							className="ml-2 w-full py-3 text-sm font-medium text-gray-900">
							בוקר
						</label>
					</div>
				</li>
				<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
					<div className="flex items-center pl-3">
						<input
							onChange={changeHandler}
							defaultChecked={selected && isSelected(day, "15:30")}
							id={`checkbox-15:30-${day}`}
							type="checkbox"
							value="15:30"
							className="h-8 w-8 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label
							htmlFor={`checkbox-15:30-${day}`}
							className="ml-2 w-full py-3 text-sm font-medium text-gray-900">
							15:30
						</label>
					</div>
				</li>
				<li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
					<div className="flex items-center pl-3">
						<input
							onChange={changeHandler}
							defaultChecked={selected && isSelected(day, "17:00")}
							id={`checkbox-17:00-${day}`}
							type="checkbox"
							value="17:00"
							className="h-8 w-8 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
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

const mapDayToString = (day: number) => {
	switch (day) {
		case 1:
			return "יום ראשון";
		case 2:
			return "יום שני";
		case 3:
			return "יום שלישי";
		case 4:
			return "יום רביעי";
		case 5:
			return "יום חמישי";
	}
};

export default SelectHoursCheckbox;
