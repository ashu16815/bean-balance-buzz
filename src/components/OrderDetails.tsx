
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CoffeeType, MilkOption, MILK_PRICES } from "@/types/models";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type OrderDetailsProps = {
  selectedCoffee: CoffeeType | null;
  selectedMilk: MilkOption;
  onOrderSubmit: () => void;
};

const OrderDetails = ({ selectedCoffee, selectedMilk, onOrderSubmit }: OrderDetailsProps) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const milkExtraCost = MILK_PRICES.find(milk => milk.option === selectedMilk)?.extraCost || 0;
  
  const totalCost = selectedCoffee ? selectedCoffee.price + milkExtraCost : 0;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API call
      onOrderSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="coffee-card">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Selected Coffee:</span>
            <span className="font-medium">{selectedCoffee?.name || 'None'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Milk Type:</span>
            <span className="font-medium">{selectedMilk}</span>
          </div>
          
          {milkExtraCost > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Extra for {selectedMilk}:</span>
              <span>+{milkExtraCost} credit</span>
            </div>
          )}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-medium">
              <span>Total Cost:</span>
              <span>{totalCost} {totalCost === 1 ? 'credit' : 'credits'}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Your Balance:</span>
            <span className={`font-medium ${
              (currentUser?.credits || 0) < totalCost ? 'text-destructive' : 'text-green-600'
            }`}>
              {currentUser?.credits || 0} {(currentUser?.credits || 0) === 1 ? 'credit' : 'credits'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full bg-coffee hover:bg-coffee-dark"
          disabled={
            !selectedCoffee || 
            isSubmitting || 
            (currentUser?.credits || 0) < totalCost
          }
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Place Order${(currentUser?.credits || 0) < totalCost ? ' (Insufficient Credits)' : ''}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderDetails;
