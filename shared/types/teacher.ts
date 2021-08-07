import { ListResponse, Paginator } from "./type";

export interface Teacher {
  id: number;
  name: string;
  country: string;
  courseAmount: number;
  ctime: string;
  email: string;
  phone: number;
  skills: Skill[];
  profiledId: number;
  updateAt: string;
}

interface Skill {
  name: string;
  level: number;
}

export interface TeacherRequest extends Paginator {
  query?: string;
}

export interface TeacherResponse extends ListResponse {
  teachers: Teacher[];
}
