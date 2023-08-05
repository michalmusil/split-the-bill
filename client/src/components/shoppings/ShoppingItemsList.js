import cs from './ShoppingItemsList.module.css'
import axios from 'axios'
import container from '../../utils/AppContainer'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faXmark,faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'

const ShoppingItemsList = ({ sessionService, shopping, shoppingItems, onItemAdded, onItemUpdated }) => {
    const [newItemCreateOn, setNewItemCreateOn] = useState(false)
    const [newItemValid, setNewItemValid] = useState(false)
    // Attributes of new shopping item to create
    const [newItemName, setNewItemName] = useState(null)
    const [newItemQuantity, setNewItemQuantity] = useState(null)
    const [newItemUnitPrice, setNewItemUnitPrice] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const valid = newItemName && newItemQuantity
        console.log(valid)
        setNewItemValid(valid)
    }, [newItemName, newItemQuantity, newItemUnitPrice])

    const addNewShoppingItem = (name, quantity, unitPrice) => {
        const alreadyExistingItem = shoppingItems.filter((item) => { return item.name === name })
        if (alreadyExistingItem.length > 0){
            setError("This item is already part of the shopping")
            return
        }
        axios.post(container.routing.addOrUpdateProductAssignment(shopping.id), {
            productName: name,
            quantity: quantity,
            unitPrice: unitPrice
        },
        { headers: {
            Authorization: sessionService.getUserToken()
        }}).then((res) => {
            const id = res.data.productId
            const newItem = {
                id: id,
                name: name,
                quantity: quantity,
                unitPrice: unitPrice
            }
            onItemAdded(newItem)

            endAddingNewItem()
        }).catch((err) => {
            setError("Couldn't add new item")
        })
    }

    const endAddingNewItem = () => {
        setNewItemCreateOn(false)
        setNewItemName(null)
        setNewItemQuantity(null)
        setNewItemUnitPrice(null)
        setError(null)
    }

    return (
        <table className={cs.shoppingProductAssignmentsTable}>
            <thead>
                <tr className={cs.tableTitle}>
                    <th colSpan={4}>
                        <h1>Shopping items</h1>
                    </th>
                </tr>
                <tr className={cs.tableTitle}>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Unit price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {shoppingItems.map((product, key) => {
                    return (
                        <tr key={key}>
                            <td>{product.name}</td>
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
                {newItemCreateOn && (
                    <tr className={cs.newItemInputRow}>
                        <td>
                            <input type="text" placeholder="Name" onChange={(e) => { 
                                setNewItemName(e.target.value || null) 
                            }}/>
                        </td>
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
                )}
                
                <tr className={cs.addButtonRow}>
                    <td colSpan={4}>
                        {!newItemCreateOn ? 
                            <button className={cs.circularButtonAdd} onClick={ () => { setNewItemCreateOn(true) } }>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        :
                            <div className={cs.verticalButtonContainer}>

                                {error && (
                                    <span>{error}</span>
                                )}

                                <div className={cs.horizontalButtonContainer}>
                                    <button className={cs.circularButtonConfirm} 
                                        style={ 
                                            newItemValid ? { backgroundColor: 'var(--secondary)' } : { backgroundColor: 'var(--disabled)', boxShadow: 'none', cursor: 'default', opacity: 100 }
                                        }
                                        onClick={(e) => {
                                            if (newItemValid) {
                                                addNewShoppingItem(newItemName, newItemQuantity, newItemUnitPrice)
                                            }
                                        }}
                                        >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>

                                    <button className={cs.circularButtonCancel} onClick={ (e) => { endAddingNewItem() } }>
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>
                            </div>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}


export default ShoppingItemsList