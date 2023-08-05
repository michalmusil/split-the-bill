import cs from "./ShoppingDetail.module.css"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import container from '../utils/AppContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import ShoppingItemsList from '../components/shoppings/ShoppingItemsList'
import ConfirmationModal from '../components/modals/ConfirmationModal'
import AddUsersModal from '../components/modals/AddUsersModal'

const ShoppingDetail = ({ sessionService }) => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [shopping, setShopping] = useState(null)
    const [shoppingCreator, setShoppingCreator] = useState(null)
    const [shoppingItems, setShoppingItems] = useState([])
    const [participants, setParticipants] = useState([])

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAddUsersModal, setShowAddUsersModal] = useState(false)

    

    useEffect(() => {
        fetchShoppingDetail()
        fetchShoppingItems()
        fetchParticipants()
    }, [])

    const fetchShoppingDetail = () => {
        axios.get(container.routing.getShoppingById(id), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            setShopping(res.data)
            fetchShoppingCreator(res.data.creatorId)
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
            setShoppingCreator(res.data)
        }).catch((err) => {
            // TODO
        })
    }

    const fetchShoppingItems = () => {
        axios.get(container.routing.getProductAssignmentsByShoppingId(id), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            setShoppingItems(res.data)
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

            {showAddUsersModal && (
                <AddUsersModal 
                sessionService={sessionService}
                alreadyAssignedUsers={participants}
                onDismiss={() => { setShowAddUsersModal(false) }}
                onConfirm={(newUsers) => {

                }} />
            )}

            <div className="pageHeader">
                <div className={cs.titleAndAuthorContainer}>
                    <h1 className='pageTitle'>{shopping?.name}</h1>
                    {shoppingCreator && (
                        <span>{`Created by: ${shoppingCreator.username} (${shoppingCreator.email})`}</span>
                    )}
                </div>
                
                {shoppingCreator?.id === sessionService.getUser()?.id && ( 
                    <button className={cs.deleteButton} onClick={(e) => {
                        setShowDeleteModal(true)
                    }}>
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                    </button>
                    )
                }
                
            </div>

            <div>
                <h2>Participants</h2>
                <button className="circularButton" onClick={(e) => {
                    setShowAddUsersModal(true)
                }}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>

            <div className={cs.shoppingDetailPageContent}>
                <ShoppingItemsList sessionService={sessionService} shoppingItems={shoppingItems} shopping={shopping}
                    onItemAdded={(item) => {
                        setShoppingItems([...shoppingItems, item])
                    }}
                    onItemUpdated={(item => {
                        // TODO
                    })}/>
            </div>
        </section>
    )
}
export default ShoppingDetail