import { IPurchaseOfProduct, IShopping, IUser } from "../../../../data/models/domain"
import { IPurchasesRepository } from "../../../../data/stbApi"
import cs from "./PurchaseItemModal.module.css"

export interface PurchaseItemModalProps {
    purchasesRepository: IPurchasesRepository
    shopping: IShopping
    purchases: IPurchaseOfProduct[]
    usersOfShopping: IUser[]
}