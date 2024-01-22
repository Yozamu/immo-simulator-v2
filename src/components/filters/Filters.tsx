import Filter from '@/components/filters/Filter';
import { Separator } from '@/components/ui/separator';
import filters from '@/data/filters';

const { baseFilters, graphicsFilters } = filters;

const Filters: React.FC = () => {
  return (
    <div className="bg-slate-600 min-h-full">
      <h2 className="font-bold">Filtres</h2>
      {baseFilters.map((filter) => (
        <Filter key={filter.name} name={filter.name} title={filter.title} />
      ))}
      <Separator />
      {graphicsFilters.map((filter) => (
        <Filter key={filter.name} name={filter.name} title={filter.title} />
      ))}
    </div>
  );
};

export default Filters;
