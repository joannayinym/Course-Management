import { ListResponse, Paginator } from "./type";

type DurationUnit = 1 | 2 | 3 | 4 | 5;

type CourseStatus = 0 | 1 | 2;

export interface CourseType {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  uid: string; //code
  detail: string;
  startTime: string;
  price: number;
  maxStudents: number;
  star: number;
  status: CourseStatus;
  duration: number;
  durationUnit: DurationUnit;
  cover: string;
  teacherName: string;
  teacherId: number;
  type: CourseType[];
  ctime: string;
  scheduleId: number;
}

interface Sales {
  id: number;
  batches: number;
  price: number;
  earnings: number;
  paidAmount: number;
  studentAmount: number;
  paidIds: number[];
}

export interface Chapter {
  name: string;
  id: number;
  content: string;
  order: number;
}
export interface Schedule {
  id: number;
  status: number;
  current: number;
  chapters: Chapter[];
  classTime: string[];
}
export interface CourseDetail extends Course {
  sales: Sales;
  schedule: Schedule;
}
export interface CourseRequest extends Paginator {
  code?: string;
  name?: string;
  type?: number;
  userId?: number;
  own?: any;
}

export interface CourseResponse extends ListResponse {
  courses: Course[];
}

export type AddCourseRequest = Pick<
  Course,
  | "cover"
  | "detail"
  | "duration"
  | "durationUnit"
  | "maxStudents"
  | "name"
  | "price"
  | "startTime"
  | "uid"
> & { type: number | number[]; teacherId: number };

export type AddCourseResponse = Course;

export interface UpdateCourseRequest {
  id: number;
}

export type UpdateCourseResponse = Course;
