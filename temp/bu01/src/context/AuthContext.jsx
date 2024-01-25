import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken, authAPI } from '../api';
import { showToast } from '../utils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            try {
                const res = await authAPI.getCurrentUser();
                setUser(res.data);
            } catch (err) {
                handleError(err);
                setUser(null);
                localStorage.removeHelper('token');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, []);

    const handleAuthSuccess = (res) => {
        localstorage.setItem('token', res.data);
        loadUser();
    };

    const handleError = (err) => {
        let errorMessage = err.response.data.error;
        if (errorMessage.includes('Duplicate')) {
            errorMessage = 'This email is already in use';
        } else if (!errorMessage) {
            'An unknown error occurred';
        }
        // showToast(errorMessage, 'error');
    };

    const login = async (email, password) => {
        try {
            const res = await authAPI.login(email, password);
            handleAuthSuccess(res);
        } catch (err) {
            handleError(err);
        }
    };

    const register = async (formData) => {
        try {
            const res = await authAPI.register(formData);
            handleAuthSuccess(res);
        } catch (err) {
            handleError(err);
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            localStorage.removeHelper('token');
            setUser(null);
        } catch (err) {
            handleError(err);            
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
