import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import container from '../utils/AppContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faUser } from '@fortawesome/free-solid-svg-icons'


const LoginPage = ({ sessionService }) => {   
    const navigate = useNavigate() 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const submit = async (event) => {
        event.preventDefault()
        axios.post(container.routing.logIn, {
            email: email,
            password: password
        }).then((res) => {
            login(res.data)
        }).catch((err) => {
            if(err.response){
                setError("Invalid e-mail or password")
            } else {
                setError("Login was not successfull")
            }
            setPassword("")
        })
    }

    const login = async (responseData) => {
        const token = responseData.token
        await sessionService.logUserInByToken(token)
        navigate('/')
    }

    return (
        <section className="loginPageContent">
            <div className="loginContainer">
                <img src="../../logo.png" alt="Logo" />
                <h1>Split the bill</h1>

                <form onSubmit={submit}>
                    <div>
                        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error ? 
                        <div className="formError">
                            <span>{error}</span>    
                        </div>
                    :
                        ""
                    }
                    <button type="submit">
                        <FontAwesomeIcon icon={faUser}/>
                        Login
                    </button>
                </form>
            </div>
        </section>
    )
}

export default LoginPage