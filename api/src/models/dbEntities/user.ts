export default interface User {
    id: number
    username: string
    email: string
    passwordHash: string
    createdAt: string
    updatedAt: string
    isDeleted: boolean
}