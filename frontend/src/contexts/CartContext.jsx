import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const addToCart = (product) => {
        // Product should have: id, productName, pricePerUnit, unit, quantity, maxQuantity, image, farmerId, location
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                const newQuantity = Math.min(
                    existing.quantity + (product.quantity || 1),
                    product.maxQuantity || 999
                );
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }
            return [...prev, {
                ...product,
                quantity: product.quantity || 1
            }];
        });
    };

    const removeFromCart = (productId) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.id === productId
                ? { ...item, quantity: Math.min(quantity, item.maxQuantity || 999) }
                : item
        ));
    };

    const clearCart = () => setItems([]);

    const getTotal = () => items.reduce(
        (sum, item) => sum + (item.pricePerUnit * item.quantity),
        0
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotal,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
