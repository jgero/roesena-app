export interface Person {
  _id: string;
  name: string;
  authorityLevel: number;
}

export interface PersonWithPassword extends Person {
  password: string;
}

export interface Article {
  _id: string;
  date: number;
  title: string;
  content: string;
  images: string[];
}

export interface Image extends RawImage {
  _id: string;
}

export interface RawImage {
  description: string;
  tags: string[];
  image: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  participants: string[];
}