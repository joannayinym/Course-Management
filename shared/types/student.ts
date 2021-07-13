import { Paginator } from "./type";

export interface StudentRequest {
  query?: string;
  page: number;
  limit: number;
  userId?: number;
}

export interface StudentResponse {
  total: number;
  students: Student[];
  paginator: Paginator;
}

export interface Student {
  createdAt: string;
  updatedAt: string;
  id: number;
  email: string;
  name: string;
  country: string;
  profileId: number;
  type: Type;
  courses: Course[];
}

interface Course {
  id: number;
  courseId: number;
  name: string;
}

interface Type {
  id: number;
  name: string;
}
