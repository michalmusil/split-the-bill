import cs from "./UserGridListItem.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faUser } from "@fortawesome/free-solid-svg-icons"

const UserGridListItem = ({ user, onClick }) => {
    
    return (
        <div className={cs.itemContainer} onClick={(e) => { onClick(user) }}>
            <FontAwesomeIcon icon={faUser} />
            <strong>{user.username}</strong>
            <span>{user.email}</span>
        </div>
    )
}

export default UserGridListItem