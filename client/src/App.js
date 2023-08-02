import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { useContext } from 'react';
import { UserContext } from './components/common/UserContext';



import AuthorizedLayout from './components/common/AuthorizedLayout'
import UnauthorizedLayout from './components/common/UnauthorizedLayout'

import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import ShoppingsPage from './pages/Shoppings'


function App() {

  const user = useContext(UserContext)
  
  return (
    <Router>  
      <div className="App">
                
          <Routes>
            <Route path = '/auth' element={
              <UnauthorizedLayout />
            }>
              <Route path = 'login' Component = {LoginPage}/>
            </Route>
            
            <Route path = '/' element = {
                <AuthorizedLayout />
            }>
              <Route index Component={HomePage} />
              <Route path = 'shoppings' Component = {ShoppingsPage}/>
            </Route>
          </Routes>

      </div>
    </Router>
  )
}

export default App;
