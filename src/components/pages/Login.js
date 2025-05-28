import React, {useState} from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Navigate} from 'react-router-dom';
import {auth} from '../../config/firebase-config';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // "login" | "register" | "reset"
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('Registrace úspěšná. Nyní se můžeš přihlásit.');
        setMode('login');
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setMessage('E-mail s odkazem pro reset hesla byl odeslán.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) return <Navigate to="/"/>;

  return (
      <div style={{maxWidth: '400px', margin: 'auto'}}>
        <h2>
          {mode === 'login' && 'Přihlášení'}
          {mode === 'register' && 'Registrace'}
          {mode === 'reset' && 'Obnova hesla'}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          {mode !== 'reset' && (
              <input
                  type="password"
                  placeholder="Heslo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
          )}
          <button type="submit">
            {mode === 'login' && 'Přihlásit se'}
            {mode === 'register' && 'Registrovat se'}
            {mode === 'reset' && 'Obnovit heslo'}
          </button>
        </form>

        {error && <p style={{color: 'red'}}>{error}</p>}
        {message && <p style={{color: 'green'}}>{message}</p>}

        <div style={{marginTop: '1em'}}>
          {mode !== 'login' && (
              <button onClick={() => setMode('login')}>← Zpět na
                přihlášení</button>
          )}
          {mode === 'login' && (
              <>
                <p>
                  Nemáš účet?{' '}
                  <button onClick={() => setMode('register')}>Registrace
                  </button>
                </p>
                <p>
                  Zapomenuté heslo?{' '}
                  <button onClick={() => setMode('reset')}>Obnovit</button>
                </p>
              </>
          )}
        </div>
      </div>
  );
}
