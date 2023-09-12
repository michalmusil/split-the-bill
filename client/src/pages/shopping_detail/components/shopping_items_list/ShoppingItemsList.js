import cs from './ShoppingItemsList.module.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import container from '../../../../utils/AppContainer'

import AddShoppingItemRow from '../add_shopping_item_row/AddShoppingItemRow'

const ShoppingItemsList = ({ sessionService, shopping }) => {
    const [shoppingItems, setShoppingItems] = useState(null)
    const [productPurchases, setProductPurchases] = useState(null)
    
    useEffect(() => {
        fetchShoppingItems(shopping.id)
        fetchProductPurchases(shopping.id)
    }, [])

    

    const fetchShoppingItems = (shoppingId) => {
        axios.get(container.routing.getProductAssignmentsByShoppingId(shoppingId), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            setShoppingItems(res.data)
        }).catch((err) => {
            // TODO
        })
    }

    const fetchProductPurchases = (shoppingId) => {
        axios.get(container.routing.getPurchasesOfProducts(shoppingId, null), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            setProductPurchases(res.data)
        }).catch((err) => {
            // TODO
        })
    }

    

    return (
        <table className={cs.shoppingProductAssignmentsTable}>
            <thead>
                <tr className={cs.tableTitle}>
                    <th colSpan={4}>
                        <h1>Shopping list</h1>
                    </th>
                </tr>
                <tr className={cs.tableTitle}>
                    <th>Product</th>
                    <th>Quantity purchased / remaining</th>
                    <th>Unit price</th>
                    <th>Ammount purchased / remaining</th>
                </tr>
            </thead>
            {shoppingItems !== null && productPurchases !== null && (
                <tbody>
                {shoppingItems.map((product, key) => {
                    const purchased = productPurchases.filter((item) => {
                        return item.productId === product.id
                    })[0]

                    return (
                        <tr key={key}>
                            <td>{product.name}</td>
                            <td>{`${purchased?.quantityPurchased || "-"} / ${product.quantity || "-"}`}</td>
                            <td>{product.unitPrice ? `${product.unitPrice},-` : "-"}</td>
                            <td>{`${purchased?.ammountPurchased || "-"} / ${product.unitPrice && product.quantity ? product.unitPrice * product.quantity + ",-" : "-"}`}</td>
                        </tr>
                    )
                })}
                
                <AddShoppingItemRow sessionService={sessionService} shopping={shopping} shoppingItems={shoppingItems} onShoppingItemAdded={(newItem) => {
                    setShoppingItems([...shoppingItems, newItem])
                }} />

            </tbody>
            )}
        </table>
    )
}


export default ShoppingItemsList