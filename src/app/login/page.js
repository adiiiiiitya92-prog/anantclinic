'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect and restore session if user is logged in
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(true);
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
          });
          const data = await res.json();
          if (data.success) {
            router.replace('/admin');
            return;
          }
        } catch (err) {
          console.error("Auto-login session restoration error:", err);
        }
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      // 1. Sign in directly on the client side (instant validation)
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // 2. Fetch the session ID token
      const idToken = await user.getIdToken(true);
      
      // 3. Setup persistent secure session cookie on the server
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (data.success) {
        router.replace('/admin');
      } else {
        setError(data.message || 'Admin validation failed');
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      let errMsg = 'Invalid email or password';
      if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format';
      } else if (err.code === 'auth/user-disabled') {
        errMsg = 'This administrator account has been disabled';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errMsg = 'Incorrect email or password';
      }
      setError(errMsg);
      setIsLoggingIn(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px' }}>
          <div className="w-10 h-10 border-4 border-slate-300 border-t-secondary rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold mt-4 text-sm animate-pulse">Verifying administration session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Admin Email" 
            className={styles.input}
            disabled={isLoggingIn}
            required
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Admin Password" 
            className={styles.input}
            disabled={isLoggingIn}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={isLoggingIn}>
            {isLoggingIn ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
