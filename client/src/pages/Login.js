import cs from "./Login.module.css"
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

    const submit = async (event, mail, pass) => {
        event.preventDefault()
        setError(null)

        const credentialsError = getLoginCredentialsError(mail, pass)
        if(credentialsError){
            setError(credentialsError)
            return
        }

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

    const getLoginCredentialsError = (mail, pass) => {
        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm")
        const passwordValid = pass.length >= 4
        if(!emailRegex.test(mail)){
            return "E-mail address is not valid"
        }
        if(!passwordValid){
            return "Password must be at least 4 characters long"
        }
        return null
    } 

    const login = async (responseData) => {
        const token = responseData.token
        await sessionService.logUserInByToken(token)
        navigate('/')
    }

    return (
        <section className={cs.loginPageContent}>
            <div className={cs.loginContainer}>
                <img src="../../logo.png" alt="Logo" />
                <h1>Split the bill</h1>

                <form>
                    <div>
                        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error ? 
                        <div className={cs.formError}>
                            <span>{error}</span>    
                        </div>
                    :
                        ""
                    }
                    <button type="submit" onClick={(e) => { submit(e, email, password) }}>
                        <FontAwesomeIcon icon={faUser}/>
                        Login
                    </button>
                </form>
            </div>
        </section>
    )
}

export default LoginPage