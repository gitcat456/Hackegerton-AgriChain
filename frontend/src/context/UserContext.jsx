import { createContext, useContext, useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

const UserContext = createContext(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentRole, setCurrentRole] = useState('farmer'); // farmer, buyer, admin

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await usersAPI.list();
            setUsers(response.data.results || response.data);

            // Auto-select first user based on role
            const allUsers = response.data.results || response.data;
            if (allUsers.length > 0) {
                const farmer = allUsers.find(u => u.is_farmer);
                if (farmer) {
                    setCurrentUser(farmer);
                    setCurrentRole('farmer');
                } else {
                    setCurrentUser(allUsers[0]);
                }
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const switchUser = (user) => {
        setCurrentUser(user);
        if (user.is_admin) {
            setCurrentRole('admin');
        } else if (user.is_farmer) {
            setCurrentRole('farmer');
        } else if (user.is_buyer) {
            setCurrentRole('buyer');
        }
    };

    const switchRole = (role) => {
        setCurrentRole(role);
        // Find a user matching the role
        const matchingUser = users.find(u => {
            if (role === 'farmer') return u.is_farmer;
            if (role === 'buyer') return u.is_buyer;
            if (role === 'admin') return u.is_admin;
            return false;
        });
        if (matchingUser) {
            setCurrentUser(matchingUser);
        }
    };

    const value = {
        currentUser,
        users,
        loading,
        currentRole,
        switchUser,
        switchRole,
        loadUsers,
        farmers: users.filter(u => u.is_farmer),
        buyers: users.filter(u => u.is_buyer),
        admins: users.filter(u => u.is_admin),
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
