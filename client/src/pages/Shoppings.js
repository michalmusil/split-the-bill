import axios from 'axios'
import { useEffect, useState } from 'react'
import container from '../utils/AppContainer'
import { useNavigate } from 'react-router-dom'

import ShoppingListItem from '../components/shoppings/ShoppingListItem'

const ShoppingsPage = ({ sessionService }) => {
    const [shoppings, setShoppings] = useState([])
    const navigate = useNavigate()
    const authToken = sessionService.getUserToken()

    useEffect(() => {
        axios.get(container.routing.getAllShoppings, { 
            headers: { Authorization: authToken } 
        }).then((res) => {
            setShoppings(res.data)
        }).catch((err) => {
            // TODO
        })
    }, [])

    const onItemClick = (shopping) => {
        navigate(`/shoppings/${shopping.id}`)
    }

    return (
        <section className='shoppingPageContent'>
            <div className='pageHeader'>
                <h1 className='pageTitle'>Your shoppings</h1>
            </div>
            
            <div className='shoppingsList'>
                {shoppings.map((shopping, key) => {
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