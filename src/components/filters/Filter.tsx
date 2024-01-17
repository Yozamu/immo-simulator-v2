import { Switch } from '@/components/ui/switch';
import useMainStore from '@/store/store';

interface FilterProps {
  name: string;
  title: string;
}

const Filter: React.FC<FilterProps> = ({ name, title }) => {
  const setFilterValue = useMainStore((state) => state.setFilterValue);
  const value = useMainStore((state) => state.filters[name]);

  return (
    <div className="p-2 flex items-center gap-2 whitespace-nowrap">
      <Switch checked={value} onCheckedChange={() => setFilterValue(name, !value)} />
      <label>{title}</label>
    </div>
  );
};

export default Filter;
