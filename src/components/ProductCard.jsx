import React, { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { db } from '../data/db';
import ProductModal from './ProductModal';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const allIngredients = useMemo(() => db.getIngredients(), []);

    const getIngredientName = (id) => {
        const ing = allIngredients.find(i => i.id === id);
        return ing ? ing.name : id;
    };

    const handleConfirmAddToCart = (product, customizations, totalPrice) => {
        addToCart(product, customizations, totalPrice);
    };

    return (
        <>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: '1px solid transparent',
                cursor: 'default'
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.border = '1px solid var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = '1px solid transparent';
                }}
            >
                <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                        src={product.image || 'https://placehold.co/600x400/1a1a1a/fbbf24?text=Burger'}
                        alt={product.name || 'Product Image'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {product.name || 'Unnamed Product'}
                        </h3>
                        <span style={{
                            color: 'var(--accent-primary)',
                            fontWeight: '700',
                            fontSize: '1.2rem'
                        }}>
                            R$ {typeof product?.price === 'number' ? product.price.toFixed(2) : '0.00'}
                        </span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {product.description}
                    </p>

                    {product.ingredients && product.ingredients.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem' }}>
                                INGREDIENTES:
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {product.ingredients.map(ingId => (
                                    <span key={ingId} style={{
                                        fontSize: '0.75rem',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '1rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {getIngredientName(ingId)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: 'auto' }}>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--accent-primary)',
                                color: 'var(--bg-primary)',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-primary)'}
                        >
                            <ShoppingBag size={18} />
                            Adicionar / Personalizar
                        </button>
                    </div>
                </div>
            </div>

            <ProductModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={handleConfirmAddToCart}
            />
        </>
    );
};

export default ProductCard;
