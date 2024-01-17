import Filter from '@/components/filters/Filter';
import graphics from '@/data/graphics';

const FILTERS = graphics.map((graphic) => ({ title: graphic.title, name: graphic.name }));

const Filters: React.FC = () => {
  return (
    <div className="bg-slate-600 min-h-full">
      <div>Todo filters</div>
      {FILTERS.map((filter) => (
        <Filter key={filter.name} name={filter.name} title={filter.title} />
      ))}
    </div>
  );
};

export default Filters;
