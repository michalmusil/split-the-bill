import cs from "./Shoppings.module.css"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ShoppingListItem } from './components/shopping_list_item/ShoppingListItem'
import { NewShoppingModal } from './components/new_shopping_modal/NewShoppingModal'
import { TextSearch } from '../../components/ui/text_search/TextSearch'
import { ISessionService } from "../../services/sessionService"
import { IShopping } from "../../data/models/domain"
import { IShoppingsRepository } from "../../data/stbApi"


export interface ShoppingPageProps {
    sessionService: ISessionService
    shoppingsRepository: IShoppingsRepository
}

export const ShoppingsPage = ({ sessionService, shoppingsRepository }: ShoppingPageProps) => {
    const [shoppings, setShoppings] = useState<IShopping[]>([])
    const [showNewForm, setShowNewForm] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchShoppings()
    }, [])

    const onItemClick = (shopping: IShopping): void => {
        navigate(`/shoppings/${shopping.id}`)
    }

    const fetchShoppings = (searchQuery: string | null = null): void => {
        shoppingsRepository.getAllShoppings(searchQuery)
            .then((shoppings) => {
                setShoppings(shoppings)
            }).catch((err) => {
                // TODO
            })
    }

    return (
        <section className={cs.shoppingPageContent}>

            {showNewForm && (
                <NewShoppingModal
                    shoppingsRepository={shoppingsRepository}
                    onDismiss={() => { setShowNewForm(false) }}
                    onShoppingAdded={() => { fetchShoppings() }}
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
                        }} />
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
                        return <ShoppingListItem key={key} shopping={shopping} onClick={(e) => {
                            onItemClick(shopping)
                        }} />
                    })
                }
            </div>

        </section>
    )
}