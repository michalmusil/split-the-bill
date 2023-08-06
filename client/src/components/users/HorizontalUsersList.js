import cs from "./HorizontalUsersList.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons'

const HorizontalUsersList = ({ sessionService, users, onUserClicked, onUserDelete=null }) => {
    
    return (
        <div className={cs.usersListContainer}>
            <ul className={cs.usersList}>
                {
                    users.map((user, key) => {
                        return (
                            <li key={key} className={cs.userItem} onClick={(e) => { onUserClicked(user) }}>
                                <FontAwesomeIcon className={cs.userIcon} icon={faUser} />
                                <div className={cs.userDetail}>
                                    <span className={cs.username}>{user.username}</span>
                                    <span className={cs.email}>{user.email}</span>
                                </div>
                                {onUserDelete !== null && user.id !== sessionService.getUserId() && (
                                    <FontAwesomeIcon className={cs.deleteIcon} icon={faXmark} onClick={(e) => {
                                        onUserDelete(user)
                                    }}/>
                                )}
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default HorizontalUsersList