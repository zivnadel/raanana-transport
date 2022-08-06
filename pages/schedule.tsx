import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import EnterNameModal from "../components/schedule/EnterNameModal";
import PupilObjectType from "../types/PupilObjectType";

const Schedule: NextPage = () => {
	const router = useRouter();

	const [showEnterNameModal, setShowEnterNameModal] = React.useState(true);
	const [pupil, setPupil] = React.useState<PupilObjectType | null>(null);

	React.useEffect(() => {
		const storagePupil = localStorage.getItem("schedulePupil");

		if (storagePupil) {
			setPupil(JSON.parse(storagePupil));
			setShowEnterNameModal(false);
		}
	}, []);

	const nameFormSubmittedHandler = () => {
		setShowEnterNameModal(false);
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
				<></>
			)}
		</>
	);
};

export default Schedule;
