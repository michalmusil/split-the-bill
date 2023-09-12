import cs from "./ShoppingDetail.module.css"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import container from '../../utils/AppContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import ShoppingItemsList from './components/shopping_items_list/ShoppingItemsList'
import ConfirmationModal from '../../components/modals/confirmation/ConfirmationModal'
import AddUsersModal from '../../components/modals/add_users/AddUsersModal'
import HorizontalUsersList from "./components/horizontal_users_list/HorizontalUsersList"

const ShoppingDetail = ({ sessionService }) => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [shopping, setShopping] = useState(null)
    const [shoppingCreator, setShoppingCreator] = useState(null)
    const [participants, setParticipants] = useState([])

    const [userIsAuthor, setUserIsAuthor] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddUsersModal, setShowAddUsersModal] = useState(false)
    
    const [showRemoveUserModal, setShowRemoveUserModal] = useState(false)
    const [userToBeRemoved, setUserToBeRemoved] = useState(null)
    

    useEffect(() => {
        fetchShoppingDetail()
        fetchParticipants()
    }, [])

    useEffect(() => {
        if(shopping?.creatorId){
            fetchShoppingCreator(shopping.creatorId)
        }
    }, [shopping])

    const fetchShoppingDetail = () => {
        axios.get(container.routing.getShoppingById(id), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            const shopping = res.data
            setShopping(res.data)
            setUserIsAuthor(sessionService.getUserId() === shopping.creatorId)
        }).catch((err) => {
            // TODO
        })
    }

    const fetchParticipants = () => {
        axios.get(container.routing.getUsersOfShoppingByShoppingId(id), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            setParticipants(res.data)
        }).catch((err) => {
            // TODO
        })
    }

    const fetchShoppingCreator = (id) => {
        axios.get(container.routing.getUserById(id), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            const creator = res.data
            setShoppingCreator(creator)
        }).catch((err) => {
            // TODO
        })
    }


    const deleteShopping = () => {
        console.log("Deleted")
        axios.delete(container.routing.deleteShopping(id), {
            headers: { Authorization: sessionService.getUserToken() }
        }).then((res) => {
            navigate(-1)
        }).catch((err) => {
            // TODO
        })
    }

    const assignUsersToShopping = async(users) => {
        const addedUsers = []
        for(let i = 0; i<users.length; i++){
            const user = users[i]
            try {
                await axios.post(container.routing.assignUserToShopping(user.id, id), {},{
                    headers: { Authorization: sessionService.getUserToken() }
                })
                addedUsers.push(user)
            }
            catch(err){
                console.log(err)
            }
        }
        setParticipants([...participants, ...addedUsers])
    }

    const unassignUserFromShopping = async(user) => {
        axios.delete(container.routing.unassignUserFromShopping(user.id, id), {
            headers: { Authorization: sessionService.getUserToken() }
        }).then((res) => {
            const newParticipants = [...participants]
            const index = newParticipants.indexOf(user)
            newParticipants.splice(index, 1)

            setParticipants(newParticipants)
            setUserToBeRemoved(null)
        }).catch((err) => {
            setUserToBeRemoved(null)
            // TODO
        })
    }



    return (
        <section className="shoppingDetailPageContent">
            {showDeleteModal && (
                <ConfirmationModal 
                title={"Delete shopping"} 
                body={"Are you sure you want to delete this shopping? This action is irreversible."}
                onDismiss={() => { 
                    setShowDeleteModal(false)
                 }}
                onConfirm={() => {
                    setShowDeleteModal(false)
                    deleteShopping()
                }} />
            )}

            {showRemoveUserModal && (
                <ConfirmationModal 
                title={"Remove participant"} 
                body={`Are you sure you want remove ${userToBeRemoved?.username || "user"} from this shopping? All the user's purchases will be removed.`}
                onDismiss={() => { 
                    setUserToBeRemoved(null)
                    setShowRemoveUserModal(false)
                 }}
                onConfirm={() => {
                    setShowRemoveUserModal(false)
                    if (userToBeRemoved){
                        unassignUserFromShopping(userToBeRemoved)
                    }
                }} />
            )}

            {showAddUsersModal && (
                <AddUsersModal 
                sessionService={sessionService}
                alreadyAssignedUsers={participants}
                onDismiss={() => { setShowAddUsersModal(false) }}
                onConfirm={(newUsers) => {
                    assignUsersToShopping(newUsers)
                    setShowAddUsersModal(false)
                }} />
            )}

            <div className={cs.shoppingDetailContainer}>
                <div className={cs.containerHeader}>
                    <div className={cs.titleAndAuthorContainer}>
                        <h1 className={cs.name}>{shopping?.name}</h1>
                        
                        {shopping?.description && (
                            <p>{shopping.description}</p>
                        )}

                        {userIsAuthor && (
                        <button className={cs.deleteButton} onClick={(e) => {
                            setShowDeleteModal(true)
                        }}>
                            <FontAwesomeIcon icon={faTrash} />
                            Delete
                        </button>
                        )}

                        <span>{`By: ${shoppingCreator?.username} (${shoppingCreator?.email})`}</span>
                    </div>
                    
                </div>

                <div className={cs.participants}>
                    <div className={cs.subHeader}>
                        <h2>Participants</h2>
                        <button className="circularButton" onClick={(e) => {
                            setShowAddUsersModal(true)
                        }}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <HorizontalUsersList
                    sessionService={sessionService}
                    users={participants}
                    onUserClicked={(user) => {
                        navigate(`/users/${user.id}`)
                    }}
                    onUserDelete={userIsAuthor ? (user) => {
                        setUserToBeRemoved(user)
                        setShowRemoveUserModal(true)
                    }
                    :
                    null
                    }/>
                </div>

            </div>
            
            {shopping && (
                <div className={cs.shoppingDetailPageContent}>
                <ShoppingItemsList sessionService={sessionService} shopping={shopping} />
            </div>
            )}
        </section>
    )
}
export default ShoppingDetail