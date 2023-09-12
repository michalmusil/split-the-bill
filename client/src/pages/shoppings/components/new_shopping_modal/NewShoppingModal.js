import cs from "./NewShoppingModal.module.css"
import axios from "axios"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import container from '../../../../utils/AppContainer'

import { faPlus } from '@fortawesome/free-solid-svg-icons'

const NewShoppingModal = ({ onDismiss, onShoppingAdded, sessionService }) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState(null)
    const [error, setError] = useState("");

    const postNewShopping = (event, name, description, dueDate) => {
        event.preventDefault()
        setError(null)
        if (!checkNewShoppingValid(name, description, dueDate)) {
            setError("New shopping must have a valid name")
            return
        }
        
        axios.post(container.routing.postNewShopping, {
            name: name,
            description: description,
            dueDateTime: dueDate
        }, {
            headers: { Authorization: sessionService.getUserToken() }
        }).then((res) => {
            onShoppingAdded()
            onDismiss()
        }).catch((err) => {
            setError("Adding new shopping failed")
        })
    }

    const checkNewShoppingValid = (name, description, dueDate) => {
        return name ? true : false
    }

    return (
        <div className="modal">
            <div className="modalOverlay" onClick={(e) => { onDismiss() }} />
            <div className="modalContent">
                <h1>Create new shopping</h1>
                <form>
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" placeholder="Name" onChange={(e) => { setName(e.target.value) }}/>
                    </div>

                    <div>
                        <label>Due</label>
                        <input type="date" name="date" onChange={(e) => { setDueDate(e.target.value) }}/>
                    </div>
                    
                    <div>
                        <label>Description</label>
                        <textarea rows="10" cols="50" name="description" placeholder="Description" onChange={(e) => { setDescription(e.target.value) }} />
                    </div>

                    <div className={cs.error}>
                        <span>{error}</span>
                    </div>

                    <div>
                        <button type="submit" className={cs.submitButton} onClick={(e) => { 
                            postNewShopping(e, name, description, dueDate)
                         }}>
                            <FontAwesomeIcon icon={faPlus} />
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewShoppingModal