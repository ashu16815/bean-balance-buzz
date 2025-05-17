
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CoffeeType } from "@/types/models";
import { cn } from "@/lib/utils";

type CoffeeCardProps = {
  coffee: CoffeeType;
  selected: boolean;
  onSelect: () => void;
};

const CoffeeCard = ({ coffee, selected, onSelect }: CoffeeCardProps) => {
  return (
    <Card 
      className={cn(
        "coffee-card transition-all cursor-pointer", 
        selected ? "border-coffee ring-2 ring-coffee/50" : "hover:border-coffee/30"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{coffee.name}</CardTitle>
          <div className="text-2xl">{coffee.image}</div>
        </div>
        <CardDescription>{coffee.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {coffee.price === 1 ? "1 credit" : `${coffee.price} credits`}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant={selected ? "default" : "outline"} 
          className={selected ? "w-full" : "w-full border-coffee/30 text-coffee"}
        >
          {selected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoffeeCard;
