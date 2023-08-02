import { useEffect, useState } from "react"

const ShoppingListItem = ({ shopping, onClick }) => {
    const [dateTimeFormatted, setDateTimeFormatted] = useState(null)

    useEffect(() => {
        if (shopping.dueDateTime){
            const date = new Date(shopping.dueDateTime)
            setDateTimeFormatted(date.toLocaleDateString())
        }
    }, [shopping])

    return (
        <div className="shoppingListItem" onClick = {(e) => { onClick(e) }}>
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
                            <td>{dateTimeFormatted || ""}</td>    
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
                        <hr/>
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

export default ShoppingListItem