import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";

const AuthorizedLayout = ({ children, sessionService}) => {
    const navigate = useNavigate()

    useEffect(() => {
        const loggedIn = sessionService.isAuthorized()
        if (!loggedIn){
            navigate('/auth/login')
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