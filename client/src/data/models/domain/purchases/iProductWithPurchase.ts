/**
 * A helper model that is a part of IPurchaseOfUser
 * representing a summary of a product that the parent user has purchased in context of a given shopping
 * in other words - which product user has purchased, how many items, for how much money etc..
 * 
 * @param id id of the product
 * @param name name of the product
 * @param description description of the product
 * @param unitPrice unit price of the product in the context of a given shopping
 * @param ammountPurchased ammount (money) how much the user has spent for this product purchase
 * @param quantityPurchased how many items of the product the user has purchased
 * @param quantityToBePurchased how many items of a given product are supposed to be purchased in total in the context of the shopping
 */
export default interface IProductWithPurchase {
    id: number
    name: string
    description: string | null
    unitPrice: number
    ammountPurchased: number
    quantityPurchased: number
    quantityToBePurchased: number
}