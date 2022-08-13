import React from "react";
import exportFromJSON from "export-from-json";

import DateObjectType from "../../../types/DateObjectType";
import Button from "../../ui/buttons/Button";
import ContainerButton from "../../ui/buttons/ContainerButton";
import Modal from "../../ui/modals/Modal";
import Table from "../../ui/Table";
import SearchInput from "../../ui/inputs/SearchInput";

interface Props {
	monthData: DateObjectType[];
	onDismiss: () => void;
	month: string;
}

const PupilsTable: React.FC<Props> = ({ monthData, onDismiss, month }) => {
	const pupilsMonthlyData = produceMonthlyPupilData(monthData);

	const [filteredPupils, setFilteredPupils] = React.useState(pupilsMonthlyData);

	const [pupilIndex, setPupilIndex] = React.useState<number | null>(null);

	const exportMonthReportToExcel = () => {
		const newData = pupilsMonthlyData.map((pupil) => ({
			"שם התלמיד": pupil.name,
			"מחיר חודשי": pupil.monthlyPrice,
		}));

		exportFromJSON({
			data: newData,
			fileName: `דוח תלמידים חודשי - ${month}`,
			exportType: "xls",
		});
	};

	const exportPupilMonthDataToExcel = () => {
		const pupilData = pupilsMonthlyData[pupilIndex!].dates.map((date) => ({
			תאריך: date.date,
			הסעות: date.hours.join(", ").replace("morning", "בוקר"),
		}));

		exportFromJSON({
			data: pupilData,
			fileName: pupilsMonthlyData[pupilIndex!].name,
			exportType: "xls",
		});
	};

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilteredPupils(
			pupilsMonthlyData.filter((pupil) => {
				const [firstName, lastName] = pupil.name.split(" ");
				return (
					firstName.startsWith(e.target.value) ||
					lastName.startsWith(e.target.value) ||
					pupil.name.startsWith(e.target.value)
				);
			})
		);
	};

	return (
		<>
			<Modal
				onDismiss={onDismiss}
				onBackPressed={
					pupilIndex !== null ? () => setPupilIndex(null) : undefined
				}
				heading='דו"ח תלמידים'>
				{pupilIndex === null ? (
					<div className="w-full text-center">
						<Button
							className="mb-2 mt-3 p-3"
							onClick={exportMonthReportToExcel}>
							ייצוא לאקסל
						</Button>
						<div className="flex w-full justify-center p-3">
							<SearchInput onChange={onSearch} className="w-4/6" />
						</div>
						<Table
							className="pt-2"
							labels={["פירוט הסעות", "מחיר חודשי", "שם התלמיד"]}
							tableBody={filteredPupils.map((pupil, index) => [
								<ContainerButton onClick={() => setPupilIndex(index)}>
									פתיחת הפירוט
								</ContainerButton>,
								pupil.monthlyPrice,
								pupil.name,
							])}
						/>
					</div>
				) : (
					<div className="w-full text-center">
						<Button
							className="mb-0 mt-3 p-3"
							onClick={exportPupilMonthDataToExcel}>
							ייצוא לאקסל
						</Button>
						<Table
							labels={["הסעות", "תאריך"]}
							tableBody={pupilsMonthlyData[pupilIndex].dates.map((date) => [
								date.hours.join(", ").replace("morning", "בוקר"),
								date.date,
							])}
						/>
					</div>
				)}
			</Modal>
		</>
	);
};

const produceMonthlyPupilData = (monthData: DateObjectType[]) => {
	type DateWithHours = {
		date: string;
		hours: ("morning" | "15:30" | "17:00")[];
	};

	type pupilData = {
		name: string;
		monthlyPrice: number;
		dates: DateWithHours[];
	};

	let monthlyPupilData: pupilData[] = [];

	monthData.forEach((date) => {
		let hour: keyof typeof date.transportations;
		for (hour in date.transportations) {
			for (let pupilName of date.transportations[hour]!.pupils) {
				let pupil = monthlyPupilData.find((pupil) => pupil.name === pupilName);
				if (pupil) {
					let existingDate = pupil.dates.find(
						(existingDate) => existingDate.date === date.date
					);
					if (existingDate) {
						existingDate.hours.push(hour);
					} else {
						pupil.dates.push({ date: date.date, hours: [hour] });
					}
					pupil.monthlyPrice +=
						date.transportations[hour]!.price /
						date.transportations[hour]!.pupils.length;
				} else {
					monthlyPupilData.push({
						name: pupilName,
						monthlyPrice:
							date.transportations[hour]!.price /
							date.transportations[hour]!.pupils.length,
						dates: [
							{
								date: date.date,
								hours: [hour],
							},
						],
					});
				}
			}
		}
	});

	return monthlyPupilData;
};

export default PupilsTable;
