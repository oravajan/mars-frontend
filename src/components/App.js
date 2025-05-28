import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/Login';
import Navbar from './Navbar';
import Lobby from './pages/Lobby';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>

          <Route
              path="/lobby"
              element={
                <ProtectedRoute>
                  <Navbar/>
                  <Lobby/>
                </ProtectedRoute>
              }
          />

          <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navbar/>
                  Game
                </ProtectedRoute>
              }
          />

          <Route path="*" element={<Navigate to="/lobby"/>}/>
        </Routes>
      </Router>
  );
}

export default App;
