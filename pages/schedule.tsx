import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

const EnterNameModal = dynamic(
	() => import("../components/schedule/EnterNameModal")
);
const ScheduleModal = dynamic(
	() => import("../components/schedule/ScheduleModal")
);

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
