import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import CustomDatePicker from '../components/CustomDatePicker';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabase } from '../contexts/SupabaseContext';

const CreateTrip = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { user, supabase } = useSupabase();
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        title: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // const [destinationValid, setDestinationValid] = useState(null);
    // const [validating, setValidating] = useState(false);
    // const [validatedLocation, setValidatedLocation] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Reset validation when destination changes
        // if (e.target.name === 'destination') {
        //     setDestinationValid(null);
        //     setValidatedLocation('');
        // }
    };

    // Auto-validate destination with debouncing
    /*
    React.useEffect(() => {
        if (!formData.destination.trim()) {
            setDestinationValid(null);
            setValidatedLocation('');
            return;
        }

        const timeoutId = setTimeout(async () => {
            setValidating(true);

            try {
                // Wait for Google Maps to load
                if (!window.google || !window.google.maps) {
                    setValidating(false);
                    return;
                }

                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address: formData.destination }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        setDestinationValid(true);
                        setValidatedLocation(results[0].formatted_address);
                        setError('');
                    } else {
                        setDestinationValid(false);
                        setValidatedLocation('');
                    }
                    setValidating(false);
                });
            } catch (err) {
                console.error('Geocoding error:', err);
                setDestinationValid(false);
                setValidating(false);
            }
        }, 800); // Wait 800ms after user stops typing

        return () => clearTimeout(timeoutId);
    }, [formData.destination]);
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('Please login to create a trip');
            navigate('/login');
            return;
        }

        // Validate destination before submitting
        // if (!destinationValid) {
        //     setError('Please validate the destination first');
        //     return;
        // }

        setLoading(true);
        setError('');

        try {
            // Insert trip into Supabase
            const { data: trip, error: tripError } = await supabase
                .from('trips')
                .insert([
                    {
                        user_id: user.id,
                        title: formData.title,
                        destination: formData.destination,
                        start_date: formData.startDate,
                        end_date: formData.endDate
                    }
                ])
                .select()
                .single();

            if (tripError) throw tripError;

            // Navigate to trip details with the new trip ID
            navigate(`/trip/${trip.id}`, { state: formData });
        } catch (err) {
            console.error('Error creating trip:', err);
            setError(err.message || 'Failed to create trip');
        } finally {
            setLoading(false);
        }
    };

    // Load Google Maps script
    /*
    React.useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) return;

        if (!window.google || !window.google.maps) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, []);
    */

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <Card style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="text-gradient" style={{
                    fontSize: '2rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}>
                    {t('createTripTitle')}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Input
                        label={t('labelTripTitle')}
                        name="title"
                        placeholder={t('placeholderTripTitle')}
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />


                    <Input
                        label={t('labelDestination')}
                        name="destination"
                        placeholder={t('placeholderDestination')}
                        value={formData.destination}
                        onChange={handleChange}
                        required
                    // style={{
                    //     borderColor: destinationValid === true ? '#10b981' : destinationValid === false ? '#ef4444' : undefined
                    // }}
                    />
                    {/* {validating && (
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                            🔍 Validating location...
                        </p>
                    )}
                    {destinationValid === true && validatedLocation && (
                        <p style={{ color: '#10b981', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ✓ {validatedLocation}
                        </p>
                    )}
                    {destinationValid === false && formData.destination && !validating && (
                        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                            ✗ {formData.destination}
                        </p>
                    )} */}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <CustomDatePicker
                            label={t('labelStartDate')}
                            name="startDate"
                            selected={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                        <CustomDatePicker
                            label={t('labelEndDate')}
                            name="endDate"
                            selected={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'rgba(244, 63, 94, 1)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <Button type="submit" variant="primary" size="large" disabled={loading}>
                            {loading ? 'Creating...' : t('btnCreateTrip')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateTrip;
