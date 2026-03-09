import { supabase } from '../lib/supabase';

export const stock_db = {
    getStockItems: async () => {
        const { data, error } = await supabase
            .from('stock')
            .select('*')
            .order('name');
        
        if (error) {
            console.error('Error fetching stock items:', error);
            return [];
        }
        return data || [];
    },

    addStockItem: async (name, quantity, cost_price) => {
        const { data, error } = await supabase
            .from('stock')
            .insert([{ 
                name, 
                stock_quantity: parseInt(quantity), 
                cost_price: parseFloat(cost_price) 
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding stock item:', error);
            throw error;
        }
        return data;
    },

    updateStockItem: async (id, quantity, cost_price) => {
        const { data, error } = await supabase
            .from('stock')
            .update({ 
                stock_quantity: parseInt(quantity), 
                cost_price: parseFloat(cost_price) 
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating stock item:', error);
            throw error;
        }
        return data;
    },

    deleteStockItem: async (id) => {
        const { error } = await supabase
            .from('stock')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting stock item:', error);
            throw error;
        }
    }
};
