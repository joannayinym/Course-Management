import { LoginResponse, Role } from "./types/user";

export type UserInfo = LoginResponse;

export class Storage {
  private key = "cms";

  setUserInfo(info: UserInfo): void {
    localStorage.setItem(this.key, JSON.stringify(info));
  }

  get userInfo(): UserInfo | null {
    try {
      return JSON.parse(localStorage.getItem(this.key) ?? "{}") as UserInfo;
    } catch (error) {
      return null;
    }
  }

  get token(): string | undefined {
    return this.userInfo?.token;
  }

  get role(): Role | undefined {
    return this.userInfo?.role;
  }

  get userId(): number {
    return this.userInfo ? +this.userInfo?.userId : 0;
  }

  deleteUserInfo(): void {
    localStorage.removeItem(this.key);
  }
}
export const storage = new Storage();

export default storage;
