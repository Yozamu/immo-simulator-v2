import React from 'react';
import type { PropsWithChildren } from 'react';
import CustomInput from './CustomInput';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Filter from '@/components/filters/Filter';
import { Separator } from '@/components/ui/separator';
import inputs from '@/data/inputs';
import type { InputValue } from '@/types/commonTypes';
import useIsMobile from '@/hooks/useIsMobile';

const { mainInformation, coInformation, otherInformation, rentalInvestmentInformation } = inputs;

const rentalToggles = [
  { name: 'isLMNP', title: 'LMNP (amortissement 3%)' },
  { name: 'hasGLI', title: 'Garantie loyers impayés' },
  { name: 'hasPropertyManagement', title: 'Gestion locative (agence)' },
];

const InputsSectionItems = ({
  title,
  value,
  info,
  toggles,
}: {
  title: string;
  value: string;
  info: InputValue[];
  toggles?: { name: string; title: string }[];
}) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        {info.map((input) => (
          <CustomInput key={input.name} {...input} />
        ))}
        {toggles && toggles.length > 0 && (
          <>
            <Separator className="my-2" />
            {toggles.map((toggle) => (
              <Filter key={toggle.name} name={toggle.name} title={toggle.title} />
            ))}
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

const SingleAccordion: React.FC<{ defaultValue: string } & PropsWithChildren> = ({ defaultValue, children }) => {
  return (
    <Accordion type="single" defaultValue={defaultValue}>
      {children}
    </Accordion>
  );
};

const MultipleAccordion: React.FC<{ defaultValue: string[] } & PropsWithChildren> = ({ defaultValue, children }) => {
  return (
    <Accordion type="multiple" defaultValue={defaultValue}>
      {children}
    </Accordion>
  );
};

const Inputs: React.FC = () => {
  const isMobile = useIsMobile();

  const inputs = (
    <>
      <InputsSectionItems title="Informations principales" value="main" info={mainInformation} />
      <InputsSectionItems title="Co-emprunteur" value="co" info={coInformation} />
      <InputsSectionItems title="Autres informations" value="other" info={otherInformation} />
      <InputsSectionItems
        title="Investissement locatif"
        value="rental"
        info={rentalInvestmentInformation}
        toggles={rentalToggles}
      />
    </>
  );

  const accordion = isMobile ? (
    <MultipleAccordion defaultValue={[]}>{inputs}</MultipleAccordion>
  ) : (
    <SingleAccordion defaultValue="main">{inputs}</SingleAccordion>
  );

  return <div className="bg-slate-600 p-2 min-h-full whitespace-nowrap">{accordion}</div>;
};

export default Inputs;
