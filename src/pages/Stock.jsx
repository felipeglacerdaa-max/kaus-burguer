import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Plus, Minus, Save, Check, RefreshCw } from 'lucide-react';
import { db } from '../data/db';

const Stock = () => {
    const [products, setProducts] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null); // ID of item being saved

    const loadData = async () => {
        setLoading(true);
        const [pData, iData] = await Promise.all([
            db.getProducts(),
            db.getIngredients()
        ]);
        setProducts(pData);
        setIngredients(iData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUpdateLocal = (id, type, field, value) => {
        if (type === 'product') {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        } else {
            setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
        }
    };

    const handleSave = async (item, type) => {
        setSaving(item.id);
        try {
            if (type === 'product') {
                await db.updateProductStock(item.id, item.stock_quantity || 0, item.cost_price || 0);
            } else {
                await db.updateIngredientStock(item.id, item.stock_quantity || 0, item.cost_price || 0);
            }
            // Optional: refresh or just show checkmark
        } catch (error) {
            console.error('Error saving stock:', error);
            alert('Erro ao salvar estoque no Supabase.');
        } finally {
            setTimeout(() => setSaving(null), 1000);
        }
    };

    const globalTotal = useMemo(() => {
        const pTotal = products.reduce((acc, p) => acc + ((p.stock_quantity || 0) * (p.cost_price || 0)), 0);
        const iTotal = ingredients.reduce((acc, i) => acc + ((i.stock_quantity || 0) * (i.cost_price || 0)), 0);
        return pTotal + iTotal;
    }, [products, ingredients]);

    const StockTable = ({ items, type, title }) => (
        <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {title} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({items.length} itens)</span>
            </h2>
            <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Item</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Quantidade</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Preço de Compra</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--bg-tertiary)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button 
                                            onClick={() => handleUpdateLocal(item.id, type, 'stock_quantity', Math.max(0, (item.stock_quantity || 0) - 1))}
                                            style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <input 
                                            type="number" 
                                            value={item.stock_quantity || 0}
                                            onChange={(e) => handleUpdateLocal(item.id, type, 'stock_quantity', parseInt(e.target.value) || 0)}
                                            style={{ width: '50px', textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', padding: '2px' }}
                                        />
                                        <button 
                                            onClick={() => handleUpdateLocal(item.id, type, 'stock_quantity', (item.stock_quantity || 0) + 1)}
                                            style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ position: 'absolute', left: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>R$</span>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={item.cost_price || 0}
                                            onChange={(e) => handleUpdateLocal(item.id, type, 'cost_price', parseFloat(e.target.value) || 0)}
                                            style={{ paddingLeft: '1.75rem', width: '100px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', height: '28px' }}
                                        />
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                                    R$ {((item.stock_quantity || 0) * (item.cost_price || 0)).toFixed(2)}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button 
                                        onClick={() => handleSave(item, type)}
                                        style={{ 
                                            padding: '0.4rem 0.8rem', 
                                            borderRadius: 'var(--radius-md)', 
                                            border: 'none',
                                            backgroundColor: saving === item.id ? '#10b981' : 'var(--accent-primary)',
                                            color: 'var(--bg-primary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {saving === item.id ? <Check size={14} /> : <Save size={14} />}
                                        {saving === item.id ? 'Salvo' : 'Salvar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link 
                        to="/admin"
                        style={{ 
                            textDecoration: 'none',
                            color: 'var(--text-secondary)', 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                    >
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                    <h1 style={{ color: 'var(--accent-primary)', fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Package size={28} /> Gerenciamento de Estoque
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={loadData}
                        style={{ 
                            background: 'var(--bg-secondary)', 
                            border: '1px solid var(--border-color)', 
                            color: 'var(--text-primary)', 
                            padding: '0.5rem 1rem', 
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Atualizar
                    </button>
                    <div style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--accent-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valor Total em Estoque</span>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '1.25rem' }}>R$ {globalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                    <RefreshCw size={48} className="animate-spin" style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>Carregando dados do estoque...</p>
                </div>
            ) : (
                <>
                    <StockTable items={products} type="product" title="Produtos (Hambúrgueres, etc)" />
                    <StockTable items={ingredients} type="ingredient" title="Ingredientes & Adicionais" />
                </>
            )}
        </div>
    );
};

export default Stock;
