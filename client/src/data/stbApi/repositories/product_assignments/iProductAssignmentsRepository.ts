import { IProductAssignment } from "../../../models/domain";

export default interface IProductAssignmentsRepository{
    getProductAssignmentsOfShopping: (shoppingId: number) => Promise<IProductAssignment[]> 
}