import cs from "./ShoppingDetail.module.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import container from '../utils/AppContainer'

const ShoppingDetail = ({ sessionService }) => {
    const { id } = useParams()

    const [shopping, setShopping] = useState(null)

    useEffect(() => {
        axios.get(container.routing.getShoppingById(id), { 
            headers: {
                Authorization: sessionService.getUserToken()
            }
        }).then((res) => {
            setShopping(res.shopping)
        }).catch((err) => {
            // TODO
        })
    }, [])

    return (
        <h1>{id}</h1>
    )
}

export default ShoppingDetail