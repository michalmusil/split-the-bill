import { useState } from "react"
import cs from "./AddUsersModal.module.css"
import axios from "axios"
import container from "../../../utils/AppContainer"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCheck } from '@fortawesome/free-solid-svg-icons'

import Lookup from "../../ui/lookup/Lookup"
import HorizontalUsersList from "../../../pages/shopping_detail/components/horizontal_users_list/HorizontalUsersList"

const AddUserModal = ({ sessionService, onConfirm, onDismiss, alreadyAssignedUsers }) => {
    const [usersToAdd, setUsersToAdd] = useState([])

    const fetchUserResults = async (query) => {
        const results = await axios.get(container.routing.getUsers(query), {
            headers: { Authorization: sessionService.getUserToken() }
        })
        const relevantResults = results.data.filter((resultItem) => {
            const matchInAssigned = alreadyAssignedUsers.filter((existingItem) => {
                return existingItem.id === resultItem.id
            })
            const matchInAlreadySelected = usersToAdd.filter((existingItem) => {
                return existingItem.id === resultItem.id
            })
            return matchInAssigned.length < 1 && matchInAlreadySelected.length < 1
        })
        return relevantResults
    }

    return (
        <div className="modal">
            <div className="modalOverlay" onClick={(e) => { onDismiss() }} />
            <div className="modalContent">
                <div className={cs.sizeJustifier}>
                    <h1>Add users</h1>
                    
                    {usersToAdd?.length > 0 && (
                        <HorizontalUsersList
                        users={usersToAdd}
                        onUserClicked={(user) => {
                            const newUsers = [...usersToAdd]
                            const indexToRemove = newUsers.indexOf(user)
                            newUsers.splice(indexToRemove, 1)
                            setUsersToAdd(newUsers)
                        }} />
                    )}

                    <Lookup 
                    fetchData={fetchUserResults} 
                    getItemStringRepresentation={(user) => {
                        return `${user.username} (${user.email})`
                    }}
                    onItemSelected={(user) => {
                        setUsersToAdd([...usersToAdd, user])
                    }}
                    placeholder="Search user" />

                    {usersToAdd?.length > 0 && (
                        <button onClick={(e) => { onConfirm(usersToAdd) }}>
                            <FontAwesomeIcon icon={faCheck} />
                            Confirm
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddUserModal