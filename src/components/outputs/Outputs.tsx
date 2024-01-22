import CardOutput from '@/components/outputs/CardOutput';
import graphics from '@/data/graphics';
import useIsMobile from '@/hooks/useIsMobile';
import useMainStore from '@/store/store';

const Outputs: React.FC = () => {
  const filters = useMainStore((state) => state.filters);
  const filteredOutputs = graphics.filter((output) => filters[output.name]);
  const isMobile = useIsMobile();

  return (
    <div
      className={`bg-slate-500 flex gap-4 min-h-full ${
        isMobile ? 'overflow-scroll' : 'flex-wrap p-2 justify-center content-start'
      }`}
    >
      {filteredOutputs.map((card) => (
        <CardOutput key={card.name} {...card} />
      ))}
    </div>
  );
};

export default Outputs;
