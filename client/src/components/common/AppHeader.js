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
        <header className = 'header'>
            <div className = 'headerLogo'>
                <img src = '../../../logo.png' alt='Logo'></img>
                <h1>Split the bill</h1>
            </div>

            <div className = 'headerNavigation'>
                <ul>
                    <li><Link to = '/'>
                            <div className='headerNavigationLink'>Home</div>
                        </Link>
                    </li>
                    <li><Link to = '/shoppings'>
                            <div className='headerNavigationLink'>Shoppings</div>
                        </Link>
                    </li>
                    <li><Link to = '/products'>
                            <div className='headerNavigationLink'>Products</div>
                        </Link>
                    </li>
                    <li><Link to = '/users'>
                            <div className='headerNavigationLink'>Users</div>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className = 'headerUser'>
                <p>{user?.email}</p>
                <FontAwesomeIcon icon={faRightFromBracket} 
                    className="logoutIcon" onClick={(e) => {
                    logout(e)
                }}/>
            </div>
        </header>
    )
}

export default AppHeader