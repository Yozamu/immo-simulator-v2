import Filter from '@/components/filters/Filter';

const FILTERS = [
  { title: 'Project is doable', name: 'doable' },
  { title: 'Total cost', name: 'totalCost' },
  { title: 'Remaining loan', name: 'remainingLoan' },
];

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
