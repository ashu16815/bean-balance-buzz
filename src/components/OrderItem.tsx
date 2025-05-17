
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { formatDistanceToNow } from "date-fns";

type OrderItemProps = {
  order: Order;
  showActions?: boolean;
};

const OrderItem = ({ order, showActions = false }: OrderItemProps) => {
  const { currentUser } = useAuth();
  const { updateOrderStatus } = useOrders();
  
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true });
  
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30';
      case 'preparing': return 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30';
      case 'ready': return 'bg-green-500/20 text-green-700 hover:bg-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-700 hover:bg-gray-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-700 hover:bg-red-500/30';
      default: return 'bg-gray-500/20';
    }
  };
  
  // Handle updating order status (for barista/admin)
  const handleUpdateStatus = (status: OrderStatus) => {
    updateOrderStatus(order.id, status);
  };
  
  return (
    <Card className="coffee-card">
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">{order.coffeeType.name}</h3>
            <p className="text-sm text-muted-foreground">
              {order.milkOption} milk
            </p>
          </div>
          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-1 text-sm">
          {showActions && (
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{order.userName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-mono text-xs opacity-70">{order.id.substring(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between font-medium mt-2 pt-2 border-t">
            <span>Cost:</span>
            <span>{order.totalPrice} {order.totalPrice === 1 ? 'credit' : 'credits'}</span>
          </div>
        </div>
      </CardContent>
      
      {showActions && currentUser?.role !== 'customer' && order.status !== 'completed' && order.status !== 'cancelled' && (
        <CardFooter className="flex gap-2 flex-wrap">
          {order.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={() => handleUpdateStatus('preparing')}
            >
              Start Preparing
            </Button>
          )}
          {(order.status === 'pending' || order.status === 'preparing') && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              onClick={() => handleUpdateStatus('ready')}
            >
              Mark Ready
            </Button>
          )}
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => handleUpdateStatus('cancelled')}
            >
              Cancel
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderItem;
