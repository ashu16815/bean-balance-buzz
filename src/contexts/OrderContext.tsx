
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { Order, OrderStatus, CoffeeType, MilkOption } from '../types/models';
import { useAuth } from './AuthContext';
import { supabase } from "@/integrations/supabase/client";

type OrderContextType = {
  orders: Order[];
  userOrders: Order[];
  pendingOrders: Order[];
  placeOrder: (coffeeType: CoffeeType, milkOption: MilkOption) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser, user } = useAuth();

  // Filter orders for the current user
  const userOrders = orders.filter(order => 
    user && order.userId === user.id
  );

  // Filter pending orders (for barista view)
  const pendingOrders = orders.filter(order => 
    ['pending', 'preparing'].includes(order.status)
  );
  
  // Load orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching orders:', error);
          return;
        }
        
        // Transform Supabase data to match our Order type
        const transformedOrders = data.map(order => ({
          id: order.id,
          userId: order.user_id,
          userName: order.user_id, // We'll update this below
          coffeeType: order.coffee_type as CoffeeType,
          milkOption: order.milk_option as MilkOption,
          status: order.status as OrderStatus,
          totalPrice: order.total_price,
          createdAt: new Date(order.created_at),
          updatedAt: new Date(order.updated_at)
        }));
        
        // Fetch user names for all orders
        if (transformedOrders.length > 0) {
          // Get unique user IDs
          const userIds = [...new Set(transformedOrders.map(order => order.userId))];
          
          // Fetch profiles for these users
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', userIds);
            
          if (!profilesError && profiles) {
            // Create a mapping of user ID to name
            const userNameMap = profiles.reduce((map, profile) => {
              map[profile.id] = profile.name;
              return map;
            }, {} as Record<string, string>);
            
            // Update order userName
            transformedOrders.forEach(order => {
              order.userName = userNameMap[order.userId] || 'Unknown User';
            });
          }
        }
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    
    fetchOrders();
    
    // Subscribe to changes on the orders table
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          fetchOrders();
        }
      )
      .subscribe();
      
    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [user]);

  // Poll for updates every 15 seconds (as a fallback)
  useEffect(() => {
    if (!user) return;
    
    // In a real app, this would be replaced by the real-time subscription above
    const interval = setInterval(() => {
      // Check if any user orders have been updated to "ready"
      const readyOrders = userOrders.filter(
        order => order.status === 'ready'
      );
      
      if (readyOrders.length > 0) {
        readyOrders.forEach(order => {
          // Only notify once
          toast.success(`Your ${order.coffeeType.name} is ready!`, {
            duration: 5000,
          });
        });
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [userOrders, user]);

  const placeOrder = async (coffeeType: CoffeeType, milkOption: MilkOption) => {
    if (!currentUser || !user) throw new Error('You must be logged in to place an order');
    
    // Calculate total price (coffee price + any milk extra cost)
    let totalPrice = coffeeType.price;
    if (milkOption === 'Oat' || milkOption === 'Almond') {
      totalPrice += 0.5; // Extra for non-dairy milk
    }
    
    // Check if user has enough credits
    if (currentUser.credits < totalPrice) {
      toast.error('Insufficient credits. Please top up your account.');
      throw new Error('Insufficient credits');
    }
    
    try {
      // Insert order into Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          coffee_type: coffeeType,
          milk_option: milkOption,
          status: 'pending',
          total_price: totalPrice
        })
        .select()
        .single();
        
      if (orderError) {
        toast.error('Failed to place order');
        throw orderError;
      }
      
      // Update user credits
      const newCredits = currentUser.credits - totalPrice;
      await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', user.id);
      
      // Use the updateUserCredits function from AuthContext
      await updateUserCredits(newCredits);
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
        
      if (error) {
        toast.error('Failed to update order status');
        throw error;
      }
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date() } 
            : order
        )
      );
      
      if (newStatus === 'ready') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          toast.success(`Order for ${order.userName} is ready!`);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateUserCredits = async (newCredits: number) => {
    if (!currentUser || !user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating user credits:', error);
    }
  };

  const value = {
    orders,
    userOrders,
    pendingOrders,
    placeOrder,
    updateOrderStatus
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
