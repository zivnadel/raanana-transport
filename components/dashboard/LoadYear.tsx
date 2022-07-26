import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { DashboardContext } from "../../store/DashboardContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";

const LoadYear: React.FC = () => {
	const dashboardContext = React.useContext(DashboardContext);

	const { error, isLoading } = useFetch(
		"/api/dates",
		React.useMemo(() => {
			return {
				method: "PUT",
			};
		}, [])
	);

	if (!isLoading && !error) {
		alert("טעינת שנת הלימודים בוצעה בהצלחה!");
		dashboardContext?.action({ type: "setLoadYear", payload: false });
	}

	return (
		<>
			{isLoading && (
				<Modal>
					<LoadingSpinner />
				</Modal>
			)}
		</>
	);
};

export default LoadYear;
