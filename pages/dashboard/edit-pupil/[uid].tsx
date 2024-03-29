import { ObjectId } from "mongodb";
import {
	GetServerSideProps, NextPage
} from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import SelectHoursCheckbox from "../../../components/SelectHoursCheckbox";
import Button from "../../../components/ui/buttons/Button";
import DisabledInput from "../../../components/ui/inputs/DisabledInput";
import Modal from "../../../components/ui/modals/Modal";
import clientPromise from "../../../lib/mongodb";
import { LoadingContext } from "../../../store/LoadingContext";
import PupilObjectType from "../../../types/PupilObjectType";
import { _get, _patch } from "../../../utils/http";
import { authOptions } from "../../api/auth/[...nextauth]";

interface Props {
	pupil: PupilObjectType;
}

const EditPupil: NextPage<Props> = ({ pupil }) => {
	const router = useRouter();

	const [hours, setHours] = React.useState<
		| {
				day: number;
				hours: string[];
		  }[]
		| null
	>(pupil.schedule);
	const { isLoading, setIsLoading } = React.useContext(LoadingContext)!;
	const [showError, setShowError] = React.useState(false);

	const onCheckboxCheckedHandler = (
		event: React.ChangeEvent<HTMLInputElement>,
		day: number
	) => {
		setShowError(false);
		setHours((prevHours) => {
			if (!prevHours) {
				return [{ day, hours: [event.target.value] }];
			}
			const selectedDay = prevHours!.find((hours) => hours.day === day);
			const hoursWithoutSelected = prevHours!.filter(
				(hours) => hours.day !== day
			);
			if (event.target.checked) {
				if (selectedDay) {
					return [
						...hoursWithoutSelected,
						{ day, hours: [...selectedDay.hours, event.target.value] },
					];
				}
				return [...hoursWithoutSelected, { day, hours: [event.target.value] }];
			} else {
				return [
					...hoursWithoutSelected,
					{
						day,
						hours: selectedDay!.hours.filter(
							(hour) => hour !== event.target.value
						),
					},
				];
			}
		});
	};

	const submitHandler = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		setIsLoading(true);
		const { response: pupilStillExists } = await _get<PupilObjectType>(
			`/api/pupils?pupilName=${pupil.name}`
		);
		setIsLoading(false);
		if (hours !== null && pupilStillExists) {
			setIsLoading(true);
			await _patch("/api/pupils", {
				name: pupil.name,
				schedule: hours,
			});
			setShowError(false);
			alert("התלמיד עודכן בהצלחה!");
			await router.push("/dashboard");
			setIsLoading(false);
		} else {
			setShowError(true);
		}
	};

	return (
		<>
			{!isLoading && (
				<Modal
					onDismiss={() => router.push("/dashboard")}
					heading={!isLoading ? "עריכת פרטי תלמיד" : ""}
					className="text-center">
					<form onSubmit={submitHandler}>
						<DisabledInput
							id="pupilName"
							value={pupil.name}
							label="שם התלמיד"
						/>
						{[1, 2, 3, 4, 5].map((day) => (
							<SelectHoursCheckbox
								onChangeWithDay={onCheckboxCheckedHandler}
								day={day}
								key={day}
								selected={pupil.schedule}
							/>
						))}
						{showError && (
							<p className="p-3 font-medium text-red-500">
								נא למלא לפחות שדה אחד, אם שדה אחד כבר מלא ייתכן שארעה שגיאה. נא
								לרענן ולנסות שוב
							</p>
						)}
						<Button type="submit" className="mt-2 mb-5">
							שלחי
						</Button>
					</form>
				</Modal>
			)}
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		const session = await unstable_getServerSession(
			context.req,
			context.res,
			authOptions
		);

		if (!session) {
			return {
				redirect: {
					permanent: false,
					destination: "/login",
				},
			};
		}

		if (!context.query.uid) {
			return {
				redirect: {
					permanent: false,
					destination: "/dashboard",
				},
			};
		}

		const db = (await clientPromise).db();
		const pupil = await db
			.collection("pupils")
			.findOne({ _id: new ObjectId(context.query.uid.toString()) });

		if (!pupil) {
			return {
				redirect: {
					permanent: false,
					destination: "/dashboard",
				},
			};
		}

		return {
			props: {
				pupil: { ...pupil, _id: pupil._id.toString() },
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

export default EditPupil;
