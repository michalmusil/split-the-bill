
const ShoppingListItem = ({ shopping, onClick }) => {
    return (
        <div className="shoppingListItem" onClick = {(e) => { onClick(e) }}>
            <div>
                <h2>{shopping.name}</h2>
                <p>{shopping.description || "No description"}</p>
            </div>
            <div>
                <table>
                    <tbody>
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