import axios from "axios";
import { ISessionService } from "../../../../services/sessionService";
import { ILoggedInUser, IUser } from "../../../models/domain";
import IAuthRepository from "./iAuthRepository";
import routes from "../../routes";

export default class AuthRepository implements IAuthRepository {
    async logInWithEmailAndPassword(email: string, password: string): Promise<ILoggedInUser | null> {
        try {
            const res = await axios.post(routes.logIn, {
                email: email,
                password: password
            })
            const user: IUser = res.data.user
            const token: string = res.data.token
            const loggedInUser: ILoggedInUser = {
                ...user,
                token
            }
            return loggedInUser
        } catch (err) {
            return null
        }

    }

}