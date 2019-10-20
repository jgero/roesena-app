export interface Person {
  _id: string;
  name: string;
  authorityLevel: number;
}

export interface Article {
  _id: string;
  date: number;
  title: string;
  content: string;
  images: string[];
}

export interface Image {
  _id: string;
  description: string;
  image: string;
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
  participants: string[];
}
