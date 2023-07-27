import { Author } from "./author";

export interface Course {
  id?: number | string;
  name: string;
  date: Date | string;
  description: string;
  length: number;
  isTopRated?: boolean;
  authors?: Author[];
}
