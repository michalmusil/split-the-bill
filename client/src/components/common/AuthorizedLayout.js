import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import AppHeader from "./AppHeader";

const AuthorizedLayout = ({ children }) => {
    const navigate = useNavigate()
    const user = useContext(UserContext)

    useEffect(() => {
        if (!user){
            navigate('/auth/login')
        }
    }, [user])

    return (
        <>
            <AppHeader loggedInUser={user}/>
            <Outlet />
        </>
    )
}

export default AuthorizedLayout