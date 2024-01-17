import CardOutput from '@/components/outputs/CardOutput';

const Outputs: React.FC = () => {
  return (
    <div className="bg-slate-500 flex flex-wrap gap-4 p-2">
      {Array.from({ length: 15 }).map((_, i) => (
        <CardOutput key={i} />
      ))}
    </div>
  );
};

export default Outputs;
