import cs from './ShoppingItemsList.module.css'
import { useState, useEffect } from 'react'

import { ShoppingItemRow } from '../shopping_item_row/ShoppingItemRow'
import { AddShoppingItemRow } from '../add_shopping_item_row/AddShoppingItemRow'
import { ISessionService } from '../../../../services/sessionService'
import { IProductAssignmentsRepository, IPurchasesRepository } from '../../../../data/stbApi'
import { IProductAssignment, IPurchaseOfProduct, IShopping, IUser } from '../../../../data/models/domain'
import { PurchaseItemModal } from '../purchase_item_modal/PurchaseItemModal'

export type UserPurchaseIntent = {
    productAssignment: IProductAssignment
    existingProductPurchase: IPurchaseOfProduct | null
}

export interface ShoppingItemsListProps {
    sessionService: ISessionService
    productAssignmentsRepository: IProductAssignmentsRepository
    purchasesRepository: IPurchasesRepository
    shopping: IShopping
    shoppingParticipants: IUser[]
}

export const ShoppingItemsList = ({ sessionService, productAssignmentsRepository, purchasesRepository, shopping, shoppingParticipants }: ShoppingItemsListProps) => {
    const [assignedProducts, setAssignedProducts] = useState<IProductAssignment[] | null>(null)
    const [productPurchases, setProductPurchases] = useState<IPurchaseOfProduct[] | null>(null)

    const [userPurchaseIntent, setUserPurchaseIntent] = useState<UserPurchaseIntent | null>(null)

    useEffect(() => {
        fetchAssignedProducts()
        fetchPurchasesOfProducts()
    }, [shopping])

    useEffect(() => {
        fetchPurchasesOfProducts()
    }, [shoppingParticipants])

    const fetchAssignedProducts = (): void => {
        productAssignmentsRepository.getProductAssignmentsOfShopping(shopping.id)
            .then((assignments) => {
                setAssignedProducts(assignments)
            }).catch((err) => {
                // TODO
            })
    }

    const fetchPurchasesOfProducts = (): void => {
        purchasesRepository.getPurchasesGroupedByProducts(shopping.id, null).then((purchases) => {
            setProductPurchases(purchases)
        }).catch((err) => {
            // TODO
        })
    }



    return (
        <>
            {userPurchaseIntent != null &&
                <PurchaseItemModal
                    isShown={userPurchaseIntent != null}
                    existingPurchase={userPurchaseIntent.existingProductPurchase}
                    participantsOfShopping={shoppingParticipants}
                    productAssignment={userPurchaseIntent.productAssignment}
                    purchasesRepository={purchasesRepository}
                    sessionService={sessionService}
                    shopping={shopping}
                    onDismiss={() => {
                        setUserPurchaseIntent(null)
                    }}
                    onConfirm={() => {
                        fetchPurchasesOfProducts()
                        setUserPurchaseIntent(null)
                    }}
                />
            }
            <table className={cs.shoppingProductAssignmentsTable}>
                <thead>
                    <tr className={cs.tableTitle}>
                        <th colSpan={5}>
                            <h1>Shopping list</h1>
                        </th>
                    </tr>
                    <tr className={cs.tableTitle}>
                        <th>Product</th>
                        <th>Purchased Qty</th>
                        <th>Unit price</th>
                        <th>Purchased $</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {assignedProducts !== null && productPurchases !== null && (
                    <tbody>
                        {assignedProducts.map((product, key) => {
                            const purchased = productPurchases.filter((item) => {
                                return item.productId == product.id
                            })[0]

                            return (
                                <ShoppingItemRow
                                    key={key}
                                    productAssignmentRepository={productAssignmentsRepository}
                                    product={product}
                                    purchaseOfProduct={purchased}
                                    shopping={shopping}
                                    onProductUpdated={(newProduct) => {
                                        const newProductAssignments = [...assignedProducts]
                                        newProductAssignments[key] = newProduct
                                        setAssignedProducts(newProductAssignments)
                                    }}
                                    onProductDeleted={() => {
                                        const start = assignedProducts.slice(0, key)
                                        const end = assignedProducts.slice(key + 1, assignedProducts.length)
                                        setAssignedProducts([...start, ...end])
                                    }}
                                    onPurchaseUpdated={() => {
                                        fetchPurchasesOfProducts()
                                    }}
                                    onPurchaseInitiated={(product, purchase) => {
                                        const newIntent: UserPurchaseIntent = { productAssignment: product, existingProductPurchase: purchase }
                                        setUserPurchaseIntent(newIntent)
                                    }}
                                />
                            )
                        })}

                        <AddShoppingItemRow sessionService={sessionService} productAssignmentsRepository={productAssignmentsRepository}
                            shopping={shopping} productAssignments={assignedProducts} onProductAssignmentAdded={(newItem) => {
                                setAssignedProducts([...assignedProducts, newItem])
                            }} />

                    </tbody>
                )}
            </table>
        </>
    )
}