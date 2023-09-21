import IUserWithPurchase from "./iUserWithPurchase"

/**
 * This model represents a product being purchased by several users for a given shopping
 * It includes all the summary metadata (sums of purchased and remaining quantities and ammounts etc.)
 * as well as details of how much each individual user has purchased in the context of the shopping
 */
export default interface IPurchaseOfProduct {
    productId: number
    name: string
    description: string | null
    quantityPurchased: number
    quantityToBePurchased: number
    unitPrice: number
    ammountPurchased: number
    ammountToBePurchased: number
    users: IUserWithPurchase[]
}