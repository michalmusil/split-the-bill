import './styles/App.css';
import SessionService from './utils/SessionService';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import AuthorizedLayout from './components/common/AuthorizedLayout'
import UnauthorizedLayout from './components/common/UnauthorizedLayout'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import ShoppingsPage from './pages/Shoppings'





let sessionInitialized = false
const sessionService = new SessionService(() => {
  console.log('initialized')
  sessionInitialized = true
})
await sessionService.getStoredUserFromCookie()


function App() {
  return (
    <Router>  
      {sessionInitialized ?
      <div className="App">
                
          <Routes>
            <Route path = '/auth' element={ <UnauthorizedLayout /> }>
              <Route path = 'login' element = { <LoginPage SessionService = {sessionService}/> }/>
            </Route>
            
            <Route path = '/' element = { <AuthorizedLayout SessionService = {sessionService}/> }>
              <Route index Component={HomePage} />
              <Route path = 'shoppings' Component = {ShoppingsPage}/>
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
