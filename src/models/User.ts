import { Course } from "./Courses";

export interface User {
  id: string;
  createdAt: Date | string;
  userName: string;
  password: string;
  ownedCourses: Course[];
}
