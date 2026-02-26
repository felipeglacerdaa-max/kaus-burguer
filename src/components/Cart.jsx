import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { db } from '../data/db';
import CheckoutModal from './CheckoutModal';

const Cart = () => {
    const {
        isCartOpen,
        toggleCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    if (!isCartOpen) return null;

    return (
        <>
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => {
                    setIsCheckoutOpen(false);
                    toggleCart();
                }}
            />
            <div
                onClick={toggleCart}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 99
                }}
            />
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '100%',
                maxWidth: '400px',
                height: '100%',
                backgroundColor: 'var(--bg-secondary)',
                zIndex: 100,
                boxShadow: '-4px 0 15px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Seu Pedido</h2>
                    <button onClick={toggleCart} style={{ color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                            Seu carrinho está vazio.
                        </p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.cartId || item.id} style={{
                                display: 'flex',
                                gap: '1rem',
                                backgroundColor: 'var(--bg-tertiary)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <img
                                    src={item.image || 'https://placehold.co/100?text=Burger'}
                                    alt={item.name}
                                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h4 style={{ fontWeight: '600' }}>{item.name}</h4>
                                        <button
                                            onClick={() => removeFromCart(item.cartId || item.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* Customizations Display */}
                                    {item.customizations && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item.customizations.removed && item.customizations.removed.length > 0 && (
                                                <div style={{ color: 'var(--destructive-color)' }}>
                                                    Sem: {item.customizations.removed.map(id => {
                                                        const ing = db.getIngredients().find(i => i.id === id);
                                                        return ing ? ing.name : id;
                                                    }).join(', ')}
                                                </div>
                                            )}
                                            {item.customizations.added && Object.keys(item.customizations.added).length > 0 && (
                                                <div style={{ color: 'var(--success-color, #10b981)' }}>
                                                    {Object.entries(item.customizations.added).map(([id, qty]) => {
                                                        const ing = db.getIngredients().find(i => i.id === id);
                                                        return `${qty}x ${ing ? ing.name : id}`;
                                                    }).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-primary)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                                            <button
                                                onClick={() => updateQuantity(item.cartId || item.id, -1)}
                                                disabled={item.quantity <= 1}
                                                style={{ padding: '0.25rem', color: item.quantity <= 1 ? 'var(--text-muted)' : 'var(--text-primary)' }}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartId || item.id, 1)}
                                                style={{ padding: '0.25rem' }}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--accent-primary)' }}>R$ {cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                        disabled={cartItems.length === 0}
                        onClick={() => setIsCheckoutOpen(true)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: 'var(--accent-primary)',
                            color: 'var(--bg-primary)',
                            fontWeight: '800',
                            borderRadius: 'var(--radius-md)',
                            opacity: cartItems.length === 0 ? 0.5 : 1,
                            cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        FINALIZAR PEDIDO
                    </button>
                </div>
            </div>
        </>
    );
};

export default Cart;
