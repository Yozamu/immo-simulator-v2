import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown } from 'lucide-react';
import useMainStore from '@/store/store';

interface CustomInputProps {
  max?: number;
  min?: number;
  name: string;
  step?: number;
  title: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ max, min, name, title, step = 10 }) => {
  const setInputValue = useMainStore((state) => state.setInputValue);
  const value = useMainStore((state) => state.inputValues[name]);

  const updateValue = (newValue: number) => {
    setInputValue(name, +newValue.toFixed(2));
  };

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex p-2 gap-2 items-center">
        <label className="whitespace-nowrap">{title}</label>
        <Input
          className="text-black max-w-fit"
          type="number"
          step={step / 100}
          value={value}
          onChange={(e) => updateValue(+e.target.value)}
        />
        <Button className="p-2" onClick={() => updateValue(value + step / 10)}>
          <ArrowUp />
        </Button>
        <Button className="p-2" onClick={() => updateValue(value - step / 10)}>
          <ArrowDown />
        </Button>
      </div>
      <Slider
        defaultValue={[value]}
        max={max}
        min={min}
        value={[value]}
        step={step}
        onValueChange={(val) => updateValue(val[0])}
      />
    </div>
  );
};

export default CustomInput;
