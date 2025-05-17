
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { Order, OrderStatus, CoffeeType, MilkOption } from '../types/models';
import { useAuth } from './AuthContext';

type OrderContextType = {
  orders: Order[];
  userOrders: Order[];
  pendingOrders: Order[];
  placeOrder: (coffeeType: CoffeeType, milkOption: MilkOption) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
};

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser, updateUserCredits } = useAuth();

  // Filter orders for the current user
  const userOrders = orders.filter(order => 
    currentUser && order.userId === currentUser.id
  );

  // Filter pending orders (for barista view)
  const pendingOrders = orders.filter(order => 
    ['pending', 'preparing'].includes(order.status)
  );
  
  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('cafeOrders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt)
      }));
      setOrders(parsedOrders);
    }
  }, []);

  // Save orders to localStorage when they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('cafeOrders', JSON.stringify(orders));
    }
  }, [orders]);

  // Poll for updates every 15 seconds
  useEffect(() => {
    // In a real app, this would be a WebSocket or other real-time connection
    const interval = setInterval(() => {
      // Check if any user orders have been updated to "ready"
      const readyOrders = userOrders.filter(
        order => order.status === 'ready'
      );
      
      if (readyOrders.length > 0) {
        readyOrders.forEach(order => {
          // Only notify once by changing it to 'completed'
          if (order.status === 'ready') {
            toast.success(`Your ${order.coffeeType.name} is ready!`, {
              duration: 5000,
            });
            updateOrderStatus(order.id, 'completed');
          }
        });
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [userOrders]);

  const placeOrder = async (coffeeType: CoffeeType, milkOption: MilkOption) => {
    if (!currentUser) throw new Error('You must be logged in to place an order');
    
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      coffeeType,
      milkOption,
      status: 'pending',
      totalPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add order
    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    // Deduct credits
    updateUserCredits(currentUser.credits - totalPrice);
    
    toast.success('Order placed successfully!');
    return;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
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
