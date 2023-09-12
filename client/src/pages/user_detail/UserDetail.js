import cs from "./UserDetail.module.css"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import container from '../../utils/AppContainer'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons"

const UserDetail = ({ sessionService }) => {
    const { id } = useParams()

    const [user, setUser] = useState(null)
    const [isSelf, setIsSelf] = useState(false)

    useEffect(() => {
        axios.get(container.routing.getUserById(id), {
            headers: { Authorization: sessionService.getUserToken() }
        }).then((res) => {
            const usr = res.data
            if (usr.id === sessionService.getUserId()){
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