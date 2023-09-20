import cs from "./UserDetail.module.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IUsersRepository, UsersRepository } from '../../data/stbApi'

import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons"
import { ISessionService } from "../../services/sessionService"
import { IUser } from "../../data/models/domain"


export interface UserDetailProps {
    sessionService: ISessionService,
    usersRepository: IUsersRepository
}

export interface UserDetailParams {
    id: number
}

export const UserDetail = ({ sessionService, usersRepository }: UserDetailProps) => {
    const { id } = useParams() as unknown as UserDetailParams

    const [user, setUser] = useState<IUser | null>(null)
    const [isSelf, setIsSelf] = useState(false)

    useEffect(() => {
        usersRepository.getUserById(id).then((usr) => {
            if (usr.id === sessionService.getUserId()) {
                setIsSelf(true)
            }
            setUser(usr)
        }).catch((err) => {
            // TODO
        })
    }, [])

    return (
        <section className={cs.userSection}>
            {user && (
                <div className={cs.inlineWrapper}>
                    <h1>{user?.username}</h1>
                    <div className={cs.information}>
                        <div className={cs.username}>
                            <FontAwesomeIcon icon={faUser} />
                            <span>{user?.username}</span>
                        </div>
                        <div className={cs.password}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>{user?.email}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}