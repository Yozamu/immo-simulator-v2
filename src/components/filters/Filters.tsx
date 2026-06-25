import { RotateCcw } from 'lucide-react';
import Filter from '@/components/filters/Filter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import filters from '@/data/filters';
import useMainStore from '@/store/store';

const { baseFilters, graphicsFilters } = filters;

const Filters: React.FC = () => {
  const reset = useMainStore((state) => state.reset);

  const handleReset = () => {
    if (window.confirm('Réinitialiser toutes les valeurs et tous les filtres ?')) {
      reset();
    }
  };

  return (
    <div className="bg-slate-600 min-h-full">
      <div className="flex items-center gap-2 p-2">
        <h2 className="font-bold">Filtres</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleReset}
          title="Réinitialiser toutes les valeurs"
          aria-label="Réinitialiser toutes les valeurs"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
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
