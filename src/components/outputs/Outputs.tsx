import TotalCost from '@/components/graphics/TotalCost';
import CardOutput from '@/components/outputs/CardOutput';
import useMainStore from '@/store/store';

const OUTPUTS = [
  { Graphic: TotalCost, description: 'Description', title: 'Title', name: 'totalCost' },
  { Graphic: TotalCost, title: 'Title', name: 'totalCost' },
  { Graphic: TotalCost, description: 'Description', title: 'Title', name: 'totalCost' },
  { Graphic: TotalCost, description: 'Description', title: 'Title', name: 'totalCost' },
];

const Outputs: React.FC = () => {
  const filters = useMainStore((state) => state.filters);
  const filteredOutputs = OUTPUTS.filter((output) => filters[output.name]);

  return (
    <div className="bg-slate-500 flex flex-wrap gap-4 p-2 justify-center min-h-full">
      {filteredOutputs.map((card, i) => (
        <CardOutput key={i} {...card} />
      ))}
    </div>
  );
};

export default Outputs;
