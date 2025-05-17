
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MilkOption, MILK_PRICES } from "@/types/models";

type MilkOptionsProps = {
  selectedMilk: MilkOption;
  onSelectMilk: (milk: MilkOption) => void;
};

const MilkOptions = ({ selectedMilk, onSelectMilk }: MilkOptionsProps) => {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="font-medium mb-3">Milk Options</h3>
      <RadioGroup value={selectedMilk} onValueChange={(value) => onSelectMilk(value as MilkOption)}>
        {MILK_PRICES.map((milk) => (
          <div key={milk.option} className="flex items-center space-x-2 py-1">
            <RadioGroupItem value={milk.option} id={`milk-${milk.option}`} />
            <Label htmlFor={`milk-${milk.option}`} className="flex justify-between w-full">
              <span>{milk.option}</span>
              {milk.extraCost > 0 && (
                <span className="text-muted-foreground text-sm">+{milk.extraCost} credit</span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MilkOptions;
