import IProductAssignmentsRepository from "./iProductAssignmentsRepository";
import { ISessionService } from "../../../../services/sessionService";
import { IPostProductAssignment, IProductAssignment } from "../../../models/domain";
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

    async assignProductToShopping(shoppingId: number, productAssignment: IPostProductAssignment): Promise<IProductAssignment> {
        const res = await axios.post(routes.addOrUpdateProductAssignment(shoppingId), productAssignment,
            { headers: { Authorization: this.sessionService.getUserToken() } })

        const newAssignmentId = res.data.productId as number
        return {
            id: newAssignmentId,
            name: productAssignment.productName,
            description: productAssignment.description,
            quantity: productAssignment.quantity,
            unitPrice: productAssignment.unitPrice
        }
    }
}