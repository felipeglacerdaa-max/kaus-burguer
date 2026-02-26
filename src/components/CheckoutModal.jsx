import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db } from '../data/db';

const CheckoutModal = ({ isOpen, onClose }) => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [address, setAddress] = useState({
        street: '',
        number: '',
        neighborhood: '',
        complement: '',
        city: ''
    });
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [changeFor, setChangeFor] = useState('');

    if (!isOpen) return null;

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const generateOrderMessage = () => {
        const orderId = Math.floor(10000 + Math.random() * 90000);
        const allIngredients = db.getIngredients();
        const allProducts = db.getProducts();

        let itemsList = '';
        let extrasList = '';

        cartItems.forEach(item => {
            // Get base product to find its original price
            const baseProduct = allProducts.find(p => p.id === item.id);
            const basePrice = baseProduct ? baseProduct.price : item.price;

            itemsList += `- ${item.quantity}x ${item.name} (R$ ${(basePrice * item.quantity).toFixed(2)})\n`;

            if (item.customizations && item.customizations.added) {
                Object.entries(item.customizations.added).forEach(([ingId, qty]) => {
                    const ing = allIngredients.find(i => i.id === ingId);
                    if (ing && ing.price > 0) {
                        const extraTotal = ing.price * qty * item.quantity;
                        extrasList += `- ${qty * item.quantity}x ${ing.name} (R$ ${extraTotal.toFixed(2)})\n`;
                    }
                });
            }
        });

        const paymentText = paymentMethod === 'money'
            ? `Dinheiro (Troco para: R$ ${changeFor})`
            : paymentMethod === 'card' ? 'Cartão Crédito/Débito'
                : 'PIX';

        const fullAddress = `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}${address.complement ? ` (${address.complement})` : ''}`;

        return `Seja bem vindo a Kaus Burguer. 
Seu pedido já esta sendo preparado, o tempo de espera para o preparo seria de 30 a 55 minutos. 
Enquanto isso aproveite para estar verificando mais itens para matar a sua Fome de KAUS. 

Número do Pedido: #${orderId}
Número para Contato: ${phone}
Endereço para Entrega: ${fullAddress}
Forma de pagamento: ${paymentText}

Pedido:
${itemsList.trim()}

Acréscimo: 
${extrasList.trim() || 'Nenhum'}

Total: R$ ${cartTotal.toFixed(2)}

Desde já agradecemos seu pedido, tenha uma ótima noite.`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = generateOrderMessage();
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/+553187112512?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        // Clear cart and close modal
        clearCart();
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Finalizar Pedido</h2>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    {/* Address Section */}
                    <div>
                        <h4 style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>Endereço de Entrega</h4>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <input
                                name="street"
                                placeholder="Rua"
                                value={address.street}
                                onChange={handleAddressChange}
                                required
                                style={inputStyle}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <input
                                    name="number"
                                    placeholder="Número"
                                    value={address.number}
                                    onChange={handleAddressChange}
                                    required
                                    style={inputStyle}
                                />
                                <input
                                    name="neighborhood"
                                    placeholder="Bairro"
                                    value={address.neighborhood}
                                    onChange={handleAddressChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <input
                                name="city"
                                placeholder="Cidade"
                                value={address.city}
                                onChange={handleAddressChange}
                                required
                                style={inputStyle}
                            />
                            <input
                                name="complement"
                                placeholder="Complemento (Opcional)"
                                value={address.complement}
                                onChange={handleAddressChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h4 style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>Contato</h4>
                        <input
                            type="tel"
                            placeholder="(XX) XXXXX-XXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Payment Section */}
                    <div>
                        <h4 style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>Forma de Pagamento</h4>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                            style={inputStyle}
                        >
                            <option value="">Selecione...</option>
                            <option value="pix">PIX</option>
                            <option value="card">Cartão Crédito/Débito</option>
                            <option value="money">Dinheiro</option>
                        </select>

                        {paymentMethod === 'money' && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Troco para quanto?</label>
                                <input
                                    type="text"
                                    placeholder="Ex: R$ 50,00"
                                    value={changeFor}
                                    onChange={(e) => setChangeFor(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Total do Pedido: <span style={{ color: 'var(--accent-primary)' }}>R$ {cartTotal.toFixed(2)}</span></p>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#25D366', // WhatsApp Green
                                color: 'white',
                                fontWeight: '800',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            ENVIAR PEDIDO NO WHATSAPP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    outline: 'none'
};

export default CheckoutModal;
