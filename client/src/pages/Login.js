import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import container from '../utils/AppContainer'

const LoginPage = ({ sessionService }) => {   
    const navigate = useNavigate() 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submit = async (event) => {
        event.preventDefault()
        axios.post(container.routing.logIn, {
            email: email,
            password: password
        }).then((res) => {
            //login(res.data.token)
            login(res.data)
        }).catch((err) => {
        })
    }

    const login = async (responseData) => {
        const token = responseData.token
        await sessionService.logUserInByToken(token)
        navigate('/')
    }

    return (
        <form onSubmit={submit}>
            <div>
                <label>E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginPage