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
import DayObjectType from "../types/DayObjectType";
import ErrorParagraph from "../components/ui/ErrorParagraph";

const Schedule: NextPage = () => {
	const router = useRouter();

	const [showEnterNameModal, setShowEnterNameModal] = React.useState(true);
	const [pupil, setPupil] = React.useState<PupilObjectType | null>(null);
	const [weekSchedule, setWeekSchedule] = React.useState<
		DayObjectType[] | null
	>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState("");

	React.useEffect(() => {
		(async () => {
			try {
				const storagePupilName = localStorage.getItem("schedulePupilName");

				if (storagePupilName) {
					setShowEnterNameModal(false);
					setIsLoading(true);

					const pupil = await _get<PupilObjectType>(
						`/api/pupils?pupilName=${storagePupilName}`
					);
					const week = await _get<DayObjectType[]>("/api/week");

					setPupil(pupil);
					setWeekSchedule(week);

					setIsLoading(false);
				}
			} catch (error: any) {
				setError(error.message);
				setIsLoading(false);
			}
		})();
	}, []);

	const nameFormSubmittedHandler = () => {
		setShowEnterNameModal(false);
	};

	const changeNameClickedHandler = () => {
		setPupil(null);
		localStorage.removeItem("schedulePupilName");
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
					heading={isLoading || error ? "" : "צפייה במערכת השעות"}
					onDismiss={() => router.back()}
					error={error}>
					{isLoading && <LoadingSpinner />}
					{!isLoading && !error && pupil && (
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
									weekSchedule={weekSchedule ? weekSchedule : []}
								/>
							))}
							<div className="mt-3 flex w-full flex-row-reverse items-center justify-start px-5 py-1 text-right">
								<input
									type="checkbox"
									checked
									disabled
									className="ml-4 h-6 w-6 rounded border-gray-300 bg-gray-100 text-gray-400 shadow-sm"></input>
								<p className="font-semibold">הינך רשום להסעה זו</p>
							</div>
							<div className="flex w-full flex-row-reverse items-center justify-start px-5 py-1 text-right">
								<span className="ml-4 h-6 w-6 rounded border-gray-300 bg-primary shadow-sm"></span>
								<p className="font-semibold">ההסעה מתקיימת</p>
							</div>
							<div className="mb-3 flex w-full flex-row-reverse items-center justify-start px-5 py-1 text-right">
								<span className="ml-4 h-6 w-6 rounded border-gray-300 bg-red-600 shadow-sm"></span>
								<p className="font-semibold">ההסעה אינה מתקיימת</p>
							</div>
						</>
					)}
					{error && <ErrorParagraph error={error}/>}
				</Modal>
			)}
		</>
	);
};

export default Schedule;
