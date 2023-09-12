import cs from "./Shoppings.module.css"
import axios from 'axios'
import { useEffect, useState } from 'react'
import container from '../../utils/AppContainer'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ShoppingListItem from './components/shopping_list_item/ShoppingListItem'
import NewShoppingModal from './components/new_shopping_modal/NewShoppingModal'
import TextSearch from '../../components/ui/text_search/TextSearch'

const ShoppingsPage = ({ sessionService }) => {
    const [shoppings, setShoppings] = useState([])
    const [showNewForm, setShowNewForm] = useState(false)

    const navigate = useNavigate()
    const authToken = sessionService.getUserToken()

    useEffect(() => {
        fetchShoppings()
    }, [])

    const onItemClick = (shopping) => {
        navigate(`/shoppings/${shopping.id}`)
    }

    const fetchShoppings = (searchQuery) => {
        axios.get(container.routing.getAllShoppings(searchQuery), { 
            headers: { Authorization: authToken } 
        }).then((res) => {
            setShoppings(res.data)
        }).catch((err) => {
            // TODO
        })
    }

    return (
        <section className={cs.shoppingPageContent}>
            
            {showNewForm && (
                <NewShoppingModal 
                    onDismiss={ () => { setShowNewForm(false) } } 
                    onShoppingAdded={ () => { fetchShoppings() } }
                    sessionService={sessionService}
                />
                )
            }

            <div className='pageHeader'>
                <div className="pageTitleWithActionsContainer">
                    <h1 className='pageTitle'>Your shoppings</h1>

                    <button onClick={(e) => { setShowNewForm(!showNewForm) }}>
                        <FontAwesomeIcon icon={faPlus} />
                        Add new
                    </button>
                </div>
                <div className="filterContainer">
                    <TextSearch 
                    onSearchConfirmed={(phrase) => {
                        fetchShoppings(phrase)
                    }}
                    onSearchCancel={() => {
                        fetchShoppings(null)
                    }}/>
                </div>
            </div>
            
            {shoppings?.length < 1 && (
                <div>
                    <p>No shoppings have been found</p>
                </div>
            )}

            <div className={cs.shoppingsList}>
                {
                    shoppings.map((shopping, key) => {
                        return <ShoppingListItem key={key} shopping={shopping} onClick = {(e) => {
                            onItemClick(shopping)
                        }}/>
                    })
                }
            </div>
            
        </section>
    )
}

export default ShoppingsPage