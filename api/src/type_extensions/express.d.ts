import SessionUser from "models/sessionUser.ts";

export {}

declare global {
    namespace Express {
      export interface Request {
        user?: SessionUser;
      }
    }
  }
  