import { useRouter } from "next/router";
import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import {
	calculateLearningYear,
	MONTH_NAMES,
	validateMonth,
	validateWeek
} from "../../utils/dateUtils";
import Button from "../ui/buttons/Button";
import RoundedDatepicker from "../ui/datepickers/RoundedDatepicker";
import Modal from "../ui/modals/Modal";

const Report: React.FC = () => {
	const dashboardContext = React.useContext(DashboardContext);

	const router = useRouter();

	const [weekClicked, setWeekClicked] = React.useState(false);
	const [monthClicked, setMonthClicked] = React.useState(false);
	const [error, setError] = React.useState("");

	const modalDismissedHandler = () => {
		if (error) {
			setError("");
			return;
		}
		dashboardContext?.action({ type: "setShowReport", payload: false });
	};

	const onCurrentWeekSelected = () => {
		const today = new Date();
		if (!validateWeek(today)) {
			setError("!תאריך לא תקין");
			return;
		}
		router.push(`/dashboard/report/week/${today}`);
		dashboardContext?.action({ type: "setShowReport", payload: false });
	};

	const onCurrentMonthSelected = () => {
		const today = new Date();
		const month = today.getMonth() + 1;
		const year = today.getFullYear();

		if (!validateMonth(`${year}-${month}`)) {
			setError("!חודש לא תקין");
			return;
		}

		router.push(`/dashboard/report/month/${year}-${month}`);
		dashboardContext?.action({ type: "setShowReport", payload: false });
	};

	const onWeekSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!validateWeek(new Date(e.target.value))) {
			setError("!תאריך לא תקין");
			return;
		}
		router.push(`/dashboard/report/week/${e.target.value}`);
		dashboardContext?.action({ type: "setShowReport", payload: false });
	};

	const onMonthSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!validateMonth(e.target.value)) {
			setError("!חודש לא תקין");
			return;
		}
		router.push(`/dashboard/report/month/${e.target.value}`);
		dashboardContext?.action({ type: "setShowReport", payload: false });
	};

	return (
		<Modal
			heading={
				weekClicked
					? `הצגת דו"ח שבועי`
					: monthClicked
					? `הצגת דו"ח חודשי`
					: `הצגת דו"ח`
			}
			error={error ? error : ""}
			onDismiss={modalDismissedHandler}
			onBackPressed={
				weekClicked
					? () => setWeekClicked(false)
					: monthClicked
					? () => setMonthClicked(false)
					: undefined
			}>
			{!weekClicked && !monthClicked ? (
				<div className="mb-5 flex flex-col items-center p-3 md:mt-5 md:flex-row md:items-start">
					<Button onClick={() => setWeekClicked(true)} className="mt-1 md:mt-0">
						דו&quot;ח שבועי
					</Button>
					<Button
						onClick={() => setMonthClicked(true)}
						className="mt-5 md:mt-0">
						דו&quot;ח חודשי
					</Button>
				</div>
			) : weekClicked ? (
				<div className="flex flex-col items-center">
					<Button
						onClick={onCurrentWeekSelected}
						disabled={isDisabled("week")}
						className="my-5">
						שבוע נוכחי
					</Button>
					<RoundedDatepicker
						min={`${calculateLearningYear()}-09-01`}
						max={`${calculateLearningYear() + 1}-06-20`}
						placeholder="בחר תאריך"
						onChange={onWeekSelected}
						className="mb-5"
					/>
				</div>
			) : (
				monthClicked && (
					<div className="flex flex-col items-center">
						<Button
							onClick={onCurrentMonthSelected}
							disabled={isDisabled("month")}
							className="my-5">
							חודש {MONTH_NAMES[new Date().getMonth()]}
						</Button>
						<RoundedDatepicker
							min={`${calculateLearningYear()}-09`}
							max={`${calculateLearningYear() + 1}-06`}
							onChange={onMonthSelected}
							placeholder="בחר חודש"
							month={true}
							className="mb-5"
						/>
					</div>
				)
			)}
		</Modal>
	);
};

const isDisabled = (type: "week" | "month") => {
	const today = new Date();
	if (type === "month") {
		return !validateMonth(`${today.getFullYear()}-${today.getMonth() + 1}`);
	}
	if (type === "week") {
		return !validateWeek(today);
	}
};

export default Report;
