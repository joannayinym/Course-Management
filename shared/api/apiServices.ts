import { message } from "antd";
import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import { RootPath, SubPath } from "../constants/apiPath";
import {
  AddCourseRequest,
  AddCourseResponse,
  CourseCode,
  CourseDetail,
  CourseRequest,
  CourseResponse,
  CourseType,
  Schedule,
  UpdateCourseRequest,
  UpdateCourseResponse,
  UpdateScheduleRequest,
} from "../types/course";
import { Country } from "../types/others";
import {
  AddStudentRequest,
  AddStudentResponse,
  StudentProfile,
  StudentsRequest,
  StudentsResponse,
  UpdateStudentRequest,
  UpdateStudentResponse,
} from "../types/student";
import { Teacher, TeacherRequest, TeacherResponse } from "../types/teacher";
import { IResponse, QueryParams } from "../types/type";
import { LoginRequest, LoginResponse } from "../types/user";

type IPath = (string | number)[] | string | number;

class BaseApiService {
  protected async get<T>(path: IPath, params?: QueryParams): Promise<T> {
    let currentPath = this.getPath(path);
    currentPath = !!params
      ? `${currentPath}?${this.paramsSerializer(params)}`
      : currentPath;

    return axiosInstance
      .get(currentPath)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  protected async post<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .post(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async delete<T>(path: IPath): Promise<T> {
    return axiosInstance
      .delete(this.getPath(path))
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  protected async put<T>(path: IPath, params: object): Promise<T> {
    return axiosInstance
      .put(this.getPath(path), params)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  private paramsSerializer(params: QueryParams) {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }

  private getPath(path: IPath): string {
    return !Array.isArray(path) ? String(path) : path.join("/");
  }

  protected isError(code: number): boolean {
    return !(
      code.toString().startsWith("2") || code.toString().startsWith("3")
    );
  }

  protected showMessage =
    (isSuccessDisplay = false) =>
    (res: IResponse): IResponse => {
      const { code, msg } = res;
      const isError = this.isError(code);

      if (isError) {
        message.error(msg);
      }

      if (isSuccessDisplay && !isError) {
        message.success(msg);
      }

      return res;
    };

  private errorHandler(error: AxiosError<IResponse>): IResponse {
    const msg = error.response?.data.msg || "";
    const code = error.response?.status || 0;
    return { msg, code };
  }
}
class ApiService extends BaseApiService {
  async login(req: LoginRequest): Promise<IResponse<LoginResponse>> {
    return this.post<IResponse<LoginResponse>>(RootPath.login, req).then(
      this.showMessage()
    );
  }

  async logout(): Promise<IResponse<boolean>> {
    return this.post<IResponse<boolean>>(RootPath.logout, {}).then(
      this.showMessage()
    );
  }

  async getCountries(): Promise<IResponse<Country[]>> {
    return this.get<IResponse<Country[]>>(RootPath.countries).then(
      this.showMessage()
    );
  }

  async getStudents(
    req: StudentsRequest
  ): Promise<IResponse<StudentsResponse>> {
    return this.get<IResponse<StudentsResponse>>(
      RootPath.students,
      req as unknown as QueryParams
    );
  }

  async getStudentById(id: number): Promise<IResponse<StudentProfile>> {
    return this.get<IResponse<StudentProfile>>([RootPath.students, id]).then(
      this.showMessage()
    );
  }

  async addStudent(
    req: AddStudentRequest
  ): Promise<IResponse<AddStudentResponse>> {
    return this.post<IResponse<AddStudentResponse>>(
      RootPath.students,
      req
    ).then(this.showMessage(true));
  }

  async updateStudent(
    req: UpdateStudentRequest
  ): Promise<IResponse<UpdateStudentResponse>> {
    return this.put<IResponse<UpdateStudentResponse>>(
      RootPath.students,
      req
    ).then(this.showMessage(true));
  }

  async deleteStudent(id: number): Promise<IResponse<boolean>> {
    return this.delete<IResponse<boolean>>([RootPath.students, id]).then(
      this.showMessage(true)
    );
  }

  async getCourses(
    req: Partial<CourseRequest>
  ): Promise<IResponse<CourseResponse>> {
    return this.get<IResponse<CourseResponse>>(
      RootPath.courses,
      req as unknown as QueryParams
    ).then(this.showMessage());
  }

  async getCourseById(id: number): Promise<IResponse<CourseDetail>> {
    return this.get<IResponse<CourseDetail>>(
      [RootPath.courses, SubPath.detail],
      {
        id,
      }
    ).then(this.showMessage());
  }

  async addCourse(
    req: AddCourseRequest
  ): Promise<IResponse<AddCourseResponse>> {
    return this.post<IResponse<AddCourseResponse>>(RootPath.courses, req).then(
      this.showMessage(true)
    );
  }

  async updateCourse(
    req: UpdateCourseRequest
  ): Promise<IResponse<UpdateCourseResponse>> {
    return this.put<IResponse<UpdateCourseResponse>>(
      RootPath.courses,
      req
    ).then(this.showMessage(true));
  }

  async deleteCourse(id: number): Promise<IResponse<boolean>> {
    return this.delete<IResponse<boolean>>([RootPath.courses, id]).then(
      this.showMessage(true)
    );
  }

  async getTeachers(req: TeacherRequest): Promise<IResponse<TeacherResponse>> {
    return this.get<IResponse<TeacherResponse>>(
      RootPath.teachers,
      req as unknown as QueryParams
    ).then(this.showMessage());
  }

  async getTeacherById(id: number): Promise<IResponse<Teacher>> {
    return this.get<IResponse<Teacher>>(RootPath.teachers, {
      id,
    }).then(this.showMessage());
  }

  async getCourseCode(): Promise<IResponse<CourseCode>> {
    return this.get<IResponse<CourseCode>>([
      RootPath.courses,
      SubPath.code,
    ]).then(this.showMessage());
  }

  async getCourseTypes(): Promise<IResponse<CourseType[]>> {
    return this.get<IResponse<CourseType[]>>([
      RootPath.courses,
      SubPath.type,
    ]).then(this.showMessage());
  }

  async updateSchedule(
    req: UpdateScheduleRequest
  ): Promise<IResponse<boolean>> {
    return this.put<IResponse<boolean>>(
      [RootPath.courses, SubPath.schedule],
      req
    ).then(this.showMessage(true));
  }

  async getScheduleById({
    courseId,
    scheduleId,
  }: {
    courseId?: number;
    scheduleId?: number;
  }): Promise<IResponse<Schedule>> {
    return this.get<IResponse<Teacher>>([RootPath.courses, SubPath.schedule], {
      courseId,
      scheduleId,
    }).then(this.showMessage());
  }
}

export const apiService = new ApiService();
export default apiService;
