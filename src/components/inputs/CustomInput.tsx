import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown } from 'lucide-react';
import useMainStore from '@/store/store';

interface CustomInputProps {
  title: string;
  step?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({ title, step = 1 }) => {
  const { setInputValue, inputValues } = useMainStore();
  const value = inputValues[title];

  const updateValue = (newValue: number) => {
    setInputValue(title, newValue);
    console.log(newValue);
  };

  return (
    <div>
      <div className="flex p-2 gap-2 items-center">
        <strong>{title}</strong>
        <Input value={value} onChange={(e) => updateValue(+e.target.value)} />
        <Button onClick={() => updateValue(value + step)}>
          <ArrowUp />
        </Button>
        <Button onClick={() => updateValue(value - step)}>
          <ArrowDown />
        </Button>
      </div>
      <Slider defaultValue={[value]} value={[value]} onChange={(val) => console.log(val.currentTarget.textContent)} />
    </div>
  );
};

export default CustomInput;
