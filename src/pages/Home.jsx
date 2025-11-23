import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabase } from '../contexts/SupabaseContext';

const Home = () => {
    const { t } = useLanguage();
    const { user } = useSupabase();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            gap: '2rem'
        }}>
            <div style={{ maxWidth: '800px' }}>
                <h1 className="text-gradient" style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem',
                    whiteSpace: 'pre-line'
                }}>
                    {t('heroTitle')}
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '2.5rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    {t('heroSubtitle')}
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {user ? (
                        <Link to="/create">
                            <Button variant="primary" size="large">
                                {t('startPlanning')}
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <Button variant="primary" size="large">
                                {t('login')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                width: '100%',
                marginTop: '4rem'
            }}>
                <Card>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📅 {t('featureItinerary')}</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t('featureItineraryDesc')}</p>
                </Card>
                <Card>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🤝 {t('featureSharing')}</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t('featureSharingDesc')}</p>
                </Card>
                <Card>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✅ {t('featurePremium')}</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t('featurePremiumDesc')}</p>
                </Card>
            </div>
        </div>
    );
};

export default Home;
