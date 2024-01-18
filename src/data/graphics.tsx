import MonthlyPayment from '@/components/graphics/MonthlyPayment';
import TotalCost from '@/components/graphics/TotalCost';

const graphics = [
  { Component: TotalCost, title: 'Faisabilité du projet', name: 'doable' },
  { Component: MonthlyPayment, title: 'Paiement mensuel', name: 'doable' },
  { Component: TotalCost, title: "Coût total de l'opération", name: 'totalCost' },
  { Component: TotalCost, title: 'Montant du prêt restant', name: 'remainingLoan' },
  {
    Component: TotalCost,
    title: 'Equivalence loyer (revente sans perte)',
    name: 'rentEquivalentNoLoss',
  },
];

export default graphics;
