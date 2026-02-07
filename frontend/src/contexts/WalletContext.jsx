import { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../data/mockApi';
import { useAuth } from './AuthContext';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const { user, role } = useAuth();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const refreshBalance = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const bal = await mockApi.getWalletBalance(user.id, role);
            setBalance(bal);
        } catch (error) {
            console.error("Failed to fetch balance", error);
        } finally {
            setLoading(false);
        }
    };

    const addFunds = (amount) => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        setBalance(prev => prev + numAmount);
        setTransactions(prev => [{
            id: Date.now(),
            type: 'deposit',
            description: 'Added funds to wallet',
            amount: numAmount,
            date: new Date().toISOString().split('T')[0],
            balance: balance + numAmount
        }, ...prev]);
    };

    const deductFunds = (amount) => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0 || numAmount > balance) return false;

        setBalance(prev => prev - numAmount);
        setTransactions(prev => [{
            id: Date.now(),
            type: 'purchase',
            description: 'Purchase transaction',
            amount: -numAmount,
            date: new Date().toISOString().split('T')[0],
            balance: balance - numAmount
        }, ...prev]);
        return true;
    };

    useEffect(() => {
        if (user) {
            setBalance(user.walletBalance || 0);
            refreshBalance();
        } else {
            setBalance(0);
            setTransactions([]);
        }
    }, [user, role]);

    return (
        <WalletContext.Provider value={{
            balance,
            loading,
            transactions,
            refreshBalance,
            addFunds,
            deductFunds
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
