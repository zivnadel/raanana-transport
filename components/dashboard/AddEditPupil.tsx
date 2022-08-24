import { useRouter } from "next/router";
import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import { LoadingContext } from "../../store/LoadingContext";
import PupilObjectType from "../../types/PupilObjectType";
import { _get } from "../../utils/http";
import Button from "../ui/buttons/Button";
import Input from "../ui/inputs/Input";
import Modal from "../ui/modals/Modal";

const AddEditPupil: React.FC = () => {
	const [pupilName, setPupilName] = React.useState<string>("");
	const [pupilExists, setPupilExists] = React.useState(false);
	const [submitClicked, setSubmitClicked] = React.useState(false);

	const router = useRouter();

	const { isLoading, setIsLoading } = React.useContext(LoadingContext)!;
	const dashboardContext = React.useContext(DashboardContext);

	const onModalDismissedHandler = () => {
		dashboardContext?.action({ type: "setShowAddEditPupil", payload: false });
	};

	const submitNameClickedHandler = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		setIsLoading(true);
		const { response: pupil } = await _get<PupilObjectType>(
			`/api/pupils?pupilName=${pupilName}`
		);
		setSubmitClicked(true);
		if (pupil) {
			setPupilExists(true);
			router.push(`/dashboard/edit-pupil/${pupil._id}`);
			dashboardContext?.action({
				type: "setShowAddEditPupil",
				payload: false,
			});
		} else {
			setPupilExists(false);
		}
		setIsLoading(false);
	};

	const addPupilClickedHandler = (event: React.SyntheticEvent) => {
		event.preventDefault();
		router.push(`dashboard/add-pupil/${pupilName}`);
		dashboardContext?.action({ type: "setShowAddEditPupil", payload: false });
	};

	return (
		<>
			{!(pupilExists && submitClicked) && !isLoading && (
				<Modal
					onDismiss={onModalDismissedHandler}
					heading={
						!submitClicked && !pupilExists
							? "הוספת/עריכת תלמיד במאגר הנתונים"
							: submitClicked && !pupilExists
							? "הוספת תלמיד חדש"
							: ""
					}>
					<form className="mt-5 flex w-full flex-col items-center justify-center">
						{!submitClicked && !pupilExists && (
							<>
								<Input
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										setPupilName(event.target.value);
									}}
									value={pupilName}
									type="text"
									name="name"
									label="שם התלמיד"
									required={true}
								/>
								<Button
									type="submit"
									className="my-5"
									onClick={submitNameClickedHandler}>
									אישור
								</Button>
							</>
						)}
						{submitClicked && !pupilExists && (
							<>
								<p className="p-3 text-center text-lg font-medium">
									תלמיד זה אינו קיים. להוספת תלמיד זה, לחצי למטה
								</p>
								<Button className="my-5" onClick={addPupilClickedHandler}>
									לחצי כאן
								</Button>
							</>
						)}
					</form>
				</Modal>
			)}
		</>
	);
};

export default AddEditPupil;
