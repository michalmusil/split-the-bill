import { IUser } from "../../../models/domain"


export default interface IUsersRepository {
    // Fetches all users matching the search query
    // If seach query is not specified, fetches all available users
    getUsers(searchQuery: string | null): Promise<IUser[]>
    
    // Fetches a user by the specified id
    // If ID is not specified, error is thrown
    getUserById(id: number): Promise<IUser>
}