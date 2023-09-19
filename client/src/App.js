import './styles/App.css';
import './styles/Colors.css';
import './styles/Fonts.css';
import SessionService from './utils/SessionService';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import AuthorizedLayout from './components/layouts/AuthorizedLayout'
import UnauthorizedLayout from './components/layouts/UnauthorizedLayout'
import LoginPage from './pages/login/Login'
import HomePage from './pages/home/Home'
import ShoppingsPage from './pages/shoppings/Shoppings'
import ShoppingDetail from './pages/shopping_detail/ShoppingDetail'
import UsersPage from './pages/users/Users'
import UserDetail from './pages/user_detail/UserDetail'
import NotFoundPage from './pages/not_found/NotFound'




let sessionService = null
let sessionInitialized = false

async function setup() {
  sessionService = new SessionService(() => {
    sessionInitialized = true
  })
  await sessionService.getStoredUserFromCookie()
}

await setup()


function App() {
  return (
    <Router>
      {sessionInitialized ?
        <div className="App">

          <Routes>
            <Route path='/auth' element={<UnauthorizedLayout />}>
              <Route path='login' element={<LoginPage sessionService={sessionService} />} />
            </Route>

            <Route path='/' element={<AuthorizedLayout sessionService={sessionService} />}>
              <Route index element={<HomePage />} />
              <Route path='shoppings' element={<ShoppingsPage sessionService={sessionService} />} />
              <Route path='shoppings/:id' element={<ShoppingDetail sessionService={sessionService} />} />
              <Route path='users' element={<UsersPage sessionService={sessionService} />} />
              <Route path='users/:id' element={<UserDetail sessionService={sessionService} />} />
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
