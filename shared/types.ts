export interface LoginType {
  email: string;
  password: string;
  role: Role;
  remember: boolean;
}

export type Role = "student" | "teacher" | "manager";

export interface LoginReturnType {
  role: Role;
  token: string;
  userId: string;
}

export interface CourseInfo {
  id: number;
  courseId: number;
  name: string;
}

export interface StudentType {
  id: number;
  name: string;
}

export interface StudentInfo {
  country: string;
  courses: CourseInfo[];
  createdAt: string;
  email: string;
  id: number;
  name: string;
  profileId: number;
  type: StudentType;
  updatedAt: string;
}

export interface Pagination {
  limit: number;
  page: number;
}

export interface Student {
  pagination: Pagination;
  students: StudentInfo[];
  total: number;
}
