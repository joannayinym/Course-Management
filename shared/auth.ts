export interface loginType {
  email: string;
  password: string;
  role: string;
  remember: boolean;
}

export interface loginReturnType {
  role: string;
  token: string;
  userId: string;
}
