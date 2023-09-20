import { ILoggedInUser } from "../../data/models/domain";

export const jwtTokenKey = "user-jwt"

export interface ISessionService{
    isAuthorized(): boolean
    getUser(): ILoggedInUser | null
    getUserId(): number | null
    getUserToken(): string | null
    logUserInByToken(token: string): Promise<void>
    logOut(): Promise<void>
    getStoredUserFromCookie(): Promise<void>
}