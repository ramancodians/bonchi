export interface UserInfo {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      userInfo: UserInfo;
    }
  }
}
