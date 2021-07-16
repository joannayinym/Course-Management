import { Paginator } from "./type";

export interface StudentsRequest {
  query?: string;
  page: number;
  limit: number;
  userId?: number;
}

export interface StudentsResponse {
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
  type: BaseType;
  courses: StudentCourse[];
}

export interface StudentCourse {
  id: number;
  courseId: number;
  name: string;
}

export interface BaseType {
  id: number;
  name: string;
}

export interface AddStudentRequest {
  name: string;
  country: string;
  email: string;
  type: number;
}

export type AddStudentResponse = Student;

export interface UpdateStudentRequest extends AddStudentRequest {
  id: number;
}

export type UpdateStudentResponse = Student;
