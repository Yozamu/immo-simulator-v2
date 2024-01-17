import React from 'react';
import CustomInput from './CustomInput';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const INPUTS = [
  { title: 'Prix du bien', name: 'price' },
  { title: 'Durée du prêt', name: 'loanDuration' },
  { title: 'Taux du prêt', name: 'loanRate' },
  { title: "Taux d'assurance", name: 'insuranceRate' },
];

const Inputs: React.FC = () => {
  return (
    <div className="bg-slate-600 p-2 min-h-full">
      <Accordion type="multiple" defaultValue={['main']}>
        <AccordionItem value="main">
          <AccordionTrigger>Informations principales</AccordionTrigger>
          <AccordionContent>
            {INPUTS.map((input) => (
              <CustomInput key={input.name} name={input.name} title={input.title} />
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="co">
          <AccordionTrigger>Co-emprunteur</AccordionTrigger>
          <AccordionContent>Todo</AccordionContent>
        </AccordionItem>
        <AccordionItem value="other">
          <AccordionTrigger>Autres informations</AccordionTrigger>
          <AccordionContent>Todo</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Inputs;
