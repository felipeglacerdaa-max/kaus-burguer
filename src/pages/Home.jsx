import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import { db } from '../data/db';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await db.getProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      <Cart />

      <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '2rem var(--container-padding)' }}>

        {/* Hero Section */}
        <section style={{
          textAlign: 'center',
          padding: '4rem 0',
          marginBottom: '3rem',
          backgroundImage: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%)'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SABOR QUE VEM DO <span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: 'var(--accent-primary)' }}>KAOS</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Hambúrgueres artesanais feitos com paixão, ingredientes premium e um toque de loucura.
          </p>
        </section>

        {/* Menu Grid */}
        <section>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '2rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--accent-primary)',
            display: 'inline-block'
          }}>
            Nosso Menu
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        marginTop: '4rem'
      }}>
        <p>&copy; 2026 Kaus Burguer. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
