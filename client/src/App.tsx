import './styles/App.css';
import './styles/Colors.css';
import './styles/Fonts.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import { AuthorizedLayout, AuthorizedLayoutProps } from './components/layouts/AuthorizedLayout'
import { UnauthorizedLayout } from './components/layouts/UnauthorizedLayout'
import { LoginPage } from './pages/login/Login'
import HomePage from './pages/home/Home'
import { ShoppingsPage } from './pages/shoppings/Shoppings'
import ShoppingDetail from './pages/shopping_detail/ShoppingDetail'
import { UsersPage } from './pages/users/Users'
import { UserDetail } from './pages/user_detail/UserDetail'
import NotFoundPage from './pages/not_found/NotFound'
import { ISessionService, SessionService } from './services/sessionService';
import { AuthRepository, IAuthRepository, IProductAssignmentsRepository, IPurchasesRepository, IShoppingsRepository, IUsersRepository, ProductAssignmentsRepository, PurchasesRepository, ShoppingsRepository, UsersRepository } from './data/stbApi';



// Initialization of session
let sessionInitialized = false
let sessionService: ISessionService = new SessionService(() => {
  sessionInitialized = true
})
sessionService.getStoredUserFromCookie()


// Dependencies
const usersRepository: IUsersRepository = new UsersRepository(sessionService)
const authRepository: IAuthRepository = new AuthRepository()
const shoppingsRepository: IShoppingsRepository = new ShoppingsRepository(sessionService)
const productAssignmentsRepository: IProductAssignmentsRepository = new ProductAssignmentsRepository(sessionService)
const purchasesRepository: IPurchasesRepository = new PurchasesRepository(sessionService)




function App() {
  return (
    <Router>
      {sessionInitialized ?
        <div className="App">

          <Routes>
            <Route path='/auth' element={<UnauthorizedLayout />}>
              <Route path='login' element={<LoginPage sessionService={sessionService} authRepository={authRepository}/>} />
            </Route>

            <Route path='/' element={<AuthorizedLayout sessionService={sessionService} />}>
              <Route index element={<HomePage />} />
              <Route path='shoppings' element={<ShoppingsPage sessionService={sessionService} shoppingsRepository={shoppingsRepository} />} />
              <Route path='shoppings/:id' element={<ShoppingDetail sessionService={sessionService} />} />
              <Route path='users' element={<UsersPage sessionService={sessionService} usersRepository={usersRepository} />} />
              <Route path='users/:id' element={<UserDetail sessionService={sessionService} usersRepository={usersRepository} />} />
            </Route>

            <Route path='*' element={<AuthorizedLayout sessionService={sessionService} />}>
              <Route path='*' element={<NotFoundPage />} />
            </Route>

          </Routes>

        </div>
        :
        <></>
      }
    </Router>
  )
}

export default App;
