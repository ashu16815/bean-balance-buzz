
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import OrderItem from "@/components/OrderItem";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BaristaPage = () => {
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState("pending");
  
  // Filter and sort orders
  const pendingOrders = orders
    .filter(order => order.status === 'pending')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
  const preparingOrders = orders
    .filter(order => order.status === 'preparing')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
  const readyOrders = orders
    .filter(order => order.status === 'ready')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
  const completedOrders = orders
    .filter(order => order.status === 'completed' || order.status === 'cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return (
    <Layout requiresAuth allowedRoles={['barista', 'admin']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-coffee-dark">Barista Dashboard</h1>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingOrders.length > 0 && (
                <span className="absolute top-1 right-1 bg-coffee text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing">
              Preparing
              {preparingOrders.length > 0 && (
                <span className="absolute top-1 right-1 bg-coffee text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {preparingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready">
              Ready
              {readyOrders.length > 0 && (
                <span className="absolute top-1 right-1 bg-coffee text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {readyOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            {pendingOrders.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingOrders.map((order) => (
                  <OrderItem key={order.id} order={order} showActions />
                ))}
              </div>
            ) : (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No pending orders</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preparing" className="mt-6">
            {preparingOrders.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {preparingOrders.map((order) => (
                  <OrderItem key={order.id} order={order} showActions />
                ))}
              </div>
            ) : (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No orders being prepared</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ready" className="mt-6">
            {readyOrders.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {readyOrders.map((order) => (
                  <OrderItem key={order.id} order={order} showActions />
                ))}
              </div>
            ) : (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No orders ready for pickup</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedOrders.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedOrders.slice(0, 12).map((order) => (
                  <OrderItem key={order.id} order={order} showActions />
                ))}
              </div>
            ) : (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No completed orders</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BaristaPage;
