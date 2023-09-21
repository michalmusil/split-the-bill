import { IShopping, IShoppingPost } from "../../../models/domain";

export default interface IShoppingsRepository {
    // Returns a list of shoppings with accordance with teh search query (if null, fetches all the shoppings available)
    getAllShoppings: (searchQuery: string | null) => Promise<IShopping[]>
    // Returns a shopping with a given ID, throws an exception, if anything goes wrong (including shopping not being found)
    getShoppingById: (id: number) => Promise<IShopping>
    // Attempts to post a shopping, returns true if posting was successfull
    postShopping: (shoppingPost: IShoppingPost) => Promise<boolean>
    // Attempts to delete a post, returns true if deletion was successfull
    deleteShopping: (shoppingId: number) => Promise<boolean>
}