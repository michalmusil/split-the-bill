import cs from "./AppHeader.module.css"
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { ISessionService } from "../../../services/sessionService"
import { IUser } from "../../../data/models/domain"


export interface AppHeaderProps {
    sessionService: ISessionService
}

export const AppHeader = ({ sessionService }: AppHeaderProps) => {
    const navigate = useNavigate()
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        setUser(sessionService.getUser())
    })

    const goToUserDetail = (): void => {
        if(user != null){
            navigate(`users/${user.id}`)
        }
    }

    const logout = async (): Promise<void> => {
        await sessionService.logOut()
        navigate('/auth/login')
    }

    return (
        <header className={cs.header}>
            <div className={cs.headerLogo}>
                <img src='../../../logo.png' alt='Logo'></img>
                <h1>Split the bill</h1>
            </div>

            <div className={cs.headerNavigation}>
                <ul>
                    <li><Link to='/'>
                        <div className={cs.headerNavigationLink}>Home</div>
                    </Link>
                    </li>
                    <li><Link to='/shoppings'>
                        <div className={cs.headerNavigationLink}>Shoppings</div>
                    </Link>
                    </li>
                    <li><Link to='/products'>
                        <div className={cs.headerNavigationLink}>Products</div>
                    </Link>
                    </li>
                    <li><Link to='/users'>
                        <div className={cs.headerNavigationLink}>Users</div>
                    </Link>
                    </li>
                </ul>
            </div>

            <div className={cs.headerUser}>
                {
                    user &&
                    <span className={cs.loggedInUserLink} onClick={goToUserDetail}>{user.email}</span>
                }
                <FontAwesomeIcon icon={faRightFromBracket}
                    className={cs.logoutIcon} onClick={(e) => {
                        logout()
                    }} />
            </div>
        </header>
    )
}