import { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'farmer' | 'buyer'
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { user, role } = await mockApi.login(email, password);
            setUser(user);
            setRole(role);
            localStorage.setItem('agriUser', JSON.stringify(user));
            localStorage.setItem('agriRole', role);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        localStorage.removeItem('agriUser');
        localStorage.removeItem('agriRole');
    };

    // Restore session on load
    useEffect(() => {
        const storedUser = localStorage.getItem('agriUser');
        const storedRole = localStorage.getItem('agriRole');
        if (storedUser && storedRole) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
