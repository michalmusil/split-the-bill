import axios from 'axios'
import routes from '../../routes'
import IUsersRepository from './iUsersRepository'
import { IUser } from '../../../models/domain'
import { ISessionService } from '../../../../services/sessionService'

export default class UsersRepository implements IUsersRepository {
    sessionService: ISessionService

    constructor(sessionService: ISessionService) {
        this.sessionService = sessionService
    }

    async getUsers(searchQuery: string | null): Promise<IUser[]> {
        const res = await axios.get(routes.getUsers(searchQuery), {
            headers: { Authorization: this.sessionService.getUserToken() }
        })

        return res.data as IUser[]
    }

    async getUsersOfShopping(shoppingId: number): Promise<IUser[]> {
        const res = await axios.get(routes.getUsersOfShoppingByShoppingId(shoppingId), {
            headers: { Authorization: this.sessionService.getUserToken() }
        })

        return res.data as IUser[]
    }

    async getUserById(id: number): Promise<IUser> {
        const res = await axios.get(routes.getUserById(id), {
            headers: { Authorization: this.sessionService.getUserToken() }
        })
        return res.data as IUser
    }

    async assignUserToShopping(userId: number, shoppingId: number): Promise<void> {
        await axios.post(routes.assignUserToShopping(userId, shoppingId), {},
            { headers: { Authorization: this.sessionService.getUserToken() } })

    }

    async unassignUserFromShopping(userId: number, shoppingId: number): Promise<void> {
        await axios.delete(routes.unassignUserFromShopping(userId, shoppingId),
            { headers: { Authorization: this.sessionService.getUserToken() } })

    }
}