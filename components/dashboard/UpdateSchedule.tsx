import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { DashboardContext } from "../../store/DashboardContext";
import { LoadingContext } from "../../store/LoadingContext";
import DayObjectType from "../../types/DayObjectType";
import { _patch } from "../../utils/http";
import SelectHoursCheckbox from "../SelectHoursCheckbox";
import Button from "../ui/buttons/Button";
import Modal from "../ui/modals/Modal";
import ErrorParagraph from "../ui/paragraphs/ErrorParagraph";

const UpdateSchedule: React.FC = () => {
	const dashboardContext = React.useContext(DashboardContext);

	const [schedule, setSchedule] = React.useState<DayObjectType[]>();

	const { response: initialSchedule } = useFetch<DayObjectType[]>(
		"/api/week",
		React.useMemo(() => ({ method: "GET" }), [])
	);

	React.useEffect(() => {
		if (initialSchedule) {
			setSchedule(initialSchedule);
		}
	}, [initialSchedule]);

	const [error, setError] = React.useState("");

	const { isLoading, setIsLoading } = React.useContext(LoadingContext)!;

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
		if (scheduleSnapshot) {
			for (let scheduleDay of scheduleSnapshot) {
				if (scheduleDay.day === day) {
					if (
						e.target.checked &&
						!scheduleDay.hours.includes(
							e.target.value as "morning" | "15:30" | "17:00"
						)
					) {
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
		}
	};

	const onSubmitHandler = async () => {
		setIsLoading(true);
		await _patch("/api/week", schedule).catch((error) =>
			setError(error.message)
		);
		alert(`הלו"ז השבועי עודכן בהצלחה!`);
		setIsLoading(false);
		dashboardContext?.action({ type: "setShowUpdateSchedule", payload: false });
	};

	return (
		<>
			{initialSchedule && !isLoading && (
				<Modal
					onDismiss={closeModalHandler}
					heading={isLoading || error ? "" : `לו"ז שבועי`}
					error={error}>
					{schedule && (
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
					)}
				</Modal>
			)}
		</>
	);
};

export default UpdateSchedule;
