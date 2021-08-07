import { message } from "antd";
import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import { RootPath, SubPath } from "../constants/apiPath";
import {
  AddCourseRequest,
  AddCourseResponse,
  CourseDetail,
  CourseRequest,
  CourseResponse,
  UpdateCourseRequest,
  UpdateCourseResponse,
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
import { IResponse, QueryParams } from "../types/type";
import { LoginRequest, LoginResponse } from "../types/user";

type IPath = (string | number)[] | string | number;

async function axiosGet<T>(path: IPath, params?: QueryParams): Promise<T> {
  let currentPath = getPath(path);
  currentPath = !!params
    ? `${currentPath}?${paramsSerializer(params)}`
    : currentPath;

  return axiosInstance
    .get(currentPath)
    .then((res) => res.data)
    .catch((err) => errorHandler(err));
}
//--------------------------------------------------
//--------------------------------------------------
const get = async <T>(path: IPath, params?: QueryParams): Promise<T> => {
  let currentPath = getPath(path);
  currentPath = !!params
    ? `${currentPath}?${paramsSerializer(params)}`
    : currentPath;

  return axiosInstance
    .get(currentPath)
    .then((res) => res.data)
    .catch((err) => errorHandler(err));
};

async function axiosPost<T>(path: IPath, params: object): Promise<T> {
  return axiosInstance
    .post(getPath(path), params)
    .then((res) => res.data)
    .catch(errorHandler);
}

async function axiosDelete<T>(path: IPath): Promise<T> {
  return axiosInstance
    .delete(getPath(path))
    .then((res) => res.data)
    .catch(errorHandler);
}

async function axiosPut<T>(path: IPath, params: object): Promise<T> {
  return axiosInstance
    .put(getPath(path), params)
    .then((res) => res.data)
    .catch(errorHandler);
}

function paramsSerializer(params: QueryParams) {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

function getPath(path: IPath): string {
  return !Array.isArray(path) ? String(path) : path.join("/");
}

function isError(code: number): boolean {
  return !(code.toString().startsWith("2") || code.toString().startsWith("3"));
}

function errorHandler(error: AxiosError<IResponse>): IResponse {
  const msg = error.response?.data.msg || "";
  const code = error.response?.status || 0;
  return { msg, code };
}

const showMessage =
  (isSuccessDisplay = false) =>
  (res: IResponse): IResponse => {
    const { code, msg } = res;
    const err = isError(code);

    if (err) {
      message.error(msg);
    }

    if (isSuccessDisplay && !isError) {
      message.success(msg);
    }

    return res;
  };

export async function login(
  req: LoginRequest
): Promise<IResponse<LoginResponse>> {
  return axiosPost<IResponse<LoginResponse>>(RootPath.login, req).then(
    showMessage()
  );
}

export async function logout(): Promise<IResponse<boolean>> {
  return axiosPost<IResponse<boolean>>(RootPath.logout, {}).then(showMessage());
}

export async function getCountries(): Promise<IResponse<Country[]>> {
  return axiosGet<IResponse<Country[]>>(RootPath.countries).then(showMessage());
}

export async function getStudents(
  req: StudentsRequest
): Promise<IResponse<StudentsResponse>> {
  return axiosGet<IResponse<StudentsResponse>>(
    RootPath.students,
    req as unknown as QueryParams
  );
}
//---------------------------------------------
//---------------------------------------------
export async function getStudentsTest(
  req: StudentsRequest
): Promise<IResponse<StudentsResponse>> {
  return get<IResponse<StudentsResponse>>(
    RootPath.students,
    req as unknown as QueryParams
  );
}

export async function getStudentById(
  id: number
): Promise<IResponse<StudentProfile>> {
  return axiosGet<IResponse<StudentProfile>>([RootPath.students, id]).then(
    showMessage()
  );
}

export async function addStudent(
  req: AddStudentRequest
): Promise<IResponse<AddStudentResponse>> {
  return axiosPost<IResponse<AddStudentResponse>>(RootPath.students, req).then(
    showMessage(true)
  );
}

export async function updateStudent(
  req: UpdateStudentRequest
): Promise<IResponse<UpdateStudentResponse>> {
  return axiosPut<IResponse<UpdateStudentResponse>>(
    RootPath.students,
    req
  ).then(showMessage(true));
}

export async function deleteStudent(id: number): Promise<IResponse<boolean>> {
  return axiosDelete<IResponse<boolean>>([RootPath.students, id]).then(
    showMessage(true)
  );
}

export async function getCourses(
  req: CourseRequest
): Promise<IResponse<CourseResponse>> {
  return axiosGet<IResponse<CourseResponse>>(
    RootPath.courses,
    req as unknown as QueryParams
  ).then(showMessage());
}

export async function getCourseById(
  id: number
): Promise<IResponse<CourseDetail>> {
  return axiosGet<IResponse<CourseDetail>>([RootPath.courses, SubPath.detail], {
    id,
  }).then(showMessage());
}

export async function addCourse(
  req: AddCourseRequest
): Promise<IResponse<AddCourseResponse>> {
  return axiosPost<IResponse<AddCourseResponse>>(RootPath.courses, req).then(
    showMessage()
  );
}

export async function updateCourse(
  req: UpdateCourseRequest
): Promise<IResponse<UpdateCourseResponse>> {
  return axiosPut<IResponse<UpdateCourseResponse>>(RootPath.courses, req).then(
    showMessage()
  );
}

export async function deleteCourse(id: number): Promise<IResponse<boolean>> {
  return axiosDelete<IResponse<boolean>>([RootPath.courses, id]).then(
    showMessage()
  );
}
