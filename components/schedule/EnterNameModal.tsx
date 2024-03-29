import React from "react";
import PupilObjectType from "../../types/PupilObjectType";
import { _get } from "../../utils/http";
import Button from "../ui/buttons/Button";
import ErrorParagraph from "../ui/paragraphs/ErrorParagraph";
import Input from "../ui/inputs/Input";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";
import { LoadingContext } from "../../store/LoadingContext";

interface Props {
	onDismiss: () => void;
	onSubmit: () => void;
}

const EnterNameModal: React.FC<Props> = ({ onDismiss, onSubmit }) => {
	const [firstName, setFirstName] = React.useState("");
	const [lastName, setLastName] = React.useState("");

	const [firstNameError, setFirstNameError] = React.useState<
		string | undefined
	>(undefined);
	const [lastNameError, setLastNameError] = React.useState<string | undefined>(
		undefined
	);
	const [pupilDoesntExist, setPupilDoesntExist] = React.useState(false);

	const { isLoading, setIsLoading } = React.useContext(LoadingContext)!;

	const onFormSubmittedHandler = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		const firstNameInvalid = !/^[\u0590-\u05FF]+$/.test(firstName);
		const lastNameInvalid = !/^[\u0590-\u05FF]+$/.test(lastName);

		if (firstNameInvalid && lastNameInvalid) {
			setFirstNameError("!הכנס שם פרטי תקין");
			setLastNameError("!הכנס שם משפחה תקין");
			return;
		}

		if (firstNameInvalid) {
			return setFirstNameError("!הכנס שם פרטי תקין");
		}

		if (lastNameInvalid) {
			return setLastNameError("!הכנס שם משפחה תקין");
		}

		setIsLoading(true);
		const { response: pupil } = await _get<PupilObjectType>(
			`/api/pupils?pupilName=${firstName} ${lastName}`
		);
		setIsLoading(false);

		if (!pupil) {
			return setPupilDoesntExist(true);
		}

		localStorage.setItem("schedulePupilName", pupil.name);
		localStorage.setItem("initialSchedulePupilData", JSON.stringify(pupil));

		onSubmit();
	};

	return (
		<>
			{!isLoading && (
				<Modal onDismiss={onDismiss} heading={isLoading ? "" : "הכנס שם מלא"}>
					<form
						onSubmit={onFormSubmittedHandler}
						className="m-3 flex flex-col items-center justify-center p-5">
						<Input
							label="שם פרטי"
							name="firstName"
							type="text"
							onChange={(e) => {
								setFirstName(e.target.value);
								setFirstNameError(undefined);
								setPupilDoesntExist(false);
							}}
							value={firstName}
							required={true}
							error={firstNameError}
							className="mb-6 w-full"
						/>
						<Input
							label="שם משפחה"
							name="lastName"
							type="text"
							onChange={(e) => {
								setLastName(e.target.value);
								setLastNameError(undefined);
								setPupilDoesntExist(false);
							}}
							value={lastName}
							required={true}
							error={lastNameError}
							className="w-full"
						/>
						{pupilDoesntExist && <ErrorParagraph error="!תלמיד זה אינו קיים" />}
						<Button
							type="submit"
							className={pupilDoesntExist ? "mt-0" : "my-5 mb-0"}>
							אישור
						</Button>
					</form>
				</Modal>
			)}
		</>
	);
};

export default EnterNameModal;
