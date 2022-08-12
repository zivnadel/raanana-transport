import type { NextPage } from "next";
import LinkButton from "../components/ui/buttons/LinkButton";

const Home: NextPage = () => {
	return (
		<div className="flex flex-col items-center justify-center h-[95vh] p-5 text-center">
			<h1 className="mb-10 text-3xl sm:text-5xl font-semibold text-primary">
				דיווח על עדכון ושינוי שעות ההסעה
			</h1>
			<p className="mb-2 text-xl sm:text-2xl">אנא הקפידו על הכנסת שם מלא ופרטים מדויקים</p>
			<p className="text-xl sm:text-2xl mb-2">
				לחצו על הכפתור למטה או על הכפתור בתפריט למעבר לטופס הדיווח
			</p>
			<p className="text-xl sm:text-2xl">
				בנוסף, ניתן לצפות במערכת השעות השבועית בלחיצה על הכפתור
			</p>
			<div className="flex flex-col items-center justify-center sm:flex-row">
			<LinkButton
					text="דיווח שעות"
					href="/report-hours"
					chevron={true}
					className="mt-8 sm:mt-10"
				/>
				<LinkButton
					text="צפייה במערכת השעות"
					href="/schedule"
					chevron={true}
					className="mx-3 mt-5 w-64 sm:mt-10"
				/>
				
			</div>
		</div>
	);
};

export default Home;
