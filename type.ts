export interface UserInfo {
  mobile: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      userInfo: UserInfo;
    }
  }
}
