import React, {useState} from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
} from 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Navigate} from 'react-router-dom';
import {auth} from '../../config/firebase-config';
import {db} from '../../config/firebase-config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // "login" | "register" | "reset"
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'register') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        await setDoc(doc(db, 'users', uid), {
          uid,
          email,
          displayName,
          createdAt: new Date(),
        });

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
          {mode === 'register' && (
              <input
                  type="text"
                  placeholder="Přezdívka"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
              />
          )}
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
