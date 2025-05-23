import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Navbar from './Navbar';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navbar/>
                  <h1>Hello Mars</h1>
                </ProtectedRoute>
              }
          />
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </Router>
  );
}

export default App;
