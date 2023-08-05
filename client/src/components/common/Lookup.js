import cs from './Lookup.module.css'
import { useState, useEffect } from 'react'

let requestTimer = null

const Lookup = ({ fetchData, getItemStringRepresentation, onItemSelected, placeholder="search", resultsDelayMillis=500 }) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])

    const sendNewRequest = (searchQuery) => {
        clearTimeout(requestTimer)
        console.log(searchQuery)
        if(searchQuery.length < 1){
            setResults([])
            return
        }
    
        requestTimer = setTimeout(() => {
            fetchData(searchQuery).then((data) => {
                setResults(data)
            }).catch((err) => {
                //TODO
            })
        }, resultsDelayMillis)
    }

    return (
        <div className={cs.lookupContainer}>
            <input className={cs.lookupInput} type="text" placeholder={placeholder} value={query} onChange={(e) => {
                setQuery(e.target.value)
                sendNewRequest(e.target.value)
            }}/>
            <ul className={cs.lookupResults}>
                {
                    results.map((item, key) => {
                        const valueToDisplay = getItemStringRepresentation(item)
                        if (valueToDisplay){
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

export default Lookup