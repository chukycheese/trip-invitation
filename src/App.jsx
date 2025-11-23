import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyTrips from './pages/MyTrips';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { SupabaseProvider, useSupabase } from './contexts/SupabaseContext';
import './styles/variables.css';
import './styles/global.css';

const AppContent = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, signOut } = useSupabase();

  return (
    <Router>
      <div className="container">
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem 0',
          marginBottom: '2rem'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="text-gradient" style={{ fontSize: '1.75rem' }}>{t('appTitle')}</h1>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user && (
              <Link to="/my-trips" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {t('myTrips')}
                </button>
              </Link>
            )}
            {user && (
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {user.email}
              </span>
            )}
            {user && (
              <button
                onClick={signOut}
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.5)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  color: 'rgba(244, 63, 94, 1)',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {t('logout')}
              </button>
            )}
            <button
              onClick={toggleLanguage}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {language === 'en' ? '한국어' : 'English'}
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/create" element={<CreateTrip />} />
          <Route path="/trip/:id" element={<TripDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <SupabaseProvider>
        <AppContent />
      </SupabaseProvider>
    </LanguageProvider>
  );
};

export default App;
