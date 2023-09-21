import cs from './Lookup.module.css'
import { useState, useEffect } from 'react'

// Serves for debouncing the searching in the lookup based on the resultsDebounceMillis interval,
// so that fetch request doesn't get triggered each time user types a letter
let requestTimer: NodeJS.Timeout | null = null

/**
 * @param fetchData A request for fetching data based on the search string input by the user
 * @param getDataStringRepresentation Gets the string representation of the data returned by fetchData() - for displaying the items in the lookup
 * @param onItemSelected  Defines what happens when user clicks on one of the lookup results
 * @param placeholder Specifies what is displayed in the lookup when user hasn't input anything
 * @param resultsDebounceMillis Defines an interval from user typing a letter to fetch request being fired, 
 * if user types in another letter before the interval is over, fetch request for the new search string is triggered and the previous one is cancelled
 */
export type LookupProps<T> = {
    fetchData: (query: string) => Promise<T[]>
    getDataStringRepresentation: (data: T) => string
    onItemSelected: (item: T) => void
    placeholder?: string
    resultsDebounceMillis?: number
}

export function Lookup<T>({ fetchData, getDataStringRepresentation, onItemSelected, placeholder = "search", resultsDebounceMillis = 500 }: LookupProps<T>) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<T[]>([])

    const sendNewRequest = (searchQuery: string) => {
        // If previous request is still schedulled (based on resultsDebounceMillis), it is cancelled
        if (requestTimer != null) {
            clearTimeout(requestTimer)
        }
        // If the searchquery is empty, results are empty by default
        if (searchQuery.length < 1) {
            setResults([])
            return
        }
        // Schedules a new fetch request
        requestTimer = setTimeout(() => {
            fetchData(searchQuery).then((data) => {
                setResults(data)
            }).catch((err) => {
                console.log(err)
            })
        }, resultsDebounceMillis)
    }

    return (
        <div className={cs.lookupContainer}>
            <input className={cs.lookupInput} type="text" placeholder={placeholder} value={query} onChange={(e) => {
                setQuery(e.target.value)
                sendNewRequest(e.target.value)
            }} />
            <ul className={cs.lookupResults}>
                {
                    results.map((item, key) => {
                        const valueToDisplay = getDataStringRepresentation(item)
                        if (valueToDisplay) {
                            return (
                                <li key={key} className={cs.lookupItem} onClick={(e) => {
                                    onItemSelected(item)
                                    setQuery("")
                                    setResults([])
                                }}>
                                    {valueToDisplay}
                                </li>
                            )
                        }
                    })
                }
            </ul>
        </div>
    )
}