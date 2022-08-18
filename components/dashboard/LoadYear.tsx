import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import { _put } from "../../utils/http";
import Button from "../ui/buttons/Button";
import ErrorParagraph from "../ui/paragraphs/ErrorParagraph";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";

const LoadYear: React.FC = () => {
	const dashboardContext = React.useContext(DashboardContext);

	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState("");

	const loadYearClickedHandler = async () => {
		setIsLoading(true);
		await _put("/api/dates").catch((error) => setError(error.message));
		alert("טעינת שנת הלימודים בוצעה בהצלחה!");
		dashboardContext?.action({ type: "setLoadYear", payload: false });
		setIsLoading(false);
	};

	return (
		<Modal
			className="text-center"
			heading={error || isLoading ? "" : "לחצי על הכפתור לאתחול שנת הלימודים"}
			error={error}
			onDismiss={
				isLoading
					? undefined
					: () =>
							dashboardContext?.action({
								type: "setLoadYear",
								payload: false,
							})
			}>
			{isLoading && <LoadingSpinner />}
			{error && <ErrorParagraph error={error} />}
			{!error && !isLoading && (
				<>
					<div className="m-2 mx-4 rounded-2xl bg-primary/50 p-4">
						<p className="mb-2 font-medium">
							פעולה זו נדרשת לביצוע פעם אחת בלבד בתחילת השנה
						</p>
						<p className="font-bold text-green-900">
							שימי לב שאתחול השנה דורס את הנתונים הקיימים
						</p>
					</div>
					<Button className="mt-2.5 mb-5" onClick={loadYearClickedHandler}>
						טעינת שנה&quot;ל
					</Button>
				</>
			)}
		</Modal>
	);
};

export default LoadYear;
