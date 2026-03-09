import { supabase } from '../lib/supabase';

export const db = {
    getProducts: async () => {
        const { data, error } = await supabase.from('products').select('*').order('name');
        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }
        return data || [];
    },

    getIngredients: async () => {
        const { data, error } = await supabase.from('ingredients').select('*').order('name');
        if (error) {
            console.error('Error fetching ingredients:', error);
            return [];
        }
        return data || [];
    },

    addProduct: async (product) => {
        const { id, ...productData } = product; // Remove o id gerado localmente pra que o Supabase use UUID
        const { data, error } = await supabase.from('products').insert([productData]).select().single();
        if (error) {
            console.error('Error adding product:', error);
            throw error;
        }
        return data;
    },

    updateProduct: async (updatedProduct) => {
        const { id, ...productData } = updatedProduct;
        const { data, error } = await supabase.from('products').update(productData).eq('id', id).select().single();
        if (error) {
            console.error('Error updating product:', error);
            throw error;
        }
        return data;
    },

    deleteProduct: async (id) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    updateProductStock: async (id, quantity, cost_price) => {
        const { data, error } = await supabase.from('products').update({
            stock_quantity: parseInt(quantity),
            cost_price: parseFloat(cost_price)
        }).eq('id', id).select().single();
        if (error) {
            console.error('Error updating product stock:', error);
            throw error;
        }
        return data;
    },

    addIngredient: async (name, price) => {
        const id = name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        const { data, error } = await supabase.from('ingredients').insert([{ id, name, price: parseFloat(price) }]).select().single();

        if (error) {
            if (error.code === '23505') { // Postgres unique violation
                const newId = id + '-' + Date.now();
                const { data: retryData, error: retryError } = await supabase.from('ingredients').insert([{ id: newId, name, price: parseFloat(price) }]).select().single();
                if (retryError) {
                    console.error('Error adding ingredient with new ID:', retryError);
                    throw retryError;
                }
                return retryData;
            }
            console.error('Error adding ingredient:', error);
            throw error;
        }
        return data;
    },

    deleteIngredient: async (id) => {
        const { error } = await supabase.from('ingredients').delete().eq('id', id);
        if (error) {
            console.error('Error deleting ingredient:', error);
            throw error;
        }
    },

    updateIngredient: async (updatedIng) => {
        const { id, ...ingData } = updatedIng;
        // Se a gente precisar fazer parse Float denovo
        const { data, error } = await supabase.from('ingredients').update({
            ...ingData,
            price: parseFloat(ingData.price)
        }).eq('id', id).select().single();
        if (error) {
            console.error('Error updating ingredient:', error);
            throw error;
        }
        return data;
    },

    updateIngredientStock: async (id, quantity, cost_price) => {
        const { data, error } = await supabase.from('ingredients').update({
            stock_quantity: parseInt(quantity),
            cost_price: parseFloat(cost_price)
        }).eq('id', id).select().single();
        if (error) {
            console.error('Error updating ingredient stock:', error);
            throw error;
        }
        return data;
    }
};
