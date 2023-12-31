import cs from './ShoppingItemsList.module.css'
import { useState, useEffect } from 'react'

import { AddShoppingItemRow } from '../add_shopping_item_row/AddShoppingItemRow'
import { ISessionService } from '../../../../services/sessionService'
import { IProductAssignmentsRepository, IPurchasesRepository } from '../../../../data/stbApi'
import { IProductAssignment, IPurchaseOfProduct, IShopping } from '../../../../data/models/domain'

export interface ShoppingItemsListProps {
    sessionService: ISessionService
    productAssignmentsRepository: IProductAssignmentsRepository
    purchasesRepository: IPurchasesRepository
    shopping: IShopping
}

export const ShoppingItemsList = ({ sessionService, productAssignmentsRepository, purchasesRepository, shopping }: ShoppingItemsListProps) => {
    const [assignedProducts, setAssignedProducts] = useState<IProductAssignment[] | null>(null)
    const [productPurchases, setProductPurchases] = useState<IPurchaseOfProduct[] | null>(null)

    useEffect(() => {
        fetchAssignedProducts(shopping.id)
        fetchPurchasesOfProducts(shopping.id)
    }, [shopping])



    const fetchAssignedProducts = (shoppingId: number): void => {
        productAssignmentsRepository.getProductAssignmentsOfShopping(shoppingId)
            .then((assignments) => {
                setAssignedProducts(assignments)
            }).catch((err) => {
                // TODO
            })
    }

    const fetchPurchasesOfProducts = (shoppingId: number): void => {
        purchasesRepository.getPurchasesGroupedByProducts(shoppingId, null).then((purchases) => {
            setProductPurchases(purchases)
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
            {assignedProducts !== null && productPurchases !== null && (
                <tbody>
                    {assignedProducts.map((product, key) => {
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

                    <AddShoppingItemRow sessionService={sessionService} productAssignmentsRepository={productAssignmentsRepository}
                        shopping={shopping} productAssignments={assignedProducts} onProductAssignmentAdded={(newItem) => {
                            setAssignedProducts([...assignedProducts, newItem])
                        }} />

                </tbody>
            )}
        </table>
    )
}