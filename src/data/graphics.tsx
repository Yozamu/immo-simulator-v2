import MonthlyPayment from '@/components/graphics/MonthlyPayment';
import ProjectFeasibility from '@/components/graphics/ProjectFeasibility';
import QuotitiesAndLeftToLive from '@/components/graphics/QuotitiesAndLeftToLive';
import RemainingLoan from '@/components/graphics/RemainingLoan';
import RentEquivalentNoLoss from '@/components/graphics/RentEquivalentNoLoss';
import SavingsWithSpendings from '@/components/graphics/SavingsWithSpendings';
import Soulte from '@/components/graphics/Soulte';
import SpendingsFromProject from '@/components/graphics/SpendingsFromProject';
import TotalCost from '@/components/graphics/TotalCost';

const graphics = [
  { Component: ProjectFeasibility, title: 'Faisabilité du projet', name: 'doable' },
  { Component: MonthlyPayment, title: 'Paiement mensuel', name: 'monthlyPayment' },
  { Component: TotalCost, title: "Coût total de l'opération", name: 'totalCost' },
  { Component: RemainingLoan, title: 'Remboursement restant', name: 'remainingLoan' },
  {
    Component: RentEquivalentNoLoss,
    title: 'Equivalence loyer (revente sans perte)',
    name: 'rentEquivalentNoLoss',
  },
  { Component: SavingsWithSpendings, title: 'Epargne en fonction des dépenses', name: 'savingsWithSpendings' },
  { Component: SpendingsFromProject, title: 'Dépenses engendrées par le projet', name: 'spendingsFromProjects' },
  { Component: QuotitiesAndLeftToLive, title: 'Quotités et reste à vivre', name: 'quotitiesAndLeftToLive' },
  { Component: Soulte, title: 'Soulte', name: 'soulte' },
];

export default graphics;
