import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const TripMap = ({ destination }) => {
    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Geocode the destination to get coordinates
        const geocodeDestination = async () => {
            if (!destination) return;

            try {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address: destination }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const location = results[0].geometry.location;
                        setPosition({
                            lat: location.lat(),
                            lng: location.lng()
                        });
                    } else {
                        console.error('Geocoding failed:', status);
                        // Default to Seoul if geocoding fails
                        setPosition({ lat: 37.5665, lng: 126.9780 });
                    }
                    setLoading(false);
                });
            } catch (err) {
                console.error('Error geocoding:', err);
                setPosition({ lat: 37.5665, lng: 126.9780 });
                setLoading(false);
            }
        };

        if (window.google && window.google.maps) {
            geocodeDestination();
        } else {
            // Wait for Google Maps to load
            const checkGoogleMaps = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(checkGoogleMaps);
                    geocodeDestination();
                }
            }, 100);

            return () => clearInterval(checkGoogleMaps);
        }
    }, [destination]);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
            }}>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    Google Maps API key not configured
                </p>
            </div>
        );
    }

    if (loading || !position) {
        return (
            <div style={{
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
            }}>
                <p style={{ color: 'var(--color-text-muted)' }}>Loading map...</p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <div style={{
                height: '400px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)'
            }}>
                <Map
                    defaultCenter={position}
                    defaultZoom={12}
                    mapId="trip-map"
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                >
                    <AdvancedMarker position={position}>
                        <Pin
                            background={'#6366f1'}
                            borderColor={'#4f46e5'}
                            glyphColor={'#fff'}
                        />
                    </AdvancedMarker>
                </Map>
            </div>
        </APIProvider>
    );
};

export default TripMap;
