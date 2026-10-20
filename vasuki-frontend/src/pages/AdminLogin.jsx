import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../services/api';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('The server returned an invalid login response.');
      }

      if (user.role !== 'admin') {
        toast.error('Access denied. This login is for administrators only.');
        return;
      }

      localStorage.setItem('vasuki_token', token);
      localStorage.setItem('vasuki_user', JSON.stringify(user));

      toast.success('Welcome to VASUKI Administration.');

      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      toast.error(
        error.message || 'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="vasuki-admin-login">
      <section className="admin-login-brand">
        <Link to="/" className="admin-login-wordmark" aria-label="VASUKI home">
     <img
          src="/images/brand/vasuki-logo.png"
           alt="VASUKI — Guardian of Gold"
    />
        </Link>
        <div className="admin-login-editorial">
          <span className="admin-login-kicker">THE ART OF TIMELESS GOLD</span>

          <h1>
            A legacy
            <br />
            <em>in every detail.</em>
          </h1>

          <p>
            The private workspace for managing the VASUKI jewellery
            collection.
          </p>
        </div>

        <span className="admin-login-footer">
          CRAFTED WITH PURPOSE · VASUKI
        </span>
      </section>

      <section className="admin-login-panel">
        <div className="admin-login-form-wrap">
          <div className="admin-login-icon">
            <LockKeyhole size={21} strokeWidth={1.5} />
          </div>

          <span className="admin-login-kicker">RESTRICTED ACCESS</span>

          <h2>Administrator sign in</h2>

          <p className="admin-login-description">
            Sign in with your authorised administrator account.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="admin-email">Email address</label>

            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="Enter your administrator email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="admin-password">Password</label>

            <div className="admin-password-field">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              className="admin-login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in securely'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="admin-login-security">
            <LockKeyhole size={14} />
            <span>Authorised administrators only</span>
          </div>

          <Link to="/" className="admin-login-back">
            Return to the VASUKI storefront
          </Link>
        </div>
      </section>
    </main>
  );
}