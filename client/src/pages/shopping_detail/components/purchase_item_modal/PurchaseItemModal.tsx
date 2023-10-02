import cs from "./PurchaseItemModal.module.css"
import { IPostProductPurchase, IProductAssignment, IPurchaseOfProduct, IShopping, IUser, IUserWithPurchase } from "../../../../data/models/domain"
import { IPurchasesRepository } from "../../../../data/stbApi"
import { BaseModal } from "../../../../components/modals/base_modal/BaseModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faCartShopping, faUser, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react"
import { ISessionService } from "../../../../services/sessionService"

export interface PurchaseItemModalProps {
    isShown: boolean
    purchasesRepository: IPurchasesRepository
    sessionService: ISessionService
    productAssignment: IProductAssignment
    shopping: IShopping
    existingPurchase: IPurchaseOfProduct | null
    participantsOfShopping: IUser[]
    onConfirm: () => void
    onDismiss: () => void
}

export const PurchaseItemModal = ({ isShown, productAssignment, purchasesRepository, shopping, sessionService,
    existingPurchase, participantsOfShopping, onConfirm, onDismiss }: PurchaseItemModalProps) => {
    const [userPurchases, setUserPurchases] = useState<IUserWithPurchase[]>([])

    useEffect(() => {
        const newList = existingPurchase?.users ?? []
        const userIsShoppingOwner = sessionService.getUserId() == shopping.creatorId
        const loggedInUserInList = newList.find((element) => { return element.id == sessionService.getUserId() })
        // If user is the shopping owner, all participants of the shopping are supposed to be in the user purchases list (owner can purchase for them)
        if (userIsShoppingOwner) {
            participantsOfShopping.forEach((participant) => {
                const participantInList = newList.find((element) => participant.id == element.id)
                if (!participantInList) {
                    newList.push({
                        id: participant.id,
                        email: participant.email,
                        username: participant.username,
                        purchased: 0
                    })
                }
            })
        }
        // If user is not the owner of the shopping, but isn't already in the list (hasn't made a purchase yet), he needs to be added
        else if (!loggedInUserInList) {
            newList.push({
                id: sessionService.getUserId()!,
                email: sessionService.getUser()!.email,
                username: sessionService.getUser()!.username,
                purchased: 0
            })
        }
        // User purchases are finally updated
        setUserPurchases(newList)
    }, [existingPurchase, productAssignment])

    const getQuantityPurchased = (): number => {
        const quantityPurchased = userPurchases.reduce((prev, curr) => {
            return prev + curr.purchased
        }, 0)
        return quantityPurchased
    }

    const getAmmountPurchased = (): number | null => {
        if (productAssignment.unitPrice == null) {
            return null
        }
        const ammountPurchased = userPurchases.reduce((prev, curr) => {
            return prev + (curr.purchased * productAssignment.unitPrice!)
        }, 0)
        return ammountPurchased
    }

    const getAmmountToBePurchased = (): number | null => {
        if (productAssignment.unitPrice == null) {
            return null
        }
        return productAssignment.unitPrice! * productAssignment.quantity
    }

    const handlePurchaseQuantityUpdate = (user: IUserWithPurchase, quantityChange: number): void => {
        const remainingToBePurchased = getRemainingQuantityToBePurchased()
        const newUserPurchaseQuantity = user.purchased + quantityChange
        // User can't buy less than 0 products and can't buy more, than products remaining
        if (newUserPurchaseQuantity < 0 || quantityChange > remainingToBePurchased) {
            return
        }
        user.purchased = newUserPurchaseQuantity
        setUserPurchases([...userPurchases])
    }

    const getRemainingQuantityToBePurchased = (): number =>{
        return productAssignment.quantity - getQuantityPurchased()
    }

    const updateProductPurchases = async (): Promise<void> => {
        const calls: Promise<void>[] = []
        userPurchases.forEach((purchase) => {
            const post: IPostProductPurchase = {
                shoppingId: shopping.id,
                productId: productAssignment.id,
                userId: purchase.id,
                quantity: purchase.purchased
            }
            calls.push(
                purchasesRepository.purchaseProduct(post)
                    .catch((err) => {
                        // TODO
                    })
            )
        })
        await Promise.all(calls)
    }

    return (
        <BaseModal isShown={isShown} onDismiss={onDismiss}>
            <div className={cs.title}>
                <FontAwesomeIcon icon={faCartShopping} />
                <h1>Purchase</h1>
            </div>
            <div className={cs.body}>
                <table className={cs.shoppingItemInfoTable}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Purchased Qty</th>
                            <th>Unit price</th>
                            <th>Purchased $</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{productAssignment.name}</td>
                            <td>{getQuantityPurchased()}/{productAssignment.quantity}</td>
                            <td>{productAssignment.unitPrice != null ? `${productAssignment.unitPrice},-` : "-"}</td>
                            <td>{getAmmountToBePurchased() != null ? `${getAmmountPurchased() ?? "-"}/${getAmmountToBePurchased()},-` : "-"}</td>
                        </tr>
                    </tbody>
                </table>
                {userPurchases.map((userPurchase, key) => {
                    return (
                        <div key={key} className={cs.userPurchaseListItem}>
                            <FontAwesomeIcon className={cs.userIcon} icon={faUser} />
                            <strong>{userPurchase.username} </strong>
                            <div className={cs.spacer} />

                            <div className={cs.purchasedQuantityContainer}>
                                <div className={cs.purchasedQuantityStepper}>
                                    <button className={cs.purchaseLessButton} onClick={(e) => {
                                        handlePurchaseQuantityUpdate(userPurchase, -1)
                                    }}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>

                                    <span>{userPurchase.purchased}</span>

                                    <button className={cs.purchaseMoreButton} onClick={(e) => {
                                        handlePurchaseQuantityUpdate(userPurchase, 1)
                                    }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>

                                <button className={cs.purchaseRestButton} onClick={(e) => {
                                    handlePurchaseQuantityUpdate(userPurchase, getRemainingQuantityToBePurchased())
                                }}>
                                    <span>
                                        Purchase rest
                                    </span>
                                </button>
                            </div>
                        </div>
                    )
                })}
                <button className={cs.confirmButton} onClick={async (e) => {
                    await updateProductPurchases()
                    onConfirm()
                }}>
                    <span>
                        Confirm
                    </span>
                </button>
            </div>

        </BaseModal>
    )
}