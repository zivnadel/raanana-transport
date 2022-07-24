import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import Button from "../ui/buttons/Button";
import Input from "../ui/inputs/Input";
import Modal from "../ui/modals/Modal";

const AddRemovePupil: React.FC = () => {
	// TODO updated name type
	const [pupilData, setPupilData] = React.useState<string | null>(null);
	const [pupilExists, setPupilExists] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	const dashboardContext = React.useContext(DashboardContext);

	const onModalDismissedHandler = () => {
		dashboardContext?.action({ type: "setShowAddRemovePupil", payload: false });
	};

	const submitNameClickedHandler = (event: React.SyntheticEvent) => {
		event.preventDefault();
		//TODO fetchName if existing
	};

	const addNewPupilClickedHandler = () => {
		setPupilExists;
	};

	return (
		<Modal
			onDismiss={onModalDismissedHandler}
			heading={
				!pupilData && !pupilExists
					? "הסרת/הוספת תלמיד ממאגר הנתונים"
					: pupilData && !pupilExists
					? "הוספת תלמיד חדש"
					: "עדכון תלמיד קיים"
			}>
			<form className="mt-5 flex w-full flex-col items-center justify-center">
				{!pupilData && !pupilExists && (
					<>
						<Input type="text" name="name" label="שם התלמיד" required={true} />
						<Button
							type="submit"
							className="my-5"
							onClick={submitNameClickedHandler}>
							אישור
						</Button>
					</>
				)}
				{pupilData && !pupilExists && (
					<>
						<p className="p-3 text-center text-lg font-medium">
							.תלמיד זה אינו קיים במאגר. לחצי למטה למעבר להוספת תלמיד חדש
						</p>
						<Button className="my-5">לחצי כאן</Button>
					</>
				)}
			</form>
		</Modal>
	);
};

export default AddRemovePupil;
