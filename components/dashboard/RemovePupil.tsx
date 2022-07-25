import React from "react";
import { DashboardContext } from "../../store/DashboardContext";
import { deleteOne } from "../../utils/http";
import Button from "../ui/buttons/Button";
import Input from "../ui/inputs/Input";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";

const RemovePupil: React.FC = () => {
	const dashboardContext = React.useContext(DashboardContext);

	const [firstTimeClicked, setFirstTimeClicked] = React.useState(false);
	const [name, setName] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [showError, setShowError] = React.useState(false);

	const onModalDismissedHandler = () => {
		dashboardContext?.action({ type: "setShowRemovePupil", payload: false });
	};

	const nameChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
		setShowError(false);
	};

	const submitHandler = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		if (!firstTimeClicked) {
			setFirstTimeClicked(true);
			return;
		}
		setIsLoading(true);
		const { response } = await deleteOne("/api/pupils", { name });
		setIsLoading(false);

		if (response.deletedCount === 0) {
			setShowError(true);
			setFirstTimeClicked(false);
			setName("");
		} else {
			alert("התלמיד נמחק בהצלחה ממאגר המידע!");
			dashboardContext?.action({ type: "setShowRemovePupil", payload: false });
		}
	};

	return (
		<Modal
			onDismiss={onModalDismissedHandler}
			heading={
				isLoading
					? ""
					: !firstTimeClicked
					? "הסרת תלמיד ממאגר המידע"
					: "לחצי פעם נוספת לאישור"
			}>
			{isLoading && <LoadingSpinner />}
			{!isLoading && (
				<form
					onSubmit={submitHandler}
					className="flex w-full flex-col items-center justify-center p-3">
					<Input
						onChange={nameChangedHandler}
						value={name}
						name="name"
						type="text"
						label="שם מלא"
					/>
					{showError && (
						<p className="p-3 font-medium text-red-500">!משתמש זה אינו קיים</p>
					)}
					<Button type="submit" className="my-5">
						הסרה
					</Button>
				</form>
			)}
		</Modal>
	);
};

export default RemovePupil;