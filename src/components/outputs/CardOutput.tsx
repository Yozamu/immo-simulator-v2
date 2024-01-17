import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

interface CardOutputProps {
  title: string;
  description?: string;
  Graphic: React.FC;
}

const CardOutput: React.FC<CardOutputProps> = ({ title, description, Graphic }) => {
  return (
    <Card className="bg-slate-600 text-white">
      <CardTitle>{title}</CardTitle>
      <CardContent>
        <Graphic />
      </CardContent>
      <CardDescription className="text-white">{description}</CardDescription>
    </Card>
  );
};

export default CardOutput;
