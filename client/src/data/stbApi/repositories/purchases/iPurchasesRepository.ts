import { IPostProductPurchase, IPurchaseOfProduct, IPurchaseOfUser } from "../../../models/domain";

/**
 * A repository for getting data of purchases - how much of a given product has a given user purchased
 * ALWAYS WITHIN A CONTEXT OF ONE SPECIFFIC SHOPPING
 */
export default interface IPurchasesRepository {
    // Returns a list of purchases for each product within a given shopping
    getPurchasesGroupedByProducts(shoppingId: number, userId: number | null): Promise<IPurchaseOfProduct[]>
    // Returns a list of users of a shopping with all their purchases of all the products
    getPurchasesGroupedByUsers(shoppingId: number, userId: number | null): Promise<IPurchaseOfUser[]>
    // Adds or updates a purchase for a given quantity of product assigned to a shopping for the specified user
    purchaseProduct(purchaseProductPost: IPostProductPurchase): Promise<void>
}