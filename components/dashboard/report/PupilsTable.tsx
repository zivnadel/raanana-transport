import DateObjectType from "../../../types/DateObjectType";
import ContainerButton from "../../ui/buttons/ContainerButton";
import TransparentButton from "../../ui/buttons/TransparentButton";
import Modal from "../../ui/modals/Modal";

interface Props {
	monthData: DateObjectType[];
	onDismiss: () => void;
}

const PupilsTable: React.FC<Props> = ({ monthData, onDismiss }) => {
	const pupilsMonthlyData = produceMonthlyPupilData(monthData);

	return (
		<Modal onDismiss={onDismiss} heading='דו"ח תלמידים'>
			<div className="relative w-full rounded-lg p-5 shadow-md">
				<table className="w-full text-center text-sm text-gray-500">
					<thead className="bg-gray-50 text-xs text-gray-700">
						<th scope="col" className="py-3 px-6">
							פירוט הסעות
						</th>
						<th scope="col" className="py-3 px-6">
							מחיר חודשי
						</th>
						<th scope="col" className="py-3 px-6">
							שם התלמיד
						</th>
					</thead>
					<tbody>
						{pupilsMonthlyData.map((pupil) => (
							<tr
								key={pupil.name}
								className="border-b bg-white hover:bg-gray-50">
								<th
									scope="row"
									className="whitespace-nowrap py-4 px-6 font-medium">
									<ContainerButton>פתיחת הפירוט</ContainerButton>
								</th>
								<td className="py-4 px-6">{pupil.monthlyPrice} ₪</td>
								<td className="py-4 px-6">{pupil.name}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Modal>
	);
};

const produceMonthlyPupilData = (monthData: DateObjectType[]) => {
	type DateWithHours = {
		date: string;
		hour: ("morning" | "15:30" | "17:00")[];
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
						existingDate.hour.push(hour);
					} else {
						pupil.dates.push({ date: date.date, hour: [hour] });
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
								hour: [hour],
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
