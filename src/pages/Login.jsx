import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = () => {
    const navigate = useNavigate();
    const { signInWithGoogle } = useSupabase();
    const { t } = useLanguage();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        try {
            await signInWithGoogle();
            // OAuth will redirect, so no need to navigate manually
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 200px)',
            padding: '2rem'
        }}>
            <Card style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                    {t('login')}
                </h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {error && (
                        <p style={{ color: 'rgba(244, 63, 94, 1)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            background: '#fff',
                            border: '1px solid #dadce0',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#3c4043',
                            fontFamily: "'Google Sans', 'Roboto', arial, sans-serif",
                            transition: 'background-color 0.2s, box-shadow 0.2s',
                            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                            opacity: loading ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)';
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                        </svg>
                        <span>{loading ? 'Loading...' : 'Sign in with Google'}</span>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Login;
