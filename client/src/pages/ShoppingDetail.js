import cs from "./ShoppingDetail.module.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import container from '../utils/AppContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faTrash,faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import ShoppingItemsList from '../components/shoppings/ShoppingItemsList'

const ShoppingDetail = ({ sessionService }) => {
    const { id } = useParams()

    const [shopping, setShopping] = useState(null)
    const [shoppingCreator, setShoppingCreator] = useState(null)
    const [shoppingItems, setShoppingItems] = useState([])
    const [participants, setParticipants] = useState([])

    

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



    return (
        <section className="shoppingDetailPageContent">
            <div className="pageHeader">
                <div className={cs.titleAndAuthorContainer}>
                    <h1 className='pageTitle'>{shopping?.name}</h1>
                    {shoppingCreator && (
                        <span>{`Created by: ${shoppingCreator.username} (${shoppingCreator.email})`}</span>
                    )}
                </div>
                
                {shoppingCreator?.id === sessionService.getUser()?.id && ( 
                    <button className={cs.deleteButton}onClick={(e) => { /* TODO */ }}>
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                    </button>
                    )
                }
                
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