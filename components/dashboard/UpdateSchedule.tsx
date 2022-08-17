import { useRouter } from "next/router";
import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import DayObjectType from "../../types/DayObjectType";
import { _patch } from "../../utils/http";
import SelectHoursCheckbox from "../SelectHoursCheckbox";
import Button from "../ui/buttons/Button";
import ErrorParagraph from "../ui/paragraphs/ErrorParagraph";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";

interface Props {
	initialSchedule: DayObjectType[];
}

const UpdateSchedule: React.FC<Props> = ({ initialSchedule }) => {
	const dashboardContext = React.useContext(DashboardContext);

	const router = useRouter();

	const [schedule, setSchedule] =
		React.useState<DayObjectType[]>(initialSchedule);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState("");

	const closeModalHandler = () => {
		dashboardContext?.action({ type: "setShowUpdateSchedule", payload: false });
	};

	const onCheckboxChanged = (
		e: React.ChangeEvent<HTMLInputElement>,
		day: number
	) => {
		setError("");
		const scheduleSnapshot: typeof schedule = JSON.parse(
			JSON.stringify(schedule)
		);
		for (let scheduleDay of scheduleSnapshot) {
			if (scheduleDay.day === day) {
				if (e.target.checked) {
					scheduleDay.hours.push(
						e.target.value as "morning" | "15:30" | "17:00"
					);
				} else {
					scheduleDay.hours = scheduleDay.hours.filter(
						(hour) => hour != e.target.value
					);
				}
			}
		}
		setSchedule(scheduleSnapshot);
	};

	const onSubmitHandler = async () => {
		setIsLoading(true);
		await _patch("/api/week", schedule).catch((error) =>
			setError(error.message)
		);
		alert(`הלו"ז השבועי עודכן בהצלחה!`);
		setIsLoading(false);
		router.reload();
	};

	return (
		<Modal
			onDismiss={closeModalHandler}
			heading={isLoading || error ? "" : `לו"ז שבועי`}
			error={error}>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				schedule && (
					<div className="flex flex-col items-center py-2">
						{schedule && (
							<>
								{schedule.map((day) => (
									<SelectHoursCheckbox
										day={day.day}
										key={day.day}
										selected={schedule}
										onChangeWithDay={onCheckboxChanged}
									/>
								))}
								<Button className="my-3" onClick={onSubmitHandler}>
									אישור
								</Button>
							</>
						)}
						{error && <ErrorParagraph error={error} />}
					</div>
				)
			)}
		</Modal>
	);
};

export default UpdateSchedule;
