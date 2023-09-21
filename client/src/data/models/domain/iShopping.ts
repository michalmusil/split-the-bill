export default interface IShopping{
    id: number
    name: string
    creatorId: number
    numberOfParticipants: number
    dueDateTime: string | null
    description: string | null
    numberOfItems: number | null
    totalCost: number | null
}