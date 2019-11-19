export interface Person {
  _id: string;
  name: string;
  authorityLevel: number;
}

export interface Group {
  _id: string;
  name: string;
  members: Person[];
}

export interface Article {
  _id: string;
  date: number;
  title: string;
  content: string;
  images: Image[];
}

export interface ShallowArticle {
  _id: string;
  date: number;
  title: string;
  content: string;
  images: { _id: string }[];
}

export interface Image {
  _id: string;
  description: string;
  data: string;
  tags: string[];
}

export interface ImageMetadata {
  _id: string;
  description: string;
  tags: string[];
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  participants: { person: Person; amount: number }[];
  authorityLevel: number;
}
