/**
 * Represents a product assignment to a given shopping with a certain quantity and unit price
 * @param id ID of the product
 * @param name Name of the product
 * @param description of the product
 * @param quantity quantity of the product being assigned to this shopping
 * @param unitPrice unit price of the product for the speciffic shopping
 */
export default interface IProductAssignment {
    id: number
    name: string
    description: string | null
    quantity: number
    unitPrice: number | null
}