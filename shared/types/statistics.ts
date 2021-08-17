// import { Course, Schedule } from "./course";

export interface BasicStatistics {
  total: number;
  lastMonthAdded: number;
}

export interface Gender {
  male: number;
  female: number;
  unknown: number;
}

export interface GenderStatistics extends BasicStatistics {
  gender: Gender;
}

export type StatisticsType = "student" | "teacher" | "course";

export interface Statistic {
  name: string;
  amount: number;
  level?: number;
}
// export interface Statistic {
//     name: string;
//     amount: number;
//     [key: string]: any;
//   }

export interface StatisticsOverviewResponse {
  course: BasicStatistics;
  student: GenderStatistics;
  teacher: GenderStatistics;
}

// export type StatisticsResponse<T = any, U = Statistic> = {
//     [key in keyof T]: U | U[] | Statistic | Statistic[];
//   };

// export interface StatisticsResponse<U = Statistic> {
//   [key: string]: U | U[] | Statistic | Statistic[];
// }

export interface ClassTimeStatistics {
  classTime: string[];
  typeName: string;
  name: string;
}

export interface CourseClassTimeStatistic extends Statistic {
  courses: ClassTimeStatistics[];
}

// export type CourseStatistics = StatisticsResponse<Course & Schedule, CourseClassTimeStatistic>;

export interface CourseStatistics {
  typeName: Statistic[];
  ctime: Statistic[];
  classTime: ClassTimeStatistics[];
}

export interface SkillStatistic {
  [key: string]: Statistic[];
}

export interface TeacherStatistics {
  country: Statistic[];
  skill: Record<string, Statistic[]>;
  workExperience: string[];
  ctime: Statistic[];
}

export interface StudentStatistics {
  country: Statistic[];
  typeName: Statistic[];
  courses: Statistic[];
  ctime: Statistic[];
  interest: Statistic[];
}
