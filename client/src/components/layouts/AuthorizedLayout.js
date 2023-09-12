import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppHeader from "./app_header/AppHeader";

const AuthorizedLayout = ({ children, sessionService}) => {
    const navigate = useNavigate()

    useEffect(() => {
        const loggedIn = sessionService.isAuthorized()
        //console.log(`Logged in: ${loggedIn}`)
        if (!loggedIn){
            navigate('/auth/login', { replace: true })
        }
    }, [])

    return (
        <>
            <AppHeader sessionService={sessionService}/>
            <Outlet />
        </>
    )
}

export default AuthorizedLayout