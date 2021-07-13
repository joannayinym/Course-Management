import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import { StudentRequest, StudentResponse } from "../types/student";
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

  getStudents(req: StudentRequest): Promise<IResponse<StudentResponse>> {
    return axiosInstance
      .get<IResponse<StudentResponse>>(
        `/students?${this.paramsSerializer(req as unknown as QueryParams)}`
      )
      .then((res) => res.data)
      .catch(this.errorHandler);
  }
}

export const apiService = new ApiService();
export default apiService;
