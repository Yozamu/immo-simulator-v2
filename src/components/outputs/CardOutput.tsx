import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

interface CardOutputProps {
  title: string;
  description?: string;
  Component: React.FC;
}

const CardOutput: React.FC<CardOutputProps> = ({ title, description, Component }) => {
  return (
    <Card className="bg-slate-600 text-white p-2 h-fit">
      <CardTitle>{title}</CardTitle>
      <CardContent>
        <div className="w-96 h-96">
          <Component />
        </div>
      </CardContent>
      <CardDescription className="text-white">{description}</CardDescription>
    </Card>
  );
};

export default CardOutput;
