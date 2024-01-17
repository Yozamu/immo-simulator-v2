import React from 'react';
import CustomInput from './CustomInput';

const INPUTS = [
  { title: 'Prix du bien', name: 'price' },
  { title: 'Durée du prêt', name: 'loanDuration' },
  { title: 'Taux du prêt', name: 'loanRate' },
  { title: "Taux d'assurance", name: 'insuranceRate' },
];

const Inputs: React.FC = () => {
  return (
    <div className="bg-slate-600">
      {INPUTS.map((input) => (
        <CustomInput key={input.name} name={input.name} title={input.title} />
      ))}
    </div>
  );
};

export default Inputs;
