import Cookies from "universal-cookie";
import { ILoggedInUser } from "../../data/models/domain";
import { ISessionService, jwtTokenKey } from "./iSessionService";
import JwtDecoder from 'jwt-decode'

export default class SessionService implements ISessionService{
    cookies: Cookies
    user: ILoggedInUser | null
    onInitialized: () => void

    constructor(onInitialized: () => void){
        this.cookies = new Cookies()
        this.user = null
        this.onInitialized = onInitialized
    }
    
    isAuthorized(): boolean {
        return this.user != null
    }
    getUser(): ILoggedInUser | null {
        return this.user
    }
    getUserId(): number | null {
        return this.user?.id ?? null
    }
    getUserToken(): string | null {
        return `Bearer ${this.user?.token}` ?? null
    }
    async logUserInByToken(token: string): Promise<void> {
        if (!token){
            throw Error('User token can\'t be empty')
        }
        const newUser = JwtDecoder(token) as any
        if(!newUser){
            throw Error('Could not decode user from token')
        }
        
        const existingUserToken = this.cookies.get(jwtTokenKey)
        if (existingUserToken){
            this.cookies.remove(jwtTokenKey)
        }
        
        this.user = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token: token
        }
        this.cookies.set(jwtTokenKey, token, { expires: new Date(newUser.exp * 1000) })
        this.onInitialized()
    }
    
    async logOut(): Promise<void> {
        this.cookies.remove(jwtTokenKey)
        this.user = null
    }

    async getStoredUserFromCookie(): Promise<void> {
        const existingUserToken = this.cookies.get(jwtTokenKey)
        if (existingUserToken){
            await this.logUserInByToken(existingUserToken)
        } else {
            this.onInitialized()
        }
    }
    
}