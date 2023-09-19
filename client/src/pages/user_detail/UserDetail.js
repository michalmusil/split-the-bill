import cs from "./UserDetail.module.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { UsersRepository } from '../../data/stbApi'

import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons"

const UserDetail = ({ sessionService }) => {
    const { id } = useParams()

    const [user, setUser] = useState(null)
    const [isSelf, setIsSelf] = useState(false)

    useEffect(() => {
        UsersRepository.getUserById(sessionService.getUserToken(), id).then((usr) => {
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

export default UserDetail