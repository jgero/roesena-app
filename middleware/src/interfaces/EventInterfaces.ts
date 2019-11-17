export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  authorityGroup: number;
  participants: { _id: string; amount: number }[];
}
