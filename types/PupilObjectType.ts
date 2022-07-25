type PupilObjectType = {
    _id?: string;
	name: string;
	schedule: { day: number; hours: string[] }[];
};

export default PupilObjectType;
