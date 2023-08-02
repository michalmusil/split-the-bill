import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";

const AuthorizedLayout = ({ children, SessionService}) => {
    const navigate = useNavigate()

    useEffect(() => {
        const loggedIn = SessionService.isAuthorized()
        if (!loggedIn){
            navigate('/auth/login')
        }
    })

    return (
        <>
            <AppHeader SessionService={SessionService}/>
            <Outlet />
        </>
    )
}

export default AuthorizedLayout