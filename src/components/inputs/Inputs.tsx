import React from 'react';
import CustomInput from './CustomInput';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import inputs from '@/data/inputs';
import { Switch } from '@/components/ui/switch';

const { mainInformation, coInformation, otherInformation } = inputs;

const Inputs: React.FC = () => {
  return (
    <div className="bg-slate-600 p-2 min-h-full">
      <Accordion type="multiple" defaultValue={['main']}>
        <AccordionItem value="main">
          <AccordionTrigger>Informations principales</AccordionTrigger>
          <AccordionContent>
            {mainInformation.map((input) => (
              <CustomInput key={input.name} {...input} />
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="co">
          <AccordionTrigger>Co-emprunteur</AccordionTrigger>
          <AccordionContent>
            <Switch name="co" title="Co-emprunteur" />
            {coInformation.map((input) => (
              <CustomInput key={input.name} {...input} />
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="other">
          <AccordionTrigger>Autres informations</AccordionTrigger>
          <AccordionContent>
            {otherInformation.map((input) => (
              <CustomInput key={input.name} {...input} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Inputs;
