import cs from './TextSearch.module.css'
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'

/**
 * @param placeholder A string that is displayed when no text input has been given by the user
 * @param onSearchConfirmed Function that gets triggered by user clicking search button or pressing enter when input has been given
 * @param onSearchCancel After a search has been triggered, cancel button appears in the field, after clicking, the effects of the search should be cancelled
 */
export type TextSearchProps = {
    placeholder?: string
    onSearchConfirmed: (searchPhrase: string) => void
    onSearchCancel: () => void
}

/**
 * A general string search field.
 */
export const TextSearch = ({ placeholder="Search", onSearchConfirmed, onSearchCancel }: TextSearchProps) => {
    const [searchPhrase, setSearchPhrase] = useState("")
    const [searchWasConfirmed, setSearchWasConfirmed] = useState(false)

    const attemptSearch = (): void => {
        if(searchPhrase && searchPhrase.length > 0){
            onSearchConfirmed(searchPhrase)
            setSearchWasConfirmed(true)
        }
    }

    const cancelSearch = (): void => {
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