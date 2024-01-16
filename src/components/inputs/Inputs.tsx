import React from 'react';
import CustomInput from './CustomInput';

const Inputs: React.FC = () => {
  return (
    <div className="bg-slate-500">
      <CustomInput title="Foo" />
      <CustomInput title="Bar" />
      <CustomInput title="Test" />
    </div>
  );
};

export default Inputs;
