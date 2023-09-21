import IProductWithPurchase from "./iProductWithPurchase"

/**
 * This model represents a summary of all products purchased by a given user for a speciffic shopping
 * It includes all the summary metadata (sums of purchased and remaining quantities and ammounts etc.)
 * as well as details of how much each individual user has purchased in the context of the shopping
 */
export default interface IPurchaseOfUser {
    userId: number
    username: string
    email: string
    totalQuantityPurchased: number
    totalAmmountPurchased: number
    purchasedProducts: IProductWithPurchase[]
}