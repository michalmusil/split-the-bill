/**
 * A helper model that is a part of IProductPurchase
 * representing how many instances of a given product has a user purchased in a context of a given shopping
 * @param purchased quantity of given product that this user has purchased
 */
export default interface IUserWithPurchase {
    id: number
    email: string
    username: string
    purchased: number
}