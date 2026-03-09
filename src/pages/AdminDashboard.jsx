import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../data/db';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit2, Image as ImageIcon, Save, Check, Package } from 'lucide-react';
import AdminProductForm from '../components/AdminProductForm';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [savingIng, setSavingIng] = useState(null); // ID of ingredient being saved
    const [newIngName, setNewIngName] = useState('');
    const [newIngPrice, setNewIngPrice] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setProducts(await db.getProducts());
        setIngredients(await db.getIngredients());
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            await db.deleteProduct(id);
            await loadData();
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentProduct(null);
        setIsEditing(true);
    };

    const handleFormSubmit = async () => {
        setIsEditing(false);
        setCurrentProduct(null);
        await loadData();
    };

    const handleAddIngredient = async (e) => {
        e.preventDefault();
        if (!newIngName) return;
        await db.addIngredient(newIngName, newIngPrice || 0);
        setNewIngName('');
        setNewIngPrice('');
        await loadData();
    };

    const handleDeleteIngredient = async (id) => {
        if (window.confirm('Excluir este adicional?')) {
            await db.deleteIngredient(id);
            await loadData();
        }
    };

    const handleUpdateIngredientPrice = (id, newPrice) => {
        setIngredients(prev => prev.map(ing =>
            ing.id === id ? { ...ing, price: newPrice } : ing
        ));
    };

    const saveIngredient = async (ing) => {
        setSavingIng(ing.id);
        await db.updateIngredient(ing);
        setTimeout(async () => {
            setSavingIng(null);
            await loadData();
        }, 1000);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: 'var(--accent-primary)', fontSize: '2rem' }}>Gerenciamento Kaus</h1>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <button 
                        onClick={() => navigate('/admin/stock')}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            color: 'var(--accent-primary)', 
                            background: 'rgba(251, 191, 36, 0.1)', 
                            border: '1px solid var(--accent-primary)', 
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer', 
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Package size={18} /> Estoque
                    </button>
                    <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        <LogOut size={18} /> Sair
                    </button>
                </div>
            </div>

            {isEditing ? (
                <AdminProductForm
                    product={currentProduct}
                    onSave={handleFormSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Left Column: Products */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Cardápio</h2>
                            <button
                                onClick={handleAddNew}
                                style={{
                                    backgroundColor: 'var(--accent-primary)',
                                    color: 'var(--bg-primary)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <Plus size={18} /> Novo Item
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {products.map(product => (
                                <div key={product.id} style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid var(--border-color)',
                                    transition: 'border-color 0.2s'
                                }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {product.image && (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                            />
                                        )}
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{product?.name}</h3>
                                            <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                                R$ {typeof product?.price === 'number' ? product.price.toFixed(2) : '0.00'}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button onClick={() => handleEdit(product)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} style={{ color: 'rgba(255, 68, 68, 0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Right Column: Ingredients */}
                    <section>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Preços Extras</h2>

                        {/* New Ingredient Form */}
                        <form onSubmit={handleAddIngredient} style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '1.5rem',
                            backgroundColor: 'var(--bg-secondary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <input
                                type="text"
                                placeholder="Novo adicional..."
                                value={newIngName}
                                onChange={(e) => setNewIngName(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={newIngPrice}
                                    onChange={(e) => setNewIngPrice(e.target.value)}
                                    style={{
                                        padding: '0.5rem 0.5rem 0.5rem 1.7rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-primary)',
                                        color: 'var(--text-primary)',
                                        width: '80px',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: 'var(--accent-primary)',
                                    color: 'var(--bg-primary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={20} />
                            </button>
                        </form>

                        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                {ingredients.map(ing => (
                                    <div key={ing.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingBottom: '0.75rem',
                                        borderBottom: '1px solid var(--bg-tertiary)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <button
                                                onClick={() => handleDeleteIngredient(ing.id)}
                                                style={{ color: 'rgba(255, 68, 68, 0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <span style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{ing.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                <span style={{ position: 'absolute', left: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>R$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={ing.price}
                                                    onChange={(e) => handleUpdateIngredientPrice(ing.id, e.target.value)}
                                                    style={{
                                                        padding: '0.4rem 0.5rem 0.4rem 1.7rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: '1px solid var(--border-color)',
                                                        backgroundColor: 'var(--bg-primary)',
                                                        color: 'var(--text-primary)',
                                                        width: '80px',
                                                        fontSize: '0.9rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => saveIngredient(ing)}
                                                style={{
                                                    backgroundColor: savingIng === ing.id ? '#10b981' : 'transparent',
                                                    color: savingIng === ing.id ? 'white' : 'var(--accent-primary)',
                                                    border: savingIng === ing.id ? 'none' : '1px solid var(--accent-primary)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '0.35rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {savingIng === ing.id ? <Check size={16} /> : <Save size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>


                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
