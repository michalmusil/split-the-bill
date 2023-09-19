import cs from "./Users.module.css"
import { useEffect, useState } from "react"
import { UsersRepository } from '../../data/stbApi'

import TextSearch from "../../components/ui/text_search/TextSearch"
import UserGridListItem from "./components/user_grid_list_item/UserGridListItem"
import { useNavigate } from "react-router-dom"

const Users = ({ sessionService }) => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchUsers(null)
    }, [])

    const fetchUsers = (query) => {
        UsersRepository.getUsers(sessionService.getUserToken(), query).then((users) => {
            const loggedInUser = users.filter((user) => { return user.id === sessionService.getUserId() })[0]
            if (loggedInUser) {
                const indexToRemove = users.indexOf(loggedInUser)
                users.splice(indexToRemove, 1)
            }
            setUsers(users)
        }).catch((err) => {
            // TODO
        })
    }

    const goToUserDetail = (user) => {
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
                        onSearchConfirmed={(phrase) => {
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
                                <UserGridListItem user={user} onClick={(user) => { goToUserDetail(user) }} />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}

export default Users