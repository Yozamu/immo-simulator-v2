import MonthlyPayment from '@/components/graphics/MonthlyPayment';
import RemainingLoan from '@/components/graphics/RemainingLoan';
import RentEquivalentNoLoss from '@/components/graphics/RentEquivalentNoLoss';
import TotalCost from '@/components/graphics/TotalCost';

const graphics = [
  { Component: TotalCost, title: 'Faisabilité du projet', name: 'doable' },
  { Component: MonthlyPayment, title: 'Paiement mensuel', name: 'monthlyPayment' },
  { Component: TotalCost, title: "Coût total de l'opération", name: 'totalCost' },
  { Component: RemainingLoan, title: 'Remboursement restant', name: 'remainingLoan' },
  {
    Component: RentEquivalentNoLoss,
    title: 'Equivalence loyer (revente sans perte)',
    name: 'rentEquivalentNoLoss',
  },
];

export default graphics;
