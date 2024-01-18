import React from 'react';
import CustomInput from './CustomInput';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import inputs from '@/data/inputs';
import type { InputValue } from '@/types/commonTypes';

const { mainInformation, coInformation, otherInformation } = inputs;

const InputsSectionItems = ({ title, value, info }: { title: string; value: string; info: InputValue[] }) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        {info.map((input) => (
          <CustomInput key={input.name} {...input} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

const Inputs: React.FC = () => {
  return (
    <div className="bg-slate-600 p-2 min-h-full whitespace-nowrap">
      <Accordion type="single" defaultValue={'main'}>
        <InputsSectionItems title="Informations principales" value="main" info={mainInformation} />
        <InputsSectionItems title="Co-emprunteur" value="co" info={coInformation} />
        <InputsSectionItems title="Autres informations" value="other" info={otherInformation} />
      </Accordion>
    </div>
  );
};

export default Inputs;
