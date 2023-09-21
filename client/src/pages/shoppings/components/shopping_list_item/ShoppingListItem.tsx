import { IShopping } from "../../../../data/models/domain"
import cs from "./ShoppingListItem.module.css"
import { useEffect, useState } from "react"

export interface ShoppingListItemProps{
    shopping: IShopping
    onClick: (shopping: IShopping) => void
}

export const ShoppingListItem = ({ shopping, onClick }: ShoppingListItemProps) => {
    const [dateTimeFormatted, setDateTimeFormatted] = useState<Date|null>(null)

    useEffect(() => {
        if (shopping.dueDateTime){
            const date = new Date(shopping.dueDateTime)
            setDateTimeFormatted(date)
        }
    }, [shopping])

    return (
        <div className={cs.shoppingListItem} onClick = {(e) => { onClick(shopping) }}>
            <div>
                <h2>{shopping.name}</h2>
                <p>{shopping.description || "No description"}</p>
            </div>
            <div>
                <table>
                    <tbody>
                        {dateTimeFormatted ?
                            <tr>
                            <td>Deadline:</td>    
                            <td>{dateTimeFormatted.toLocaleDateString() || ""}</td>    
                            </tr>
                        :
                            ""
                        }
                        <tr>
                            <td>Participants:</td>    
                            <td>{shopping.numberOfParticipants || 0}</td>    
                        </tr>
                        <tr>
                            <td>Shopping items:</td>
                            <td>{shopping.numberOfItems || 0}</td>
                        </tr>
                        <tr>
                            <td>Total:</td>    
                            <td>{shopping.totalCost || 0},-</td>    
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}