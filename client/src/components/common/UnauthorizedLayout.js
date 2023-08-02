import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const UnauthorizedLayout = () => {
    const navigate = useNavigate()
    const user = useContext(UserContext)

    useEffect(() => {
        if (user){
            navigate('/')
        }
    }, [user])

    
    return (
        <>
            <Outlet />
        </>
    )
}

export default UnauthorizedLayout