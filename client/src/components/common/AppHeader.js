import cs from "./AppHeader.module.css"
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'


const AppHeader = ({sessionService}) => {
    const navigate = useNavigate()
    const logout = async (e) => {
        await sessionService.logOut()
        navigate('/auth/login')
    }

    const [user, setUser] = useState(null)
    useEffect(() => {
        setUser(sessionService.getUser())
    })


    return (
        <header className = {cs.header}>
            <div className = {cs.headerLogo}>
                <img src = '../../../logo.png' alt='Logo'></img>
                <h1>Split the bill</h1>
            </div>

            <div className = {cs.headerNavigation}>
                <ul>
                    <li><Link to = '/'>
                            <div className={cs.headerNavigationLink}>Home</div>
                        </Link>
                    </li>
                    <li><Link to = '/shoppings'>
                            <div className={cs.headerNavigationLink}>Shoppings</div>
                        </Link>
                    </li>
                    <li><Link to = '/products'>
                            <div className={cs.headerNavigationLink}>Products</div>
                        </Link>
                    </li>
                    <li><Link to = '/users'>
                            <div className={cs.headerNavigationLink}>Users</div>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className = {cs.headerUser}>
                <p>{user?.email}</p>
                <FontAwesomeIcon icon={faRightFromBracket} 
                    className={cs.logoutIcon} onClick={(e) => {
                    logout(e)
                }}/>
            </div>
        </header>
    )
}

export default AppHeader