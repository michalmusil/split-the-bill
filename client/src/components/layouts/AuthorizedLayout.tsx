import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppHeader from "./app_header/AppHeader";
import { ISessionService } from "../../services/sessionService";


export interface AuthorizedLayoutProps{
    sessionService: ISessionService
}

export const AuthorizedLayout = ({ sessionService }: AuthorizedLayoutProps) => {
    const navigate = useNavigate()

    useEffect(() => {
        const loggedIn = sessionService.isAuthorized()
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

