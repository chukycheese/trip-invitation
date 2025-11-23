import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';

// Signup is now the same as Login with Google OAuth
// Redirect to Login page
const Signup = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        navigate('/login');
    }, [navigate]);

    return null;
};

export default Signup;
