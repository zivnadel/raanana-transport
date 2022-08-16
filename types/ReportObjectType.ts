type ReportObjectType = {
	date: string;
	action: "ADD" | "REMOVE";
	name: string;
	hour: "15:30" | "17:00" | "morning";
};

export default ReportObjectType;
