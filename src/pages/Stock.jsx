import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

const Stock = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <button 
                    onClick={() => navigate('/admin')}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-secondary)', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                >
                    <ArrowLeft size={20} /> Voltar
                </button>
                <h1 style={{ color: 'var(--accent-primary)', fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Package size={28} /> Controle de Estoque
                </h1>
            </div>

            <div style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                padding: '3rem', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                color: 'var(--text-muted)'
            }}>
                <Package size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Área em Desenvolvimento</h2>
                <p>Aqui você poderá gerenciar a disponibilidade de todos os seus produtos e ingredientes.</p>
            </div>
        </div>
    );
};

export default Stock;
