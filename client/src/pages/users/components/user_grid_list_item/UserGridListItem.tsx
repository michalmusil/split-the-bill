import cs from "./UserGridListItem.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faUser } from "@fortawesome/free-solid-svg-icons"
import { IUser } from "../../../../data/models/domain"

/**
 * @param user user to be displayed in the list item
 * @param onClick what happens when user clicks on the given list item
 */
export interface UserGridListItemProps {
    user: IUser
    onClick: (user: IUser) => void
}

const UserGridListItem = ({ user, onClick }: UserGridListItemProps) => {
    
    return (
        <div className={cs.itemContainer} onClick={(e) => { onClick(user) }}>
            <FontAwesomeIcon icon={faUser} />
            <strong>{user.username}</strong>
            <span>{user.email}</span>
        </div>
    )
}

export default UserGridListItem