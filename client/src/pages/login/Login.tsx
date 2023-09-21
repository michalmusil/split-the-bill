import cs from "./Login.module.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faUser } from '@fortawesome/free-solid-svg-icons'
import { ISessionService } from "../../services/sessionService";
import { IAuthRepository } from "../../data/stbApi";


type UserCreds = {
    email: string
    password: string
}

export interface LoginPageProps {
    sessionService: ISessionService
    authRepository: IAuthRepository
}

export const LoginPage = ({ sessionService, authRepository }: LoginPageProps) => {
    const navigate = useNavigate()
    const [userCreds, setUserCreds] = useState<UserCreds>({ email: "", password: "" })
    const [error, setError] = useState<string | null>(null)

    const login = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        setError(null)

        const credentialsError = getLoginCredentialsError()
        if (credentialsError != null) {
            setError(credentialsError)
            return
        }

        const loggedInUser = await authRepository.logInWithEmailAndPassword(userCreds.email, userCreds.password)

        if (loggedInUser == null) {
            setUserCreds({ ...userCreds, password: "" })
            setError("Login was not successfull")
            return
        }

        await sessionService.logUserInByToken(loggedInUser.token)
        navigate('/')
    }

    const getLoginCredentialsError = (): string | null => {
        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm")
        const passwordValid = userCreds.password.length >= 4
        if (!emailRegex.test(userCreds.email)) {
            return "E-mail address is not valid"
        }
        if (!passwordValid) {
            return "Password must be at least 4 characters long"
        }
        return null
    }

    return (
        <section className={cs.loginPageContent}>
            <div className={cs.loginContainer}>
                <img src="../../logo.png" alt="Logo" />
                <h1>Split the bill</h1>

                <form>
                    <div>
                        <input type="email" placeholder="E-mail" value={userCreds.email} onChange={
                            (e) => {
                                setUserCreds({ ...userCreds, email: e.target.value })
                            }
                        } />
                    </div>
                    <div>
                        <input type="password" placeholder="Password" value={userCreds.password} onChange={
                            (e) => setUserCreds({ ...userCreds, password: e.target.value })
                        } />
                    </div>
                    {error ?
                        <div className={cs.formError}>
                            <span>{error}</span>
                        </div>
                        :
                        ""
                    }
                    <button type="submit" onClick={(e) => { login(e) }}>
                        <FontAwesomeIcon icon={faUser} />
                        Login
                    </button>
                </form>
            </div>
        </section>
    )
}