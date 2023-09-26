import cs from "./NewShoppingModal.module.css"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { BaseModal } from "../../../../components/modals/base_modal/BaseModal"
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { IShoppingPost } from "../../../../data/models/domain"
import { IShoppingsRepository } from "../../../../data/stbApi"

/**
 * @param onDismiss Specifies what happens when adding new shopping is cancelled or when the modal is dismissed
 * @param onShoppingAdded Gets triggered when user successfully adds a new shopping
 */
export interface NewShoppingModalProps {
    isShown: boolean
    shoppingsRepository: IShoppingsRepository
    onDismiss: () => void
    onShoppingAdded: () => void
}

export const NewShoppingModal = ({ isShown, onDismiss, onShoppingAdded, shoppingsRepository }: NewShoppingModalProps) => {
    const [newShopping, setNewShopping] = useState<IShoppingPost>({ name: "", description: "", dueDateTime: null })
    const [error, setError] = useState<string | null>("");

    const postNewShopping = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        setError(null)
        if (!checkNewShoppingValid()) {
            setError("New shopping must have a valid name")
            return
        }
        const success = await shoppingsRepository.postShopping(newShopping)

        if (success) {
            onShoppingAdded()
            onDismiss()
        } else {
            setError("Adding new shopping failed")
        }
    }

    const checkNewShoppingValid = () => {
        return newShopping.name.length > 0
    }

    return (

        <BaseModal isShown={isShown} onDismiss={onDismiss}>
            <h1>Create new shopping</h1>
            <form>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" placeholder="Name" onChange={
                        (e) => { setNewShopping({ ...newShopping, name: e.target.value }) }
                    } />
                </div>

                <div>
                    <label>Due</label>
                    <input type="date" name="date" onChange={
                        (e) => { setNewShopping({ ...newShopping, dueDateTime: e.target.value }) }
                    } />
                </div>

                <div>
                    <label>Description</label>
                    <textarea rows={10} cols={50} name="description" placeholder="Description" onChange={
                        (e) => { setNewShopping({ ...newShopping, description: e.target.value }) }
                    } />
                </div>

                <div className={cs.error}>
                    <span>{error}</span>
                </div>

                <div>
                    <button type="submit" className={cs.submitButton} onClick={(e) => {
                        postNewShopping(e)
                    }}>
                        <FontAwesomeIcon icon={faPlus} />
                        Add
                    </button>
                </div>
            </form>
        </BaseModal>
    )
}