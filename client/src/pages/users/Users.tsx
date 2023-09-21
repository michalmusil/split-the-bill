import cs from "./Users.module.css"
import { useEffect, useState } from "react"

import { TextSearch } from "../../components/ui/text_search/TextSearch"
import UserGridListItem from "./components/user_grid_list_item/UserGridListItem"
import { useNavigate } from "react-router-dom"
import { ISessionService } from "../../services/sessionService"
import { IUser } from "../../data/models/domain"
import { IUsersRepository } from "../../data/stbApi"


export interface UsersProps {
    sessionService: ISessionService
    usersRepository: IUsersRepository
}

export const UsersPage = ({ sessionService, usersRepository }: UsersProps) => {
    const navigate = useNavigate()
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        fetchUsers(null)
    }, [])

    const fetchUsers = (query: string | null) => {
        usersRepository.getUsers(query).then((users) => {
            const loggedInUser = users.filter((user) => { return user.id === sessionService.getUserId() })[0]
            if (loggedInUser) {
                const indexToRemove = users.indexOf(loggedInUser)
                users.splice(indexToRemove, 1)
            }
            setUsers(users)
        }).catch((err) => {
            console.log(err)
        })
    }

    const goToUserDetail = (user: IUser) => {
        navigate(`/users/${user.id}`)
    }

    return (
        <section>
            <div className='pageHeader'>
                <div className="pageTitleWithActionsContainer">
                    <h1 className='pageTitle'>Users</h1>
                </div>
                <div className="filterContainer">
                    <TextSearch
                        onSearchConfirmed={(phrase: string) => {
                            fetchUsers(phrase)
                        }}
                        onSearchCancel={() => {
                            fetchUsers(null)
                        }} />
                </div>
            </div>

            {users?.length < 1 && (
                <div>
                    <p>No users have been found</p>
                </div>
            )}

            <div className={cs.usersListContainer}>
                <ul className={cs.usersList}>
                    {users.map((user, key) => {
                        return (
                            <li key={key}>
                                <UserGridListItem user={user} onClick={
                                    (user: IUser) => { goToUserDetail(user) }
                                } />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}