import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Check, X } from 'lucide-react';
import { db } from '../data/db';

const Stock = () => {
    const [products, setProducts] = React.useState([]);
    const [ingredients, setIngredients] = React.useState([]);

    React.useEffect(() => {
        const load = async () => {
            setProducts(await db.getProducts());
            setIngredients(await db.getIngredients());
        };
        load();
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
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
                    <Package size={28} /> Controle de Estoque
                </h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Disponibilidade - Cardápio</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {products.map(p => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                <span>{p.name}</span>
                                <span style={{ color: 'var(--success-color, #10b981)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                                    <Check size={14} /> Em Estoque
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Disponibilidade - Adicionais</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {ingredients.map(i => (
                            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                <span>{i.name}</span>
                                <span style={{ color: 'var(--success-color, #10b981)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                                    <Check size={14} /> Em Estoque
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Stock;
