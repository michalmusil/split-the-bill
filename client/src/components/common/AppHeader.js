import { useLocation, Link } from 'react-router-dom'
import { JwtTokenContext } from './UserContext'
import { useContext } from 'react'

const AppHeader = ({loggedInUser}) => {
    const { setJwtToken } = useContext(JwtTokenContext)

    console.log('logged in user')
    console.log(loggedInUser)

    const logout = async (e) => {
        setJwtToken(null)
    }

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
                <p>{loggedInUser?.username}</p>
            </div>
        </header>
    )
}

export default AppHeader