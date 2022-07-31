import { busType } from "../types/DateObjectType";
import PricesObjectType from "../types/PricesObjectType";

export const produceYearArray = () => {
	const currentYear = new Date(
		new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
	).getFullYear();
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

export const toNormalDateString = (date: Date) => {
	let newDate = new Date(date.toUTCString());
	newDate.setHours(newDate.getHours() - 3);
	return `${newDate.getFullYear()}/${
		newDate.getMonth() + 1
	}/${newDate.getDate()}`;
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
