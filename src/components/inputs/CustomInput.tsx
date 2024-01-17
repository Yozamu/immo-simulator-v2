import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown } from 'lucide-react';
import useMainStore from '@/store/store';

interface CustomInputProps {
  name: string;
  title: string;
  step?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({ name, title, step = 10 }) => {
  const setInputValue = useMainStore((state) => state.setInputValue);
  const value = useMainStore((state) => state.inputValues[name]);

  const updateValue = (newValue: number) => {
    setInputValue(name, +newValue.toFixed(2));
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex p-2 gap-2 items-center">
        <strong className="whitespace-nowrap">{title}</strong>
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
      <Slider defaultValue={[value]} value={[value]} step={step} onValueChange={(val) => updateValue(val[0])} />
    </div>
  );
};

export default CustomInput;
