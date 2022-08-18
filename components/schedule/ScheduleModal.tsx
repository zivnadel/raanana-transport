import { useRouter } from "next/router";
import React from "react";
import DayObjectType from "../../types/DayObjectType";
import PupilObjectType from "../../types/PupilObjectType";
import { _get } from "../../utils/http";
import SelectHoursCheckbox from "../SelectHoursCheckbox";
import DisabledInput from "../ui/inputs/DisabledInput";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/modals/Modal";
import ErrorParagraph from "../ui/paragraphs/ErrorParagraph";

interface Props {
	setShowEnterNameModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScheduleModal: React.FC<Props> = ({ setShowEnterNameModal }) => {
	const [pupil, setPupil] = React.useState<PupilObjectType | null>(null);
	const [weekSchedule, setWeekSchedule] = React.useState<
		DayObjectType[] | null
	>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState("");

	React.useEffect(() => {
		const initialFetch = async () => {
			const pupilName = localStorage.getItem("schedulePupilName");

			if (pupilName) {
				setIsLoading(true);
                console.log("LOG")

				const { response: pupilData } = await _get<PupilObjectType>(
					`/api/pupils?pupilName=${pupilName}`
				);

				if (!pupilData) {
					setIsLoading(false);
					setError("תלמיד זה אינו קיים במערכת");
					return;
				}

				const { response: week } = await _get<DayObjectType[]>("/api/week");

				setPupil(pupilData);
				setWeekSchedule(week);

				setIsLoading(false);
			} else {
				setShowEnterNameModal(true);
			}
		};

		initialFetch().catch((error) => {
			setError(error.message);
			setIsLoading(false);
		});
	}, []);

	const changeNameClickedHandler = () => {
		setPupil(null);
		localStorage.removeItem("schedulePupilName");
		setShowEnterNameModal(true);
	};

	const router = useRouter();

	return (
		<Modal
			heading={isLoading || error ? "" : "צפייה במערכת השעות"}
			onDismiss={() => {
				if (error) {
					localStorage.removeItem("schedulePupilName");
				}
				router.back();
			}}
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
			{error && <ErrorParagraph error={error} />}
		</Modal>
	);
};

export default ScheduleModal;
