import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import { LoadingContext } from "../../store/LoadingContext";
import { _put } from "../../utils/http";
import Button from "../ui/buttons/Button";
import Modal from "../ui/modals/Modal";
import ErrorParagraph from "../ui/paragraphs/ErrorParagraph";

const LoadYear: React.FC = () => {
	const dashboardContext = React.useContext(DashboardContext);

	const loadingContext = React.useContext(LoadingContext);
	const [error, setError] = React.useState("");

	const loadYearClickedHandler = async () => {
		loadingContext?.setIsLoading(true);
		await _put("/api/dates").catch((error) => setError(error.message));
		alert("טעינת שנת הלימודים בוצעה בהצלחה!");
		dashboardContext?.action({ type: "setLoadYear", payload: false });
		loadingContext?.setIsLoading(false);
	};

	return (
		<Modal
			className="text-center"
			heading={error ? "" : "לחצי על הכפתור לאתחול שנת הלימודים"}
			error={error}
			onDismiss={() =>
				dashboardContext?.action({
					type: "setLoadYear",
					payload: false,
				})
			}>
			{error && <ErrorParagraph error={error} />}
			{!error && !loadingContext?.isLoading && (
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
