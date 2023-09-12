import { Outlet } from "react-router-dom";

const UnauthorizedLayout = () => {
    return (
        <>
            <Outlet />
        </>
    )
}

export default UnauthorizedLayout