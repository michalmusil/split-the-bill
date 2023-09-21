import { ILoggedInUser } from "../../../models/domain";


export default interface IAuthRepository{
    logInWithEmailAndPassword: (email: string, password: string) => Promise<ILoggedInUser | null>
}