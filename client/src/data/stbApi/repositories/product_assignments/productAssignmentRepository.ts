import IProductAssignmentsRepository from "./iProductAssignmentsRepository";
import { ISessionService } from "../../../../services/sessionService";
import { IProductAssignment } from "../../../models/domain";
import routes from "../../routes";
import axios from "axios";

export default class ProductAssignmentsRepository implements IProductAssignmentsRepository {
    sessionService: ISessionService

    constructor(sessionService: ISessionService) {
        this.sessionService = sessionService
    }

    async getProductAssignmentsOfShopping(shoppingId: number): Promise<IProductAssignment[]> {
        const res = await axios.get(routes.getProductAssignmentsByShoppingId(shoppingId),
            { headers: { Authorization: this.sessionService.getUserToken() } })

        return res.data as IProductAssignment[]
    }

}