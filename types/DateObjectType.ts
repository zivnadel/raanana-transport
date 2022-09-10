export enum busType {
  p8 = "p8",
  p16 = "p16",
  p20 = "p20",
  p23 = "p23",
  morning = "morning",
  midi = "midi",
}

export type HourObjectType = {
  pupils: string[];
  busType: busType[];
  price: number;
};

type DateObjectType = {
  date: string;
  day: number;
  transportations: {
    morning?: HourObjectType;
    "15:30"?: HourObjectType;
    "17:00"?: HourObjectType;
  };
  totalAmount: number;
};

export default DateObjectType;
