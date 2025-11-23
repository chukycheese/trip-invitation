import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import CustomTimePicker from '../components/CustomTimePicker';
// import TripMap from '../components/TripMap';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabase } from '../contexts/SupabaseContext';

const TripDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const { user, supabase } = useSupabase();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState([]);
    const [newActivity, setNewActivity] = useState('');
    const [newActivityTime, setNewActivityTime] = useState('');
    const [newActivityType, setNewActivityType] = useState('sightseeing');
    const [selectedDay, setSelectedDay] = useState(0);
    const [editingActivity, setEditingActivity] = useState(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');

    const activityTypes = [
        { value: 'meal', icon: '🍚', label: 'catMeal' },
        { value: 'sightseeing', icon: '📷', label: 'catSightseeing' },
        { value: 'transport', icon: '🚌', label: 'catTransport' },
        { value: 'accommodation', icon: '🏨', label: 'catAccommodation' },
        { value: 'other', icon: '📌', label: 'catOther' },
    ];

    const formatDate = (dateObj) => {
        if (!dateObj) return '';
        if (language === 'ko') {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
        return dateObj.toLocaleDateString();
    };


    // Load trip from Supabase
    useEffect(() => {
        const loadTrip = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                // Fetch trip
                const { data: tripData, error: tripError } = await supabase
                    .from('trips')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (tripError) throw tripError;

                setTrip({
                    title: tripData.title,
                    destination: tripData.destination,
                    startDate: tripData.start_date,
                    endDate: tripData.end_date,
                    userId: tripData.user_id
                });
                setEditedTitle(tripData.title);

                // Fetch activities
                const { data: activitiesData, error: activitiesError } = await supabase
                    .from('activities')
                    .select('*')
                    .eq('trip_id', id)
                    .order('day', { ascending: true });

                if (activitiesError) throw activitiesError;

                // Calculate days
                const [startY, startM, startD] = tripData.start_date.split('-').map(Number);
                const [endY, endM, endD] = tripData.end_date.split('-').map(Number);
                const start = new Date(startY, startM - 1, startD);
                const end = new Date(endY, endM - 1, endD);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                // Initialize days with activities
                const daysArray = Array.from({ length: diffDays }, (_, i) => {
                    const date = new Date(startY, startM - 1, startD + i);
                    const dayActivities = activitiesData
                        .filter(a => a.day === i + 1)
                        .map(a => ({
                            id: a.id,
                            text: a.text,
                            time: a.time,
                            type: a.type,
                            completed: a.completed
                        }))
                        .sort((a, b) => {
                            if (!a.time) return 1;
                            if (!b.time) return -1;
                            return a.time.localeCompare(b.time);
                        });

                    return {
                        day: i + 1,
                        dateObj: date,
                        activities: dayActivities
                    };
                });

                setDays(daysArray);
            } catch (err) {
                console.error('Error loading trip:', err);
            } finally {
                setLoading(false);
            }
        };

        loadTrip();
        loadTrip();
    }, [id, user, supabase]);

    const isOwner = user && trip && user.id === trip.userId;


    const addActivity = async (e) => {
        e.preventDefault();
        if (!newActivity.trim()) return;

        const updatedDays = [...days];

        try {
            if (editingActivity) {
                // Update existing activity in database
                const { error } = await supabase
                    .from('activities')
                    .update({
                        text: newActivity,
                        time: newActivityTime,
                        type: newActivityType,
                    })
                    .eq('id', editingActivity.id);

                if (error) throw error;

                // Update local state
                const activityIndex = updatedDays[selectedDay].activities.findIndex(
                    a => a.id === editingActivity.id
                );
                if (activityIndex !== -1) {
                    updatedDays[selectedDay].activities[activityIndex] = {
                        ...editingActivity,
                        text: newActivity,
                        time: newActivityTime,
                        type: newActivityType,
                    };
                }
                setEditingActivity(null);
            } else {
                // Insert new activity into database
                const { data, error } = await supabase
                    .from('activities')
                    .insert([{
                        trip_id: id,
                        day: selectedDay + 1,
                        text: newActivity,
                        time: newActivityTime,
                        type: newActivityType,
                        completed: false
                    }])
                    .select()
                    .single();

                if (error) throw error;

                // Add to local state
                updatedDays[selectedDay].activities.push({
                    id: data.id,
                    text: newActivity,
                    time: newActivityTime,
                    type: newActivityType,
                    completed: false
                });
            }

            // Sort activities by time
            updatedDays[selectedDay].activities.sort((a, b) => {
                if (!a.time) return 1;
                if (!b.time) return -1;
                return a.time.localeCompare(b.time);
            });

            setDays(updatedDays);
            setNewActivity('');
            setNewActivityTime('');
            setNewActivityType('sightseeing');
        } catch (err) {
            console.error('Error saving activity:', err);
            alert('Failed to save activity');
        }
    };


    const deleteActivity = async (dayIndex, activityId) => {
        try {
            // Delete from database
            const { error } = await supabase
                .from('activities')
                .delete()
                .eq('id', activityId);

            if (error) throw error;

            // Update local state
            const updatedDays = [...days];
            updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
                a => a.id !== activityId
            );
            setDays(updatedDays);
        } catch (err) {
            console.error('Error deleting activity:', err);
            alert('Failed to delete activity');
        }
    };

    const startEditActivity = (activity) => {
        setEditingActivity(activity);
        setNewActivity(activity.text);
        setNewActivityTime(activity.time || '');
        setNewActivityType(activity.type || 'sightseeing');
    };

    const cancelEdit = () => {
        setEditingActivity(null);
        setNewActivity('');
        setNewActivityTime('');
        setNewActivityType('sightseeing');
    };

    const toggleActivity = async (dayIndex, activityId) => {
        const updatedDays = [...days];
        const day = updatedDays[dayIndex];
        const activity = day.activities.find(a => a.id === activityId);
        if (activity) {
            const newCompleted = !activity.completed;

            try {
                // Update in database
                const { error } = await supabase
                    .from('activities')
                    .update({ completed: newCompleted })
                    .eq('id', activityId);

                if (error) throw error;

                // Update local state
                activity.completed = newCompleted;
                setDays(updatedDays);
            } catch (err) {
                console.error('Error toggling activity:', err);
            }
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert(t('linkCopied'));
    };

    const startEditingTitle = () => {
        setIsEditingTitle(true);
        setEditedTitle(trip.title);
    };

    const saveTitle = async () => {
        if (editedTitle.trim()) {
            try {
                // Update in database
                const { error } = await supabase
                    .from('trips')
                    .update({ title: editedTitle.trim() })
                    .eq('id', id);

                if (error) throw error;

                // Update local state
                setTrip({ ...trip, title: editedTitle.trim() });
            } catch (err) {
                console.error('Error updating title:', err);
                alert('Failed to update title');
            }
        }
        setIsEditingTitle(false);
    };

    const cancelEditTitle = () => {
        setEditedTitle(trip.title);
        setIsEditingTitle(false);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>Loading trip...</p>
            </div>
        );
    }

    if (!trip) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>Trip not found</p>
                <Button onClick={() => navigate('/')} variant="primary">Go Home</Button>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ flex: 1 }}>
                    {isEditingTitle ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveTitle();
                                    if (e.key === 'Escape') cancelEditTitle();
                                }}
                                autoFocus
                                style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    lineHeight: '1.2',
                                    border: '2px solid var(--color-primary)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--color-text)',
                                    outline: 'none',
                                    flex: '1 1 auto',
                                    minWidth: '200px',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={saveTitle}
                                    style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        border: '1px solid var(--color-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer',
                                        color: 'var(--color-primary)',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    {language === 'ko' ? '저장' : 'Save'}
                                </button>
                                <button
                                    onClick={cancelEditTitle}
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
                                    {language === 'ko' ? '취소' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1.2' }}>
                                {trip.title}
                            </h1>
                            {isOwner && (
                                <button
                                    onClick={startEditingTitle}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        opacity: 0.6,
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                                    title={language === 'ko' ? '제목 수정' : 'Edit title'}
                                >
                                    ✏️
                                </button>
                            )}
                        </div>
                    )}
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                        📍 {trip.destination} &nbsp;•&nbsp; 📅 {trip.startDate} - {trip.endDate}
                    </p>
                </div>
                <Button variant="secondary" onClick={copyLink}>
                    🔗 {t('shareTrip')}
                </Button>
            </div>

            {/* Map Section */}
            {/* <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-text)' }}>
                    📍 {language === 'ko' ? '위치' : 'Location'}
                </h2>
                <TripMap destination={trip.destination} />
            </div> */}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                {/* Days List */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {days.map((day, index) => (
                        <Card
                            key={day.day}
                            style={{
                                cursor: 'pointer',
                                border: selectedDay === index ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                background: selectedDay === index ? 'rgba(99, 102, 241, 0.1)' : 'var(--color-surface)'
                            }}
                            onClick={() => setSelectedDay(index)}
                        >
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{t('dayPattern').replace('{n}', day.day)}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{formatDate(day.dateObj)}</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                {day.activities.length} {t('activities')}
                            </p>
                        </Card>
                    ))}
                </div>

                {/* Itinerary Details */}
                <div style={{ flex: '3 1 400px' }}>
                    <Card style={{ minHeight: '500px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                            {t('itineraryFor')} {t('dayPattern').replace('{n}', days[selectedDay]?.day)} <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>({formatDate(days[selectedDay]?.dateObj)})</span>
                        </h2>

                        {isOwner && (
                            <form onSubmit={addActivity} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
                                <div style={{ width: '130px' }}>
                                    <CustomTimePicker
                                        value={newActivityTime}
                                        onChange={(e) => setNewActivityTime(e.target.value)}
                                    />
                                </div>
                                <div style={{ width: '140px' }}>
                                    <select
                                        value={newActivityType}
                                        onChange={(e) => setNewActivityType(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0 0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            border: '1px solid var(--color-border)',
                                            color: 'var(--color-text)',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                            height: '43px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {activityTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.icon} {t(type.label)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input
                                        placeholder={t('addActivityPlaceholder')}
                                        value={newActivity}
                                        onChange={(e) => setNewActivity(e.target.value)}
                                        style={{ height: '43px' }}
                                    />
                                </div>
                                {editingActivity && (
                                    <Button type="button" variant="secondary" size="medium" height="43px" onClick={cancelEdit}>
                                        {language === 'ko' ? '취소' : 'Cancel'}
                                    </Button>
                                )}
                                <Button type="submit" variant="primary" size="medium" height="43px">
                                    {editingActivity ? (language === 'ko' ? '수정' : 'Update') : t('btnAdd')}
                                </Button>
                            </form>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {days[selectedDay]?.activities.length === 0 && (
                                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                                    {t('noActivities')}
                                </p>
                            )}
                            {days[selectedDay]?.activities.map(activity => (
                                <div
                                    key={activity.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: 'var(--radius-sm)',
                                        transition: 'var(--transition-fast)'
                                    }}
                                >
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={activity.completed}
                                        onChange={() => isOwner && toggleActivity(selectedDay, activity.id)}
                                        disabled={!isOwner}
                                        style={{
                                            width: '1.2rem',
                                            height: '1.2rem',
                                            accentColor: 'var(--color-primary)',
                                            flexShrink: 0,
                                            cursor: isOwner ? 'pointer' : 'default'
                                        }}
                                    />

                                    {/* Time */}
                                    <div style={{
                                        width: '130px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem',
                                        color: 'var(--color-text-muted)',
                                        fontWeight: '500'
                                    }}>
                                        {activity.time || '--:--'}
                                    </div>

                                    {/* Category Icon */}
                                    <div style={{
                                        width: '140px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        <span style={{ fontSize: '1.2rem' }}>
                                            {activityTypes.find(t => t.value === activity.type)?.icon || '📍'}
                                        </span>
                                        <span style={{ color: 'var(--color-text-muted)' }}>
                                            {t(activityTypes.find(t => t.value === activity.type)?.label || 'catOther')}
                                        </span>
                                    </div>

                                    {/* Activity Text */}
                                    <span style={{
                                        textDecoration: activity.completed ? 'line-through' : 'none',
                                        color: activity.completed ? 'var(--color-text-muted)' : 'var(--color-text)',
                                        flex: 1,
                                        fontSize: '1rem'
                                    }}>
                                        {activity.text}
                                    </span>

                                    {/* Action Buttons */}
                                    {isOwner && (
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            <button
                                                onClick={() => startEditActivity(activity)}
                                                style={{
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    border: '1px solid var(--color-primary)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '0.4rem 0.75rem',
                                                    cursor: 'pointer',
                                                    color: 'var(--color-primary)',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    height: '32px'
                                                }}
                                            >
                                                {language === 'ko' ? '수정' : 'Edit'}
                                            </button>
                                            <button
                                                onClick={() => deleteActivity(selectedDay, activity.id)}
                                                style={{
                                                    background: 'rgba(244, 63, 94, 0.1)',
                                                    border: '1px solid rgba(244, 63, 94, 0.5)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '0.4rem 0.75rem',
                                                    cursor: 'pointer',
                                                    color: 'rgba(244, 63, 94, 1)',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    height: '32px'
                                                }}
                                            >
                                                {language === 'ko' ? '삭제' : 'Delete'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TripDetails;
