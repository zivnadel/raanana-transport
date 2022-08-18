import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import EnterNameModal from "../components/schedule/EnterNameModal";
import ScheduleModal from "../components/schedule/ScheduleModal";

const Schedule: NextPage = () => {
	const router = useRouter();

	const [showEnterNameModal, setShowEnterNameModal] = React.useState(false);

	React.useEffect(() => {
		const pupilName = localStorage.getItem("schedulePupilName");

		if (!pupilName) {
			setShowEnterNameModal(true);
		}
	}, []);

	const nameFormSubmittedHandler = () => {
		setShowEnterNameModal(false);
	};

	return (
		<>
			{showEnterNameModal && (
				<EnterNameModal
					onSubmit={nameFormSubmittedHandler}
					onDismiss={() => router.back()}
				/>
			)}
			{!showEnterNameModal && (
				<ScheduleModal setShowEnterNameModal={setShowEnterNameModal} />
			)}
		</>
	);
};

export default Schedule;
