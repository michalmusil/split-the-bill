import axios from "axios";
import { IShopping, IShoppingPost } from "../../../models/domain";
import IShoppingsRepository from "./iShoppingsRepository";
import routes from "../../routes";
import { ISessionService } from "../../../../services/sessionService";

export default class ShoppingsRepository implements IShoppingsRepository {
    sessionService: ISessionService

    constructor(sessionService: ISessionService) {
        this.sessionService = sessionService
    }

    async getAllShoppings(searchQuery: string | null): Promise<IShopping[]> {
        const res = await axios.get(routes.getAllShoppings(searchQuery),
            { headers: { Authorization: this.sessionService.getUserToken() } })
        const shoppings = res.data as IShopping[]
        return shoppings
    }
    async getShoppingById(id: number): Promise<IShopping> {
        const res = await axios.get(routes.getShoppingById(id),
            { headers: { Authorization: this.sessionService.getUserToken() } })

        const shopping = res.data as IShopping
        return shopping
    }

    async postShopping(shoppingPost: IShoppingPost): Promise<boolean> {
        try {
            await axios.post(routes.postNewShopping, shoppingPost,
                { headers: { Authorization: this.sessionService.getUserToken() } })
            return true
        } catch (err) {
            return false
        }
    }

    async deleteShopping(shoppingId: number): Promise<boolean> {
        try {
            await axios.delete(routes.deleteShopping(shoppingId),
                { headers: { Authorization: this.sessionService.getUserToken() } })
            return true
        } catch (err) {
            return false
        }
    }

}