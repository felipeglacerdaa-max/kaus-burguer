import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Plus, Minus, Save, Check, RefreshCw, Trash2 } from 'lucide-react';
import { stock_db } from '../data/stock_db';

const Stock = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQty, setNewItemQty] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [showForm, setShowForm] = useState(false);

    const loadData = async () => {
        setLoading(true);
        const data = await stock_db.getStockItems();
        setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItemName) return;
        try {
            await stock_db.addStockItem(newItemName, newItemQty || 0, newItemPrice || 0);
            setNewItemName('');
            setNewItemQty('');
            setNewItemPrice('');
            setShowForm(false);
            await loadData();
        } catch (error) {
            alert('Erro ao adicionar item ao estoque.');
        }
    };

    const handleUpdateLocal = (id, field, value) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleSave = async (item) => {
        setSaving(item.id);
        try {
            await stock_db.updateStockItem(item.id, item.stock_quantity || 0, item.cost_price || 0);
        } catch (error) {
            alert('Erro ao salvar no Supabase.');
        } finally {
            setTimeout(() => setSaving(null), 1000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excluir este item permanentemente?')) {
            try {
                await stock_db.deleteStockItem(id);
                await loadData();
            } catch (error) {
                alert('Erro ao excluir item.');
            }
        }
    };

    const globalTotal = useMemo(() => {
        return items.reduce((acc, item) => acc + ((item.stock_quantity || 0) * (item.cost_price || 0)), 0);
    }, [items]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
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
                        <Package size={28} /> Gerenciamento de Estoque Local
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--accent-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total em Estoque</span>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '1.25rem' }}>R$ {globalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Actions & New Item Form */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        style={{ 
                            backgroundColor: showForm ? 'var(--bg-tertiary)' : 'var(--accent-primary)', 
                            color: showForm ? 'var(--text-primary)' : 'var(--bg-primary)', 
                            padding: '0.75rem 1.5rem', 
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={18} /> {showForm ? 'Cancelar' : 'Novo Item no Estoque'}
                    </button>
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
                </div>

                {showForm && (
                    <form onSubmit={handleAddItem} style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        padding: '1.5rem', 
                        borderRadius: 'var(--radius-lg)', 
                        border: '1px dashed var(--accent-primary)',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nome do Item (Insumo/Material)</label>
                            <input 
                                type="text" 
                                placeholder="ex: Pão de Brioche, Guardanapo..."
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                                required
                            />
                        </div>
                        <div style={{ width: '100px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Qtd.</label>
                            <input 
                                type="number" 
                                value={newItemQty}
                                onChange={e => setNewItemQty(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                                placeholder="0"
                            />
                        </div>
                        <div style={{ width: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Preço de Compra</label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{ position: 'absolute', left: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>R$</span>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={newItemPrice}
                                    onChange={e => setNewItemPrice(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 1.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: '#10b981', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                            Cadastrar Item
                        </button>
                    </form>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                    <RefreshCw size={48} className="animate-spin" style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>Carregando estoque...</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                <th style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Item</th>
                                <th style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Quantidade</th>
                                <th style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Custo Unitário</th>
                                <th style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Valor Investido</th>
                                <th style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum item cadastrado no estoque.</td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--bg-tertiary)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <button 
                                                    onClick={() => handleUpdateLocal(item.id, 'stock_quantity', Math.max(0, (item.stock_quantity || 0) - 1))}
                                                    style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <input 
                                                    type="number" 
                                                    value={item.stock_quantity || 0}
                                                    onChange={(e) => handleUpdateLocal(item.id, 'stock_quantity', parseInt(e.target.value) || 0)}
                                                    style={{ width: '60px', textAlign: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', height: '28px' }}
                                                />
                                                <button 
                                                    onClick={() => handleUpdateLocal(item.id, 'stock_quantity', (item.stock_quantity || 0) + 1)}
                                                    style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
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
                                                    onChange={(e) => handleUpdateLocal(item.id, 'cost_price', parseFloat(e.target.value) || 0)}
                                                    style={{ paddingLeft: '1.75rem', width: '110px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', height: '28px' }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                                            R$ {((item.stock_quantity || 0) * (item.cost_price || 0)).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    onClick={() => handleSave(item)}
                                                    style={{ 
                                                        padding: '0.4rem 0.8rem', 
                                                        borderRadius: 'var(--radius-md)', 
                                                        border: 'none',
                                                        backgroundColor: saving === item.id ? '#10b981' : 'var(--accent-primary)',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {saving === item.id ? <Check size={14} /> : <Save size={14} />}
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    style={{ padding: '0.4rem', background: 'none', border: 'none', color: 'rgba(255,68,68,0.5)', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Stock;
