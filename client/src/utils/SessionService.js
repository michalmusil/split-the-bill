import container from './AppContainer'
import Cookies from 'universal-cookie'
import JwtDecoder from 'jwt-decode'

class SessionService{
    constructor(onInitialized){
        this.cookies = new Cookies()
        this.user = null
        this.onInitialized = onInitialized
    }

    isAuthorized(){
        return this.user !== null
    }

    getUser(){
        if (this.user != null){
            return this.user
        }
        return null
    }

    getUserToken(){
        if (this.user != null){
            return `Bearer ${this.user.token}`
        }
        return null
    }

    async logUserInByToken(token){
        if (!token){
            throw Error('User token can\'t be empty')
        }
        const newUser = JwtDecoder(token)
        if(!newUser){
            throw Error('Could not decode user from token')
        }
        
        const existingUserToken = this.cookies.get(container.cookies.jwtTokenKey)
        if (existingUserToken){
            this.cookies.remove(container.cookies.jwtTokenKey)
        }
        
        this.user = {
            username: newUser.username,
            email: newUser.email,
            token: token
        }
        this.cookies.set(container.cookies.jwtTokenKey, token, { expires: new Date(this.user.exp * 1000) })
        this.onInitialized()
    }

    async logOut(){
        this.cookies.remove(container.cookies.jwtTokenKey)
        this.user = null
    }

    async getStoredUserFromCookie(){
        const existingUserToken = this.cookies.get(container.cookies.jwtTokenKey)
        if (existingUserToken){
            await this.logUserInByToken(existingUserToken)
        } else {
            this.onInitialized()
        }
    }
}

export default SessionService