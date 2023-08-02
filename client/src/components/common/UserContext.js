import { createContext, useState, useEffect } from "react";
import JwtDecoder from 'jwt-decode'

export const UserContext = createContext(null)
export const JwtTokenContext = createContext("")

const Context = ({children}) => {
    const [jwtToken, setJwtToken] = useState("")
    const [user, setUser] = useState(null)


    // When jwt token changes, this effect either sets new logged in user or sets him to null (in case of logout, token is an empty string or null)
    useEffect(() => {
        if (jwtToken === null){
            setUser(null)
            return
        }
        else if (jwtToken){
            const user = JwtDecoder(jwtToken)
            if(user){
                setUser(user)
            }
        }

    }, [jwtToken])

    return (
        <JwtTokenContext.Provider value={{jwtToken, setJwtToken}}> 
            <UserContext.Provider value={user}>
                {children} 
            </UserContext.Provider>
        </JwtTokenContext.Provider>
    )
}

export default Context