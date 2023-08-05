import cs from './TextSearch.module.css'
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'

const TextSearch = ({ placeholder="Search", onSearchConfirmed, onSearchCancel }) => {
    const [searchPhrase, setSearchPhrase] = useState("")
    const [searchWasConfirmed, setSearchWasConfirmed] = useState(false)

    const attemptSearch = () => {
        if(searchPhrase && searchPhrase.length > 0){
            onSearchConfirmed(searchPhrase)
            setSearchWasConfirmed(true)
        }
    }

    const cancelSearch = () => {
        setSearchPhrase("")
        setSearchWasConfirmed(false)
        onSearchCancel()
    }

    return (
        <div className={cs.searchContainer}>
            {searchWasConfirmed && (
                <button className={cs.cancelSearchButton} onClick={(e) => {
                    cancelSearch()
                }}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            )}
            
            <input className={cs.searchInput} type="text" value={searchPhrase} placeholder={placeholder} 
            onChange={(e) => {
                setSearchPhrase(e.target.value)
            }}
            onKeyDown={(e) => {
                if(e.key === 'Enter'){
                    attemptSearch()
                }
            }}/>

            <button className={cs.searchButton} onClick={(e) => {
                attemptSearch()
            }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    )
}

export default TextSearch