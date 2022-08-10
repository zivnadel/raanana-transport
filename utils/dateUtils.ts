import DateObjectType, { busType } from "../types/DateObjectType";
import PricesObjectType from "../types/PricesObjectType";

export const calculateLearningYear = () => {
	const today = new Date();
	const month = today.getMonth() + 1;
	const date = today.getDate();

	if (month >= 1 && month <= 6) {
		if (month === 6 && date > 20) {
			return today.getFullYear();
		}
		return today.getFullYear() - 1;
	} else {
		return today.getFullYear();
	}
};

export const produceYearArray = () => {
	const currentYear = calculateLearningYear();
	const start = new Date(`${currentYear}-09-01`);
	const end = new Date(`${currentYear + 1}-06-20`);

	let yearArray: Date[] = new Array();
	let currentDate = new Date(start);

	while (currentDate <= end) {
		if (currentDate.getDay() !== 5 && currentDate.getDay() !== 6) {
			yearArray.push(new Date(currentDate));
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return yearArray;
};

export const produceMonthArray = (month: number, year: number) => {
	let monthArray: Date[] = new Array();
	let currentDate = new Date(`${year}-${month}-01`);

	while (currentDate.getMonth() === month - 1) {
		if (currentDate.getDay() !== 5 && currentDate.getDay() !== 6) {
			monthArray.push(new Date(currentDate));
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return monthArray.map((date: Date) => toNormalDateString(date));
};

// create a function which will iterate over array of dates and divide them into weeks
export const produceWeeksFromMonth = (month: DateObjectType[]) => {
	let weeksArray: DateObjectType[][] = new Array();
	let currentWeek: DateObjectType[] = new Array();
	month.forEach((date: DateObjectType) => {
		currentWeek.push(date);
		if (date.day === 5) {
			weeksArray.push([...currentWeek]);
			currentWeek = new Array();
		}
	});
	return weeksArray;
};

export const toNormalDateString = (date: Date) => {
	const newDate = new Date(date.toUTCString());
	return `${newDate.getFullYear()}/${
		newDate.getMonth() + 1
	}/${newDate.getDate()}`;
};

export const validateWeek = (date: Date) => {
	if (
		date < new Date(`${calculateLearningYear()}-09-01`) ||
		date > new Date(`${calculateLearningYear() + 1}-06-20`)
	) {
		return false;
	}
	return true;
};

export const validateMonth = (monthWithYear: string) => {
	let [year, month]: any = monthWithYear.split("-");
	year = +year;
	month = +month;

	if (year === calculateLearningYear() && month < 9) {
		return false;
	}

	if (year === calculateLearningYear() + 1 && month > 6) {
		return false;
	}

	return true;
};

export const mapDayToString = (day: number) => {
	switch (day) {
		case 1:
			return "יום ראשון";
		case 2:
			return "יום שני";
		case 3:
			return "יום שלישי";
		case 4:
			return "יום רביעי";
		case 5:
			return "יום חמישי";
	}
};

// export const toIsraelDate = (normalDate: string | Date) => {
// 	let date: Date;
// 	if (typeof normalDate === "string") {
// 		date = new Date(new Date(normalDate).toUTCString());
// 	} else {
// 		date = normalDate;
// 	}
// 	date.setHours(date.getHours() - 3);
// 	return date;
// };

export const calculateBusType = (numOfPupils: number): busType[] => {
	if (numOfPupils === 0) {
		return [];
	} else if (numOfPupils > 0 && numOfPupils <= 8) {
		return [busType.p8];
	} else if (numOfPupils > 8 && numOfPupils <= 16) {
		return [busType.p16];
	} else if (numOfPupils > 16 && numOfPupils <= 20) {
		return [busType.p20];
	} else if (numOfPupils > 20 && numOfPupils <= 23) {
		return [busType.p23];
	} else {
		return [busType.p23, ...calculateBusType(numOfPupils - 23)];
	}
};

export const calculatePrice = (
	busTypes: busType[],
	prices: PricesObjectType
): number => {
	let price = 0;
	busTypes.map((type) => {
		switch (type) {
			case busType.morning:
				price += prices.morning;
				break;
			case busType.p8:
				price += prices.p8;
				break;
			case busType.p16:
				price += prices.p16;
				break;
			case busType.p20:
				price += prices.p20;
				break;
			case busType.p23:
				price += prices.p23;
				break;
		}
	});
	return price;
};
