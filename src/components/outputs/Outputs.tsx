import CardOutput from '@/components/outputs/CardOutput';
import graphics from '@/data/graphics';
import useMainStore from '@/store/store';

const Outputs: React.FC = () => {
  const filters = useMainStore((state) => state.filters);
  const filteredOutputs = graphics.filter((output) => filters[output.name]);

  return (
    <div className="bg-slate-500 flex flex-wrap gap-4 p-2 justify-center content-start min-h-full">
      {filteredOutputs.map((card, i) => (
        <CardOutput key={i} {...card} />
      ))}
    </div>
  );
};

export default Outputs;
