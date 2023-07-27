import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AppHeader from './components/common/AppHeader'

import HomePage from './pages/Home'
import ShoppingsPage from './pages/Shoppings'


function App() {
  return (
    <Router>  
      <div className="App">
        <AppHeader loggedInUser={{ username: 'Zmrdi hlava' }}/>
        
          <Routes>
            <Route path = '/' exact Component = {HomePage}/>
            <Route path = '/shoppings' Component = {ShoppingsPage}/>
          </Routes>

      </div>
    </Router>
  )
}

export default App;
