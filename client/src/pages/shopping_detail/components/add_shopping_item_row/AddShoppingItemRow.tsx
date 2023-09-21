import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cs from './AddShoppingItemRow.module.css'

import { faXmark,faPlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import { ISessionService } from '../../../../services/sessionService'
import { IProductAssignmentsRepository } from '../../../../data/stbApi'
import { IPostProductAssignment, IProductAssignment, IShopping } from '../../../../data/models/domain'

export interface AddShoppingItemRowProps{
    sessionService: ISessionService
    productAssignmentsRepository: IProductAssignmentsRepository
    shopping: IShopping
    productAssignments: IProductAssignment[]
    onProductAssignmentAdded: (newAssignment: IProductAssignment) => void
}

export const AddShoppingItemRow = ({ sessionService, productAssignmentsRepository, shopping, productAssignments, onProductAssignmentAdded}: AddShoppingItemRowProps) => {

    const [newItemCreateOn, setNewItemCreateOn] = useState(false)
    const [newAssignmentValid, setNewItemValid] = useState(false)
    // Attributes of new shopping item to create
    const [newAssignmentName, setNewItemName] = useState<string | null>(null)
    const [newAssignmentQuantity, setNewItemQuantity] = useState<number | null>(null)
    const [newAssignmentUnitPrice, setNewItemUnitPrice] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const valid: boolean = newAssignmentName != null && newAssignmentQuantity != null && Number.isInteger(newAssignmentQuantity) && newAssignmentQuantity > 0
        setNewItemValid(valid)
    }, [newAssignmentName, newAssignmentQuantity, newAssignmentUnitPrice])

    const postNewProductAssignment = async (): Promise<void> => {
        if(!newAssignmentValid){
            setError("The new item is not valid")
            return
        }
        const alreadyExistingItem = productAssignments.filter((item) => { return item.name == newAssignmentName })
        if (alreadyExistingItem.length > 0){
            setError("This item is already part of the shopping")
            return
        }
        
        const post: IPostProductAssignment = {
            productName: newAssignmentName!,
            description: null,
            quantity: newAssignmentQuantity!,
            unitPrice: newAssignmentUnitPrice
        }

        try{
            const addedAssignment = await productAssignmentsRepository.assignProductToShopping(shopping.id, post)
            onProductAssignmentAdded(addedAssignment)
            endAddingNewAssignment()
        } catch(err){
            setError("Couldn't add new item")
        }
    }

    const endAddingNewAssignment = (): void => {
        setNewItemCreateOn(false)
        setNewItemName(null)
        setNewItemQuantity(null)
        setNewItemUnitPrice(null)
        setError(null)
    }


    return (
        <>
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
                        {newAssignmentQuantity && newAssignmentUnitPrice ? 
                            `${newAssignmentQuantity * newAssignmentUnitPrice},-`
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
                                        newAssignmentValid ? { backgroundColor: 'var(--secondary)' } : { backgroundColor: 'var(--disabled)', boxShadow: 'none', cursor: 'default', opacity: 100 }
                                    }
                                    onClick={(e) => {
                                        if (newAssignmentValid) {
                                            postNewProductAssignment()
                                        }
                                    }}
                                    >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>

                                <button className={cs.circularButtonCancel} onClick={ (e) => { endAddingNewAssignment() } }>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        </div>
                    }
                </td>
            </tr>
        </>
    )
}