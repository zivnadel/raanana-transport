import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import Button from "../ui/buttons/Button";
import Modal from "../ui/modals/Modal";

const MONTH_NAMES = [
	"ינואר",
	"פברואר",
	"מרץ",
	"אפריל",
	"מאי",
	"יוני",
	"יולי",
	"אוגוסט",
	"ספטמבר",
	"אוקטובר",
	"נובמבר",
	"דצמבר",
];

const Report: React.FC = () => {
	const dashboardContext = React.useContext(DashboardContext);

	const [weekClicked, setWeekClicked] = React.useState(false);
	const [monthClicked, setMonthClicked] = React.useState(false);

	const modalDismissedHandler = () => {
		dashboardContext?.action({ type: "setShowReport", payload: false });
	};

	return (
		<Modal
			heading={`הדפסת דו"ח`}
			onDismiss={modalDismissedHandler}
			onBackPresses={
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
				<></>
			) : (
				monthClicked && <></>
			)}
		</Modal>
	);
};

export default Report;
