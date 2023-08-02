import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const AppHeader = ({SessionService}) => {
    const navigate = useNavigate()
    const logout = async (e) => {
        await SessionService.logOut()
        navigate('/auth/login')
    }

    const [user, setUser] = useState(null)
    useEffect(() => {
        setUser(SessionService.getUser())
    })


    return (
        <header className = 'header'>
            <div className = 'header-logo'>
                <img src = '../../../logo.png' alt='Logo'></img>
                <h1>Split the bill</h1>
            </div>

            <div className = 'header-navigation'>
                <ul>
                    <li><Link to = '/'>Home</Link></li>
                    <li><Link to = '/shoppings'>Shoppings</Link></li>
                    <li><Link to = '/products'>Products</Link></li>
                    <li><Link to = '/users'>Other shoppers</Link></li>
                </ul>
            </div>

            <div className = 'header-user' onClick = {(e) => logout(e)}>
                <p>{user?.email}</p>
            </div>
        </header>
    )
}

export default AppHeader