import cs from "./ShoppingItemRow.module.css"
import { useEffect, useRef, useState } from "react"
import { IPostProductAssignment, IProductAssignment, IPurchaseOfProduct, IShopping } from "../../../../data/models/domain"
import { ShoppingItemRowState } from './ShoppingItemRowState'
import { IProductAssignmentsRepository } from "../../../../data/stbApi"
import { useOnClickOutside } from "../../../../hooks"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPencil, faCheck, faCartShopping, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ConfirmationModal } from "../../../../components/modals/confirmation/ConfirmationModal"

export interface ShoppingItemRowProps {
    itemKey: number
    productAssignmentRepository: IProductAssignmentsRepository
    shopping: IShopping
    product: IProductAssignment
    purchaseOfProduct: IPurchaseOfProduct | null
    onProductUpdated: (updatedProduct: IProductAssignment) => void
    onProductDeleted: () => void
}

const quantityInputId = "quantityInput"
const unitPriceInputId = "unitPriceInput"

export const ShoppingItemRow = ({ itemKey, productAssignmentRepository, shopping, product, purchaseOfProduct, onProductUpdated, onProductDeleted }: ShoppingItemRowProps) => {
    const [rowState, setRowState] = useState<ShoppingItemRowState>(ShoppingItemRowState.IDLE)
    const [editableQuantity, setEditableQuantity] = useState<number>(product.quantity)
    const [editableUnitPrice, setEditableUnitPrice] = useState<number | null>(product.unitPrice)
    const [showDeleteItemModal, setShowDeleteItemModal] = useState(false)

    const quantityInputRef = useRef(null)
    const unitPriceInputRef = useRef(null)

    useEffect(() => {
        switch (rowState) {
            case ShoppingItemRowState.QUANTITY_EDIT: {
                document.getElementById(quantityInputId)?.focus()
                break
            }
            case ShoppingItemRowState.UNIT_PRICE_EDIT: {
                document.getElementById(unitPriceInputId)?.focus()
                break
            }
        }
        setEditableFields()
    }, [rowState])

    useEffect(() => {
        setEditableFields()
    }, [product])

    useOnClickOutside(quantityInputRef, () => {
        if (rowState == ShoppingItemRowState.QUANTITY_EDIT) {
            setRowState(ShoppingItemRowState.IDLE)
            setEditableFields()
        }
    }, [rowState])

    useOnClickOutside(unitPriceInputRef, () => {
        if (rowState == ShoppingItemRowState.UNIT_PRICE_EDIT) {
            setRowState(ShoppingItemRowState.IDLE)
            setEditableFields()
        }
    }, [rowState])

    const updateProductAssignmentQuantity = (newQuantity: number): void => {
        let newValue = newQuantity
        if (purchaseOfProduct != null) {
            newValue = newValue < purchaseOfProduct.quantityPurchased ? purchaseOfProduct.quantityPurchased : newValue
        }
        const post: IPostProductAssignment = {
            productName: product.name,
            description: product.description,
            quantity: newValue,
            unitPrice: product.unitPrice
        }
        productAssignmentRepository.updateProductAssignment(shopping.id, post)
            .then((updatedAssignment) => {
                onProductUpdated(updatedAssignment)
                //product.quantity = updatedAssignment.quantity
                //setEditableFields()
            })
            .catch((err) => {
                setEditableQuantity(product.quantity)
                // TODO
            })
    }

    const deleteProductAssignment = () => {
        productAssignmentRepository.unassignProductFromShopping(shopping.id, product.name)
            .then(() => {
                onProductDeleted()
            })
            .catch((err) => {
                // TODO
            })
    }

    const updateProductAssignmentUnitPrice = (newUnitPrice: number | null): void => {
        const post: IPostProductAssignment = {
            productName: product.name,
            description: product.description,
            quantity: product.quantity,
            unitPrice: newUnitPrice
        }
        productAssignmentRepository.updateProductAssignment(shopping.id, post)
            .then((updatedAssignment) => {
                onProductUpdated(updatedAssignment)
                // product.unitPrice = updatedAssignment.unitPrice
                // setEditableFields()
            })
            .catch((err) => {
                setEditableUnitPrice(product.unitPrice)
                // TODO
            })
    }

    const setEditableFields = (): void => {
        setEditableQuantity(product.quantity)
        setEditableUnitPrice(product.unitPrice)
    }

    return <>
        <ConfirmationModal
            isShown={showDeleteItemModal}
            title="Are you sure you want to delete this item?"
            body="All purchases of this item will be cancelled."
            onConfirm={() => {
                deleteProductAssignment()
            }}
            onDismiss={() => {
                setShowDeleteItemModal(false)
            }} />
        <tr className={cs.shoppingItemRow} key={itemKey}>
            <td>{product.name}</td>

            <td>
                {rowState == ShoppingItemRowState.QUANTITY_EDIT ?
                    <div className={cs.cellInput} ref={quantityInputRef}>
                        <FontAwesomeIcon icon={faPencil} />
                        <input id={quantityInputId} type="number" placeholder="Quantity" value={editableQuantity}
                            onChange={(e) => {
                                let newValue = e.target.valueAsNumber
                                setEditableQuantity(newValue)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateProductAssignmentQuantity(editableQuantity)
                                    setRowState(ShoppingItemRowState.IDLE)
                                }
                            }} />
                        <FontAwesomeIcon
                            className={cs.confirmIcon}
                            icon={faCheck}
                            onClick={(e) => {
                                setRowState(ShoppingItemRowState.IDLE)
                                updateProductAssignmentQuantity(editableQuantity)
                            }} />
                    </div>
                    :
                    <div className={cs.editableCell} onClick={(e) => {
                        setRowState(ShoppingItemRowState.QUANTITY_EDIT)
                    }}>
                        {purchaseOfProduct?.quantityPurchased || "-"} / {editableQuantity || "-"}
                        <FontAwesomeIcon className={cs.disapearEditIcon} icon={faPencil} />
                    </div>
                }
            </td>

            <td>
                {rowState == ShoppingItemRowState.UNIT_PRICE_EDIT ?
                    <div className={cs.cellInput} ref={unitPriceInputRef}>
                        <FontAwesomeIcon icon={faPencil} />
                        <input id={unitPriceInputId} type="number" placeholder="Unit price" value={editableUnitPrice ?? ""}
                            onChange={(e) => {
                                let newValue = e.target.valueAsNumber
                                if (newValue < 0) {
                                    newValue = 0
                                }
                                setEditableUnitPrice(newValue)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateProductAssignmentUnitPrice(editableUnitPrice)
                                    setRowState(ShoppingItemRowState.IDLE)
                                }
                            }} />
                        <FontAwesomeIcon
                            className={cs.confirmIcon}
                            icon={faCheck}
                            onClick={(e) => {
                                setRowState(ShoppingItemRowState.IDLE)
                                updateProductAssignmentUnitPrice(editableUnitPrice)
                            }}
                        />
                    </div>
                    :
                    <div className={cs.editableCell} onClick={(e) => {
                        setRowState(ShoppingItemRowState.UNIT_PRICE_EDIT)
                    }}>
                        {editableUnitPrice ? `${editableUnitPrice},-` : "-"}
                        <FontAwesomeIcon className={cs.disapearEditIcon} icon={faPencil} />
                    </div>
                }
            </td>

            <td>{`${purchaseOfProduct?.ammountPurchased || "-"} / ${editableUnitPrice && editableQuantity ? editableUnitPrice * editableQuantity + ",-" : "-"}`}</td>

            <td>
                <div className={`${cs.actionIcon} ${cs.purchaseIcon}`}>
                    <FontAwesomeIcon icon={faCartShopping} />
                </div>
                <div className={`${cs.actionIcon} ${cs.deleteIcon}`}
                    onClick={(e) => {
                        setShowDeleteItemModal(true)
                    }}>
                    <FontAwesomeIcon icon={faTrash} />
                </div>
            </td>
        </tr>
    </>
}