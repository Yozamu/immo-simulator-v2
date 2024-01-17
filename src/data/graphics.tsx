import TotalCost from '@/components/graphics/TotalCost';

const graphics = [
  { Graphic: TotalCost, description: 'Description', title: 'Faisabilité du projet', name: 'doable' },
  { Graphic: TotalCost, title: "Coût total de l'opération", name: 'totalCost' },
  { Graphic: TotalCost, description: 'Description', title: 'Montant du prêt restant', name: 'remainingLoan' },
  {
    Graphic: TotalCost,
    description: 'Description',
    title: 'Equivalence loyer (revente sans perte)',
    name: 'rentEquivalentNoLoss',
  },
];

export default graphics;
