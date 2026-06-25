import { Separator } from '@/components/ui/separator';
import useSciIsCalculations from '@/hooks/useSciIsCalculations';
import useMainStore from '@/store/store';

const SciIsInvestmentDetails = () => {
  const {
    depreciation,
    accountingFeesAnnual,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    firstYearInterest,
    taxableProfit,
    rawTaxableProfit,
    corporateTax,
    annualCashflow,
    annualTaxRealRegime,
    taxSavingsVsRealRegime,
  } = useSciIsCalculations();
  const tmi = useMainStore((state) => state.inputValues.tmi);

  const isDeficit = rawTaxableProfit <= 0;
  const savingsPositive = taxSavingsVsRealRegime >= 0;

  const copro = Math.round(nonRecoverableCoproAnnual);
  const tf = Math.round(propertyTaxNetOfTom);
  const pno = Math.round(pnoAnnual);
  const interests = Math.round(firstYearInterest);
  const fees = Math.round(accountingFeesAnnual);
  const totalDeductibles = copro + tf + pno + interests + fees;
  const bati = Math.round(depreciation.building);
  const notary = Math.round(depreciation.notary);
  const totalDepreciation = Math.round(depreciation.total);

  return (
    <div className="text-left flex flex-col gap-1 pt-2 text-sm">
      <h4 className="font-bold">Amortissements annuels</h4>
      <label>
        Total : <strong>{totalDepreciation}€</strong>
      </label>
      <span className="text-xs opacity-80 pl-1">
        Bâti (85% / 30 ans) {bati}€ + Notaire (sur durée prêt) {notary}€
      </span>
      <Separator className="my-2" />
      <h4 className="font-bold">Charges déductibles annuelles</h4>
      <label>
        Total : <strong>{totalDeductibles}€</strong>
      </label>
      <span className="text-xs opacity-80 pl-1">
        Copro {copro}€ + TF {tf}€ + PNO {pno}€ + Intérêts an1 {interests}€ + Compta {fees}€
      </span>
      <Separator className="my-2" />
      <h4 className="font-bold">Fiscalité IS</h4>
      <label>
        Bénéfice imposable : <strong>{Math.round(taxableProfit)}€</strong>
        {isDeficit && <span className="text-xs opacity-80 text-green-400"> (déficit reportable)</span>}
      </label>
      <label>
        Impôt sur les sociétés : <strong>{Math.round(corporateTax)}€</strong>
      </label>
      <span className="text-xs opacity-80 pl-1">15% jusqu'à 42 500€, 25% au-delà</span>
      <Separator className="my-2" />
      <h4 className="font-bold">Comparaison nom propre (régime réel)</h4>
      <label>
        Impôt équivalent en nom propre : <strong>{Math.round(annualTaxRealRegime)}€</strong>
      </label>
      <span className="text-xs opacity-80 pl-1">
        TMI {tmi}% + prélèvements sociaux 17,2%, sans amortissement
      </span>
      <label>
        Économie SCI IS vs nom propre :{' '}
        <strong className={savingsPositive ? 'text-green-500' : 'text-red-500'}>
          {savingsPositive ? '+' : ''}
          {Math.round(taxSavingsVsRealRegime)}€/an
        </strong>
      </label>
      <Separator className="my-2" />
      <label>
        Cashflow annuel après IS :{' '}
        <strong className={annualCashflow >= 0 ? 'text-green-500' : 'text-red-500'}>
          {annualCashflow >= 0 ? '+' : ''}
          {Math.round(annualCashflow)}€
        </strong>
      </label>
    </div>
  );
};

export default SciIsInvestmentDetails;
