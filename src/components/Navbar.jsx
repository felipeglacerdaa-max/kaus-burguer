import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { toggleCart, cartCount } = useCart();

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: 'rgba(15, 15, 15, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 2rem'
        }}>
            <div className="navbar-content">
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    letterSpacing: '-0.5px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    zIndex: 2 // Ensure logo is clickable
                }}>
                    SMASH<span style={{ color: 'var(--accent-primary)' }}>KAUS</span>
                </Link>

                {/* Centered iFood Button - Styles moved to index.css */}
                <button
                    className="ifood-btn"
                    onClick={() => window.open('https://www.ifood.com.br/delivery/betim-mg/smash-kaus-hamburguer-citrolandia/b2a752f7-8602-4815-ae8b-9dd4fcdfaa51?UTM_Medium=share', '_blank')}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                        <path d="M12.6,14.8c-0.5,0.4-1.1,0.5-1.7,0.3c-0.6-0.2-1-0.7-1.1-1.3c0-0.1,0-0.2,0-0.3c0.1-0.6,0.6-1.1,1.2-1.2h0v0 c0.5-0.1,1.1,0.1,1.5,0.5C12.9,13.3,13,14.1,12.6,14.8z M8.5,9.6c-0.4,0.4-0.4,1-0.1,1.4c0.4,0.4,1,0.4,1.4,0.1c0.1-0.1,0.2-0.2,0.3-0.3 c-0.8-0.9-2.1-1.2-3.2-0.8c-1.1,0.4-1.8,1.5-1.8,2.7c0,1,0.5,2,1.4,2.5c0.9,0.5,2,0.5,2.9,0c0.6-0.3,1-0.8,1.2-1.4 c0.8-2.6,3.6-4.1,6.2-3.3c0.8,0.2,1.5,0.6,2.1,1.2c0.1-0.1,0.3-0.3,0.4-0.4c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0 c-0.6,0.6-1.4,0.9-2.2,0.9c-1.2,0-2.3-0.7-2.8-1.8c-0.4-1.1-0.1-2.4,0.8-3.2C10.6,5.3,8,6.8,7.2,9.4C7,10.2,7,11,8.5,9.6z M18.3,14.2c-0.2,2.9-2.7,5-5.5,4.8c-2.6-0.2-4.7-2.3-4.9-4.9c-0.2-2.9,2-5.4,4.8-5.5c0.1,0,0.1,0,0.2,0 C15.7,8.7,18.1,11.2,18.3,14.2z" />
                    </svg>
                    Pedir no iFood
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', zIndex: 2 }}>
                    <Link to="/login" style={{
                        color: 'var(--text-muted)',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        <User size={18} />
                        <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>Admin</span>
                    </Link>

                    <button
                        onClick={toggleCart}
                        style={{
                            position: 'relative',
                            color: 'var(--text-primary)',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                backgroundColor: 'var(--accent-secondary)',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
