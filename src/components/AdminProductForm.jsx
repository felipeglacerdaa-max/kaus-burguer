import React, { useState, useEffect } from 'react';
import { db } from '../data/db';
import { mediaGallery } from '../data/mediaGallery';
import { ArrowLeft, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';

const AdminProductForm = ({ product, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [showGallery, setShowGallery] = useState(false);

    // Ingredient Management State
    const [newIngName, setNewIngName] = useState('');
    const [newIngPrice, setNewIngPrice] = useState('');
    const [showIngForm, setShowIngForm] = useState(false);

    useEffect(() => {
        setAllIngredients(db.getIngredients());
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setImage(product.image || '');
            setSelectedIngredients(product.ingredients || []);
        }
    }, [product]);

    const refreshIngredients = () => {
        setAllIngredients(db.getIngredients());
    };

    const toggleIngredient = (id) => {
        setSelectedIngredients(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleAddIngredient = (e) => {
        e.preventDefault();
        if (!newIngName) return;

        db.addIngredient(newIngName, newIngPrice || 0);
        setNewIngName('');
        setNewIngPrice('');
        refreshIngredients();
        // Optional: auto-select the new ingredient?
    };

    const handleDeleteIngredient = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este ingrediente? Isso não afetará produtos que já o utilizam, mas ele sumirá da lista.')) {
            db.deleteIngredient(id);
            refreshIngredients();
            setSelectedIngredients(prev => prev.filter(i => i !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            name,
            description,
            price: parseFloat(price),
            image,
            ingredients: selectedIngredients
        };

        if (product) {
            db.updateProduct({ ...productData, id: product.id });
        } else {
            db.addProduct(productData);
        }
        onSave();
    };

    return (
        <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            position: 'relative'
        }}>
            <button
                onClick={onCancel}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                }}
            >
                <ArrowLeft size={20} />
                Voltar
            </button>

            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center', marginTop: '1rem' }}>
                {product ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Preço</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', minHeight: '100px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Imagem do Produto</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {image && (
                            <div style={{ position: 'relative', width: '200px', height: '150px' }}>
                                <img
                                    src={image}
                                    alt="Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setImage('')}
                                    style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        backgroundColor: 'var(--destructive-color, #ef4444)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setImage(reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                style={{ display: 'none' }}
                            />
                            <label
                                htmlFor="image-upload"
                                style={{
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--text-primary)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px dashed var(--border-color)',
                                    cursor: 'pointer',
                                    flex: 1,
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseOver={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onMouseOut={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            >
                                <Plus size={16} /> Upload
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowGallery(!showGallery)}
                                style={{
                                    backgroundColor: showGallery ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                    color: showGallery ? 'var(--bg-primary)' : 'var(--text-primary)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    flex: 1,
                                    fontWeight: '500',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ImageIcon size={16} /> Galeria
                            </button>

                            <input
                                type="text"
                                placeholder="Ou cole a URL"
                                value={(image && typeof image === 'string' && image.startsWith('data:')) ? '' : (image || '')}
                                onChange={(e) => setImage(e.target.value)}
                                style={{
                                    flex: 2,
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--text-primary)',
                                    display: (image && typeof image === 'string' && image.startsWith('data:')) ? 'none' : 'block'
                                }}
                            />
                        </div>

                        {showGallery && (
                            <div style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--accent-primary)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                gap: '0.75rem',
                                maxHeight: '250px',
                                overflowY: 'auto'
                            }}>
                                {mediaGallery.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            setImage(item.url);
                                            setShowGallery(false);
                                        }}
                                        style={{
                                            cursor: 'pointer',
                                            borderRadius: 'var(--radius-sm)',
                                            overflow: 'hidden',
                                            border: image === item.url ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                            transition: 'transform 0.1s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.name}
                                            style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                                        />
                                        <div style={{ padding: '0.25rem', fontSize: '0.7rem', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}>
                                            {item.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {image && typeof image === 'string' && image.startsWith('data:') && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--success-color, #10b981)' }}>✓ Imagem carregada do computador</p>
                        )}
                    </div>
                </div>

                {/* Ingredients Section */}
                <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ margin: 0, fontWeight: 'bold' }}>Ingredientes do Produto</label>
                        <button
                            type="button"
                            onClick={() => setShowIngForm(!showIngForm)}
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--accent-primary)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            {showIngForm ? 'Fechar Gerenciamento' : '+ Gerenciar Ingredientes'}
                        </button>
                    </div>

                    {showIngForm && (
                        <div style={{
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            backgroundColor: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px dashed var(--border-color)'
                        }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Adicionar Novo Ingrediente ao Sistema</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Nome (ex: Ovo)"
                                    value={newIngName}
                                    onChange={(e) => setNewIngName(e.target.value)}
                                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                />
                                <input
                                    type="number"
                                    placeholder="Preço Extra (0 se grátis)"
                                    value={newIngPrice}
                                    onChange={(e) => setNewIngPrice(e.target.value)}
                                    style={{ width: '100px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddIngredient}
                                    style={{
                                        backgroundColor: 'var(--success-color, #10b981)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0 0.75rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {allIngredients.map(ing => (
                            <div key={ing.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.25rem',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: selectedIngredients.includes(ing.id) ? 'rgba(251, 191, 36, 0.1)' : 'transparent'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={selectedIngredients.includes(ing.id)}
                                    onChange={() => toggleIngredient(ing.id)}
                                    id={`ing-${ing.id}`}
                                />
                                <label htmlFor={`ing-${ing.id}`} style={{ flex: 1, cursor: 'pointer', fontSize: '0.9rem', userSelect: 'none' }}>
                                    {ing.name}
                                    {ing.price > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.25rem' }}>(+R${ing.price})</span>}
                                </label>
                                {showIngForm && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteIngredient(ing.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--destructive-color, #ef4444)',
                                            cursor: 'pointer',
                                            padding: '0.25rem'
                                        }}
                                        title="Excluir ingrediente do sistema"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="submit"
                        style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold', flex: 1 }}
                    >
                        Salvar Produto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;
