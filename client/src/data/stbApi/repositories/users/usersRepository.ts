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

    async getUserById(id: number): Promise<IUser> {
        const res = await axios.get(routes.getUserById(id), {
            headers: { Authorization: this.sessionService.getUserToken() }
        })
        return res.data as IUser
    }
}