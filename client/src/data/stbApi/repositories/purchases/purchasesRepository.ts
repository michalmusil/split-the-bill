import axios from "axios";
import { IPurchaseOfProduct, IPurchaseOfUser } from "../../../models/domain";
import IPurchasesRepository from "./iPurchasesRepository";
import routes from "../../routes";
import { ISessionService } from "../../../../services/sessionService";

export default class PurchasesRepository implements IPurchasesRepository {
    sessionService: ISessionService

    constructor(sessionService: ISessionService){
        this.sessionService = sessionService
    }
    
    async getPurchasesGroupedByProducts(shoppingId: number, userId: number | null): Promise<IPurchaseOfProduct[]> {
        const res = await axios.get(routes.getPurchasesGroupedByProducts(shoppingId, userId), 
        { headers: { Authorization: this.sessionService.getUserToken() } })

        return res.data as IPurchaseOfProduct[]
    }
    async getPurchasesGroupedByUsers(shoppingId: number, userId: number | null): Promise<IPurchaseOfUser[]> {
        const res = await axios.get(routes.getPurchasesGroupedByUsers(shoppingId, userId), 
        { headers: { Authorization: this.sessionService.getUserToken() } })

        return res.data as IPurchaseOfUser[]
    }

}