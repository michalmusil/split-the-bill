import IUsersRepository from "./repositories/users/iUsersRepository"
import UsersRepository from "./repositories/users/usersRepository"
import IAuthRepository from "./repositories/auth/iAuthRepository"
import AuthRepository from "./repositories/auth/authRepository"
import IShoppingsRepository from "./repositories/shoppings/iShoppingsRepository"
import ShoppingsRepository from "./repositories/shoppings/shoppingsRepository"
import IProductAssignmentsRepository from "./repositories/product_assignments/iProductAssignmentsRepository"
import ProductAssignmentsRepository from "./repositories/product_assignments/productAssignmentRepository"
import IPurchasesRepository from "./repositories/purchases/iPurchasesRepository"
import PurchasesRepository from "./repositories/purchases/purchasesRepository"

export {
    type IUsersRepository,
    UsersRepository,
    type IAuthRepository,
    AuthRepository,
    type IShoppingsRepository,
    ShoppingsRepository,
    type IProductAssignmentsRepository,
    ProductAssignmentsRepository,
    type IPurchasesRepository,
    PurchasesRepository,
}