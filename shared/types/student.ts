import { Course } from "./course";
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

export interface StudentProfile {
  id: number;
  name: string;
  type: BaseType;
  country: string;
  email: string;
  address: string;
  phone: number;
  ctime: string;
  gender: number;
  education: string;
  age: number;
  interest: string[];
  avatar: string;
  memberStartAt: string;
  memberEndAt: string;
  updateAt: string;
  description: string;
  courses: Course[];
}
