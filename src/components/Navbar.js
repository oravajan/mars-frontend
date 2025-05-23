import {useNavigate} from 'react-router-dom';
import {signOut} from 'firebase/auth';
import {auth} from '../config/firebase-config';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Chyba při odhlašování:', error);
    }
  };

  return (
      <nav>
        <h2>Mars</h2>
        <button onClick={handleLogout}>
          Odhlásit se
        </button>
      </nav>
  );
}
