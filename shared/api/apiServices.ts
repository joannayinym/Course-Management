import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import { Country } from "../types/others";
import {
  AddStudentRequest,
  AddStudentResponse,
  Student,
  StudentProfile,
  StudentsRequest,
  StudentsResponse,
  UpdateStudentRequest,
  UpdateStudentResponse,
} from "../types/student";
import { IResponse, QueryParams } from "../types/type";
import { LoginRequest, LoginResponse } from "../types/user";

class ApiService {
  private errorHandler(error: AxiosError<IResponse>): IResponse {
    const msg = error.response?.data.msg || "";
    const code = error.response?.status || 0;
    return { msg, code };
  }

  private paramsSerializer(params: QueryParams) {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }

  login(req: LoginRequest): Promise<IResponse<LoginResponse>> {
    return axiosInstance
      .post<IResponse<LoginResponse>>("/login", req)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  logout(): Promise<IResponse<boolean>> {
    return axiosInstance
      .post<IResponse<boolean>>("/logout")
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  getStudents(req: StudentsRequest): Promise<IResponse<StudentsResponse>> {
    return axiosInstance
      .get<IResponse<StudentsResponse>>(
        `/students?${this.paramsSerializer(req as unknown as QueryParams)}`
      )
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  getStudentById(id: number): Promise<IResponse<StudentProfile>> {
    return axiosInstance
      .get<IResponse<StudentProfile>>(`/students/${id}`)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  getCountries(): Promise<IResponse<Country[]>> {
    return axiosInstance
      .get<IResponse<Country[]>>("/countries")
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  addStudent(req: AddStudentRequest): Promise<IResponse<AddStudentResponse>> {
    return axiosInstance
      .post<IResponse<AddStudentResponse>>("/students", req)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  updateStudent(
    req: UpdateStudentRequest
  ): Promise<IResponse<UpdateStudentResponse>> {
    return axiosInstance
      .put<IResponse<UpdateStudentResponse>>("/students", req)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }

  deleteStudent(id: number): Promise<IResponse<boolean>> {
    return axiosInstance
      .delete<IResponse<boolean>>(`/students/${id}`)
      .then((res) => res.data)
      .catch(this.errorHandler);
  }
}

export const apiService = new ApiService();
export default apiService;
