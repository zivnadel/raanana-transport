import {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import SelectHoursCheckbox from "../../../components/SelectHoursCheckbox";
import Button from "../../../components/ui/buttons/Button";
import DisabledInput from "../../../components/ui/inputs/DisabledInput";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import Modal from "../../../components/ui/modals/Modal";
import clientPromise from "../../../lib/mongodb";
import PupilObjectType from "../../../types/PupilObjectType";
import { _get, _post } from "../../../utils/http";
import { authOptions } from "../../api/auth/[...nextauth]";

const AddPupil: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ existing }) => {
	const router = useRouter();
	const { name } = router.query;

	const [hours, setHours] = React.useState<
		| {
				day: number;
				hours: string[];
		  }[]
		| null
	>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [showError, setShowError] = React.useState(false);

	React.useEffect(() => {
		if (!name) {
			router.push("/dashboard");
		}
	}, [name]);

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

	const clearEmptyDays = () => {
		if (!hours || hours.length === 0) {
			return null;
		}
		const filteredHours = hours!.filter((day) => day.hours.length > 0);
		if (filteredHours.length === 0) {
			return null;
		}
		return filteredHours;
	};

	const submitHandler = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		setIsLoading(true);
		const filteredHours = clearEmptyDays();
		const pupil = await _get<PupilObjectType>(`/api/pupils?pupilName=${name}`);
		setIsLoading(false);
		if (filteredHours !== null && !pupil) {
			setIsLoading(true);
			const response = await _post("/api/pupils", {
				name,
				schedule: filteredHours,
			});
			alert("התלמיד נוסף בהצלחה!");
			await router.push("/dashboard");
			setIsLoading(false);
			setShowError(false);
		} else {
			setShowError(true);
		}
	};

	return (
		<>
			{existing && (
				<Modal
					className="text-center"
					heading="שגיאה"
					onDismiss={() => router.push("/dashboard")}>
					<p className="p-3 text-center text-lg font-medium">
						אין אפשרות להוסיף תלמיד זה כי הוא כבר קיים במאגר הנתונים. לחזרה ללוח
						הבקרה לחצי מטה או סגרי חלון זה
					</p>
					<Button className="my-5" onClick={() => router.push("/dashboard")}>
						לחצי כאן
					</Button>
				</Modal>
			)}
			{!existing && name && (
				<Modal
					onDismiss={() => router.push("/dashboard")}
					heading={!isLoading ? "הוספת תלמיד" : ""}
					className="text-center">
					{isLoading && <LoadingSpinner />}
					{!isLoading && (
						<form onSubmit={submitHandler}>
							<DisabledInput
								id="pupilName"
								value={name.toString()}
								label="שם התלמיד"
							/>
							{[1, 2, 3, 4, 5].map((day) => (
								<SelectHoursCheckbox
									onChangeWithDay={onCheckboxCheckedHandler}
									day={day}
									key={day}
								/>
							))}
							{showError && (
								<p className="p-3 font-medium text-red-500">
									נא למלא לפחות שדה אחד, אם שדה אחד כבר מלא ייתכן שארעה שגיאה.
									נא לרענן ולנסות שוב
								</p>
							)}
							<Button type="submit" className="mt-2 mb-5">
								שלחי
							</Button>
						</form>
					)}
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

		const db = (await clientPromise).db();
		const existingPupil = await db
			.collection("pupils")
			.findOne({ name: context.query.name });

		return {
			props: {
				existing: existingPupil ? true : false,
			},
		};
	} catch (error: any) {
		throw new Error(error);
	}
};

export default AddPupil;
