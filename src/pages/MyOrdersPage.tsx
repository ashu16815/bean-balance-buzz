
import { useEffect } from "react";
import Layout from "@/components/Layout";
import OrderItem from "@/components/OrderItem";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MyOrdersPage = () => {
  const { userOrders } = useOrders();
  
  // Sort orders by creation date (newest first)
  const sortedOrders = [...userOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Active orders are those that are pending, preparing, or ready
  const activeOrders = sortedOrders.filter(
    order => ['pending', 'preparing', 'ready'].includes(order.status)
  );
  
  // Past orders are those that are completed or cancelled
  const pastOrders = sortedOrders.filter(
    order => ['completed', 'cancelled'].includes(order.status)
  );

  return (
    <Layout requiresAuth>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-coffee-dark">My Orders</h1>
          <Button className="bg-coffee hover:bg-coffee-dark" asChild>
            <Link to="/order">Order New Coffee</Link>
          </Button>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Active Orders</h2>
          {activeOrders.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/40 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No active orders</p>
              <Button className="mt-4 bg-coffee hover:bg-coffee-dark" asChild>
                <Link to="/order">Order Coffee</Link>
              </Button>
            </div>
          )}
        </div>
        
        {pastOrders.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Past Orders</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastOrders.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyOrdersPage;
