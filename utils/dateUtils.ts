export const produceYearArray = () => {
	const currentYear = new Date(
		new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
	).getFullYear();
	const start = new Date(`${currentYear}-09-01`);
	const end = new Date(`${currentYear + 1}-06-20`);

	let yearArray: Date[] = new Array();
	let currentDate = new Date(start);

	while (currentDate < end) {
		if (currentDate.getDay() !== 5 && currentDate.getDay() !== 6) {
			yearArray.push(new Date(currentDate));
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return yearArray;
};

export const toNormalDateString = (date: Date) => {
	let newDate = new Date(date.toUTCString());
	newDate.setTime(
		newDate.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
	);
	return `${newDate.getFullYear()}/${
		newDate.getMonth() + 1
	}/${newDate.getDate()}`;
};

export const toDate = (normalDateString: string) => {
	let date = new Date(new Date(normalDateString).toUTCString());
	date.setTime(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));
	return date;
};
