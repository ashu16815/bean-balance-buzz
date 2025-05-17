
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import CoffeeCard from "@/components/CoffeeCard";
import MilkOptions from "@/components/MilkOptions";
import OrderDetails from "@/components/OrderDetails";
import { useOrders } from "@/contexts/OrderContext";
import { CoffeeType, COFFEE_TYPES, MilkOption } from "@/types/models";
import { toast } from "sonner";

const OrderPage = () => {
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);
  const [selectedMilk, setSelectedMilk] = useState<MilkOption>("Regular");
  const navigate = useNavigate();
  const { placeOrder } = useOrders();

  const handleCoffeeSelect = (coffee: CoffeeType) => {
    setSelectedCoffee(coffee);
  };

  const handleMilkSelect = (milk: MilkOption) => {
    setSelectedMilk(milk);
  };

  const handleOrderSubmit = async () => {
    if (!selectedCoffee) {
      toast.error("Please select a coffee first");
      return;
    }

    try {
      await placeOrder(selectedCoffee, selectedMilk);
      navigate("/my-orders");
    } catch (error) {
      // Error is handled in the OrderContext
    }
  };

  return (
    <Layout requiresAuth>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-coffee-dark">Order Coffee</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Select Your Coffee</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COFFEE_TYPES.map((coffee) => (
                <CoffeeCard
                  key={coffee.id}
                  coffee={coffee}
                  selected={selectedCoffee?.id === coffee.id}
                  onSelect={() => handleCoffeeSelect(coffee)}
                />
              ))}
            </div>
            
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-4">Milk Options</h2>
              <MilkOptions
                selectedMilk={selectedMilk}
                onSelectMilk={handleMilkSelect}
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <OrderDetails
              selectedCoffee={selectedCoffee}
              selectedMilk={selectedMilk}
              onOrderSubmit={handleOrderSubmit}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;
