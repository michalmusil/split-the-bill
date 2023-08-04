import cs from "./ShoppingDetail.module.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import container from '../utils/AppContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faTrash,faPlus } from '@fortawesome/free-solid-svg-icons'

const ShoppingDetail = ({ sessionService }) => {
    const { id } = useParams()

    const [shopping, setShopping] = useState(null)
    const [productAssigments, setProductAssignments] = useState([])
    const [participants, setParticipants] = useState([])

    // Attributes of new shopping item to create
    const [newItemName, setNewItemName] = useState(null)
    const [newItemDescription, setNewItemDescription] = useState(null)
    const [newItemQuantity, setNewItemQuantity] = useState(null)
    const [newItemUnitPrice, setNewItemUnitPrice] = useState(null)

    useEffect(() => {
        fetchShoppingDetail()
        fetchProductAssignments()
        fetchParticipants()
    }, [])

    const fetchShoppingDetail = () => {
        axios.get(container.routing.getShoppingById(id), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            setShopping(res.data)
        }).catch((err) => {
            // TODO
        })
    }

    const fetchProductAssignments = () => {
        axios.get(container.routing.getProductAssignmentsByShoppingId(id), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            setProductAssignments(res.data)
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

    useEffect(() => {
        console.log(`${newItemName} ;${newItemDescription} ;${newItemQuantity} ;${newItemUnitPrice} ;`)
    }, [newItemName, newItemDescription, newItemQuantity, newItemUnitPrice])




    return (
        <section className="shoppingDetailPageContent">
            <div className="pageHeader">
                 <h1 className='pageTitle'>{shopping?.name}</h1>

                <button className={cs.deleteButton}onClick={(e) => { /* TODO */ }}>
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                </button>
            </div>

            <div className={cs.shoppingDetailPageContent}>
                <table className={cs.shoppingProductAssignmentsTable}>
                    <thead>
                        <tr className={cs.tableTitle}>
                            <th colSpan={5}>
                                <h1>List of products</h1>
                            </th>
                        </tr>
                        <tr className={cs.tableTitle}>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productAssigments.map((product, key) => {
                            return (
                                <tr key={key}>
                                    <td>{product.name}</td>
                                    <td>{product.description || "-"}</td>
                                    <td>{product.quantity || "-"}</td>
                                    <td>{product.unitPrice ? `${product.unitPrice},-` : "-"}</td>
                                    <td>{product.unitPrice && product.quantity ?
                                        `${product.unitPrice * product.quantity},-`
                                        :
                                        "-"
                                    }</td>
                                </tr>
                            )
                        })}
                        <tr className={cs.newItemInputRow}>
                            <td>
                                <input type="text" placeholder="Name" onChange={(e) => { 
                                    setNewItemName(e.target.value || null) 
                                }}/>
                             </td>
                            <td></td>
                            <td>
                                <input type="number" placeholder="Quantity" onChange={(e) => { 
                                    const integerValue = parseInt(e.target.value)
                                    setNewItemQuantity(integerValue || null) 
                                }}/></td>
                            <td>
                                <input type="number" placeholder="Unit price" onChange={(e) => { 
                                    const asNumber = Number(e.target.value)
                                    setNewItemUnitPrice(asNumber || null)
                                }}/></td>
                            <td>
                                {newItemQuantity && newItemUnitPrice ? 
                                    `${newItemQuantity * newItemUnitPrice},-`
                                :
                                    "-"
                                }
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={5}>
                                <button>
                                    <FontAwesomeIcon icon={faPlus} />
                                    Add
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    )
}
export default ShoppingDetail