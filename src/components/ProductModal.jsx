import React, { useState, useMemo } from 'react';
import { db } from '../data/db';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !product) return null;

    const [removedIngredients, setRemovedIngredients] = useState([]);
    const [addedIngredients, setAddedIngredients] = useState({}); // { id: quantity }
    const [allIngredients, setAllIngredients] = useState([]);

    React.useEffect(() => {
        const load = async () => setAllIngredients(await db.getIngredients());
        if (isOpen) {
            load();
        }
    }, [isOpen]);

    // Helper: Get name of ingredient by ID
    const getIngredientName = (id) => {
        const found = allIngredients.find(i => i.id === id);
        return found ? found.name : id;
    };

    // Calculate total price
    const totalPrice = useMemo(() => {
        let total = product.price;
        Object.entries(addedIngredients).forEach(([id, qty]) => {
            const ing = allIngredients.find(i => i.id === id);
            if (ing && ing.price) {
                total += ing.price * qty;
            }
        });
        return total;
    }, [product.price, addedIngredients, allIngredients]);

    const handleToggleRemove = (ingId) => {
        setRemovedIngredients(prev =>
            prev.includes(ingId) ? prev.filter(id => id !== ingId) : [...prev, ingId]
        );
    };

    const handleAddExtra = (ingId, delta) => {
        setAddedIngredients(prev => {
            const currentQty = prev[ingId] || 0;
            const newQty = Math.max(0, Math.min(5, currentQty + delta));
            const newMap = { ...prev, [ingId]: newQty };
            if (newQty === 0) delete newMap[ingId];
            return newMap;
        });
    };

    const handleConfirm = () => {
        onAddToCart(product, { removed: removedIngredients, added: addedIngredients }, totalPrice);
        onClose();
        // Reset state
        setRemovedIngredients([]);
        setAddedIngredients({});
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem',
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                width: '100%',
                maxWidth: '500px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-tertiary)'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{product.name}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ overflowY: 'auto', padding: '1.5rem', flex: 1 }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{product.description}</p>

                    {/* Standard Ingredients */}
                    {product.ingredients && product.ingredients.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Ingredientes Padrão
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                                {product.ingredients.map(ingId => (
                                    <div key={ingId} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-color)',
                                        opacity: 1
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--accent-primary)'
                                        }}></div>
                                        <span style={{ fontSize: '0.9rem' }}>
                                            {getIngredientName(ingId)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Extras */}
                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Turbine seu Burguer
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {allIngredients.map(ing => (
                                <div key={ing.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <div>
                                        <span style={{ display: 'block', fontWeight: '500' }}>{ing.name}</span>
                                        {ing.price > 0 && (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                                                + R$ {ing.price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button
                                            onClick={() => handleAddExtra(ing.id, -1)}
                                            disabled={!addedIngredients[ing.id]}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                border: '1px solid var(--border-color)',
                                                background: 'transparent',
                                                color: 'var(--text-primary)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                cursor: !addedIngredients[ing.id] ? 'not-allowed' : 'pointer',
                                                opacity: !addedIngredients[ing.id] ? 0.3 : 1
                                            }}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                                            {addedIngredients[ing.id] || 0}
                                        </span>
                                         <button
                                            onClick={() => handleAddExtra(ing.id, 1)}
                                            disabled={addedIngredients[ing.id] >= 5}
                                            title={addedIngredients[ing.id] >= 5 ? "Limite de 5 atingido" : ""}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                border: addedIngredients[ing.id] >= 5 ? '1px solid var(--border-color)' : '1px solid var(--accent-primary)',
                                                background: addedIngredients[ing.id] >= 5 ? 'transparent' : 'rgba(251, 191, 36, 0.1)',
                                                color: addedIngredients[ing.id] >= 5 ? 'var(--text-muted)' : 'var(--accent-primary)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                cursor: addedIngredients[ing.id] >= 5 ? 'not-allowed' : 'pointer',
                                                opacity: addedIngredients[ing.id] >= 5 ? 0.3 : 1
                                            }}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--accent-primary)' }}>R$ {typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}</span>
                    </div>
                    <button
                        onClick={handleConfirm}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--accent-primary)',
                            color: 'var(--bg-primary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        <ShoppingBag size={20} />
                        Adicionar ao Pedido
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductModal;
