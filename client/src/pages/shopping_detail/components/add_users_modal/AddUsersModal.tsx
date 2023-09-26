import { useState } from "react"
import cs from "./AddUsersModal.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCheck } from '@fortawesome/free-solid-svg-icons'

import { Lookup } from "../../../../components/ui/lookup/Lookup"
import { BaseModal } from "../../../../components/modals/base_modal/BaseModal"
import { HorizontalUsersList } from "../horizontal_users_list/HorizontalUsersList"
import { ISessionService } from "../../../../services/sessionService"
import { IUser } from "../../../../data/models/domain"
import { IUsersRepository } from "../../../../data/stbApi"

/**
 * @param onConfirm Handles user confirming his choices of added users
 * @param onDismiss Handles when user aborts adding users
 * @param alreadyAssignedUsers Users that are already assigned to the parent shopping
 */
export interface AddUserModalProps {
    isShown: boolean
    sessionService: ISessionService
    usersRepository: IUsersRepository
    onConfirm: (users: IUser[]) => void
    onDismiss: () => void
    alreadyAssignedUsers: IUser[]
}

export const AddUsersModal = ({ isShown, sessionService, usersRepository, onConfirm, onDismiss, alreadyAssignedUsers }: AddUserModalProps) => {
    const [usersToAdd, setUsersToAdd] = useState<IUser[]>([])

    const fetchUserResults = async (query: string): Promise<IUser[]> => {
        const matchingUsers = await usersRepository.getUsers(query)
        const relevantResults = matchingUsers.filter((user) => {
            const matchInAssigned = alreadyAssignedUsers.filter((existingUser) => {
                return existingUser.id === user.id
            })
            const matchInAlreadySelected = usersToAdd.filter((existingItem) => {
                return existingItem.id === user.id
            })
            return matchInAssigned.length < 1 && matchInAlreadySelected.length < 1
        })
        return relevantResults
    }

    return (
        <BaseModal isShown={isShown} onDismiss={onDismiss}>
            <div className={cs.sizeJustifier}>
                <h1>Add users</h1>

                {usersToAdd?.length > 0 && (
                    <HorizontalUsersList
                        sessionService={sessionService}
                        users={usersToAdd}
                        onUserClicked={(user) => {
                            const newUsers = [...usersToAdd]
                            const indexToRemove = newUsers.indexOf(user)
                            newUsers.splice(indexToRemove, 1)
                            setUsersToAdd(newUsers)
                        }}
                        onUserDelete={null}
                    />
                )}

                <Lookup
                    fetchData={fetchUserResults}
                    getDataStringRepresentation={(user: IUser) => {
                        return `${user.username} (${user.email})`
                    }}
                    onItemSelected={(user: IUser) => {
                        setUsersToAdd([...usersToAdd, user])
                    }}
                    placeholder="Search user"
                    resultsDebounceMillis={500} />

                {usersToAdd?.length > 0 && (
                    <button onClick={(e) => { onConfirm(usersToAdd) }}>
                        <FontAwesomeIcon icon={faCheck} />
                        Confirm
                    </button>
                )}
            </div>
        </BaseModal>
    )
}