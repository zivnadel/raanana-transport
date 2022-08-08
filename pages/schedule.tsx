import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import SelectHoursCheckbox from "../components/SelectHoursCheckbox";
import EnterNameModal from "../components/schedule/EnterNameModal";
import Button from "../components/ui/buttons/Button";
import DisabledInput from "../components/ui/inputs/DisabledInput";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Modal from "../components/ui/modals/Modal";
import PupilObjectType from "../types/PupilObjectType";
import { _get } from "../utils/http";

const Schedule: NextPage = () => {
	const router = useRouter();

	const [showEnterNameModal, setShowEnterNameModal] = React.useState(true);
	const [pupil, setPupil] = React.useState<PupilObjectType | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const storagePupilName = localStorage.getItem("schedulePupilName");

			if (storagePupilName) {
				setShowEnterNameModal(false);
				setIsLoading(true);
				const pupil = await _get<PupilObjectType>(
					`/api/pupils?pupilName=${storagePupilName}`
				);
				setPupil(pupil);
				setIsLoading(false);
			}
		})();
	}, []);

	const nameFormSubmittedHandler = () => {
		setShowEnterNameModal(false);
	};

	const changeNameClickedHandler = () => {
		setPupil(null);
		localStorage.removeItem("schedulePupilName")
		setShowEnterNameModal(true);
	};

	return (
		<>
			{showEnterNameModal ? (
				<EnterNameModal
					setPupil={setPupil}
					onSubmit={nameFormSubmittedHandler}
					onDismiss={() => router.back()}
				/>
			) : (
				<Modal
					heading={isLoading ? "" : "צפייה במערכת השעות"}
					onDismiss={() => router.back()}>
					{isLoading && <LoadingSpinner />}
					{!isLoading && pupil && (
						<>
							<DisabledInput
								editBtn={true}
								onClick={changeNameClickedHandler}
								label="שם"
								id="pupilName"
								value={pupil.name}
							/>

							{[1, 2, 3, 4, 5].map((day) => (
								<SelectHoursCheckbox
									day={day}
									key={day}
									disabled={true}
									selected={pupil.schedule}
								/>
							))}
							<div className="mb-5"></div>
						</>
					)}
				</Modal>
			)}
		</>
	);
};

export default Schedule;
