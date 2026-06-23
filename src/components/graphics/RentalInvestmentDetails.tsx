import { Separator } from '@/components/ui/separator';
import useRentalCalculations from '@/hooks/useRentalCalculations';

const RentalInvestmentDetails = () => {
  const {
    tmi,
    annualCashflow,
    savingsEffort,
    taxableIncome,
    annualTax,
    pnoAnnual,
    vacancyCost,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    firstYearInterest,
  } = useRentalCalculations();

  return (
    <div className="text-left flex flex-col gap-1 pt-2 text-sm">
      <h4 className="font-bold">Charges annuelles déductibles</h4>
      <label>
        Copro non-récupérable : <strong>{Math.round(nonRecoverableCoproAnnual)}€</strong>
      </label>
      <label>
        Taxe foncière hors TOM : <strong>{Math.round(propertyTaxNetOfTom)}€</strong>
      </label>
      <label>
        PNO estimée : <strong>{pnoAnnual}€</strong>
      </label>
      <label>
        Intérêts 1ère année : <strong>{Math.round(firstYearInterest)}€</strong>
      </label>
      <Separator className="my-2" />
      <h4 className="font-bold">Fiscalité (régime réel)</h4>
      <label>
        Revenu foncier imposable : <strong>{Math.round(taxableIncome)}€</strong>
      </label>
      <label>
        Impôts estimés : <strong>{Math.round(annualTax)}€</strong>
        <span className="text-xs opacity-80"> (TMI {tmi}% + 17.2%)</span>
      </label>
      <Separator className="my-2" />
      <h4 className="font-bold">Cashflow & risques</h4>
      <label>
        Cashflow annuel :{' '}
        <strong className={annualCashflow >= 0 ? 'text-green-500' : 'text-red-500'}>
          {annualCashflow >= 0 ? '+' : ''}
          {Math.round(annualCashflow)}€
        </strong>
      </label>
      <label>
        Effort d'épargne mensuel : <strong>{savingsEffort > 0 ? `${savingsEffort}€` : '0€'}</strong>
      </label>
      <label>
        Coût vacance (1 mois) : <strong>{vacancyCost}€</strong>
      </label>
    </div>
  );
};

export default RentalInvestmentDetails;
