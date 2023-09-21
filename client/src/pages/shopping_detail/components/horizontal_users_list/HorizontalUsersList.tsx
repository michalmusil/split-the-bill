import cs from "./HorizontalUsersList.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { ISessionService } from "../../../../services/sessionService"
import { IUser } from "../../../../data/models/domain"

/**
 * @param users List of users to display in the list
 * @param onUserClicked Specifies what happens when user item is clicked
 * @param onUserDelete If not null, deletion icon will be displayed for every user item. Specifies what happens, when user clicks on the delete icon
 */
export interface HorizontalUsersListProps {
    sessionService: ISessionService
    users: IUser[]
    onUserClicked: (user: IUser) => void
    onUserDelete: ((user: IUser) => void) | null
}

/**
 * A simple horizontal list of pill-shaped user list items, with optional functionalityAdded
 */
export const HorizontalUsersList = ({ sessionService, users, onUserClicked, onUserDelete }: HorizontalUsersListProps) => {
    
    return (
        <div className={cs.usersListContainer}>
            <ul className={cs.usersList}>
                {
                    users.map((user, key) => {
                        return (
                            <li key={key} className={cs.userItem}>
                                <FontAwesomeIcon className={cs.userIcon} icon={faUser} onClick={(e) => { onUserClicked(user) }} />
                                <div className={cs.userDetail} onClick={(e) => {onUserClicked(user)}}>
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