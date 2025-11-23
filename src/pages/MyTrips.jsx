import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/Button';
import Card from '../components/Card';

const MyTrips = () => {
    const navigate = useNavigate();
    const { user, supabase } = useSupabase();
    const { t } = useLanguage();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTrips = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('trips')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setTrips(data || []);
            } catch (err) {
                console.error('Error loading trips:', err);
            } finally {
                setLoading(false);
            }
        };

        loadTrips();
    }, [user, supabase, navigate]);

    const deleteTrip = async (tripId) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;

        try {
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', tripId);

            if (error) throw error;

            setTrips(trips.filter(t => t.id !== tripId));
        } catch (err) {
            console.error('Error deleting trip:', err);
            alert('Failed to delete trip');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>Loading trips...</p>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {t('myTrips')}
                </h1>
                {trips.length > 0 && (
                    <Link to="/create">
                        <Button variant="primary">
                            {t('createNewTrip')}
                        </Button>
                    </Link>
                )}
            </div>

            {trips.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        {t('noTripsYet')}
                    </p>
                    <Link to="/create">
                        <Button variant="primary" size="large">
                            {t('createNewTrip')}
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {trips.map((trip) => (
                        <Card
                            key={trip.id}
                            onClick={() => navigate(`/trip/${trip.id}`)}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <h3 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                                {trip.title}
                            </h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                                📍 {trip.destination}
                            </p>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                📅 {trip.start_date} - {trip.end_date}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTrip(trip.id);
                                    }}
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
                                    {t('deleteTrip')}
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTrips;
