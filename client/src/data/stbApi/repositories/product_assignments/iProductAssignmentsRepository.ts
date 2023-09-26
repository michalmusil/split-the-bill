import { IPostProductAssignment, IProductAssignment } from "../../../models/domain";

export default interface IProductAssignmentsRepository{
    // Returns all products assigned to the specified shopping
    getProductAssignmentsOfShopping(shoppingId: number): Promise<IProductAssignment[]>
    // Assigns a specified product to the shopping and returns the new productAssignment
    assignProductToShopping(shoppingId: number, productAssignment: IPostProductAssignment): Promise<IProductAssignment>
    // Updates a specified product assignment of the shopping and returns updated product assignment
    updateProductAssignment(shoppingId: number, productAssignment: IPostProductAssignment): Promise<IProductAssignment>
    // Removes a product specified by it's product name from the shopping (specified by the shopping id)
    unassignProductFromShopping(shoppingId: number, productName: string): Promise<void>
}