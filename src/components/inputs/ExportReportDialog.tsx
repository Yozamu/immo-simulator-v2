import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useMainStore from '@/store/store';
import { buildReportData, type ReportMeta, type ReportRegime } from '@/utils/reportData';
import { generateHtmlReport } from '@/utils/reportGenerator';

type ExportReportDialogProps = {
  open: boolean;
  onClose: () => void;
};

type RegimeChoice = 'nom-propre' | 'sci-is' | 'both';

const todayIso = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateFr = (iso: string): string => {
  const [yyyy, mm, dd] = iso.split('-');
  if (!yyyy || !mm || !dd) return iso;
  return `${dd}/${mm}/${yyyy}`;
};

const openReportTab = (html: string) => {
  const tab = window.open('', '_blank');
  if (!tab) {
    alert(
      "Impossible d'ouvrir le rapport : votre navigateur a bloqué la fenêtre. Autorisez les pop-ups pour ce site."
    );
    return;
  }
  tab.document.open();
  tab.document.write(html);
  tab.document.close();
};

const ExportReportDialog: React.FC<ExportReportDialogProps> = ({ open, onClose }) => {
  const inputValues = useMainStore((state) => state.inputValues);
  const filters = useMainStore((state) => state.filters);

  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [coBorrowerName, setCoBorrowerName] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(todayIso());
  const [regime, setRegime] = useState<RegimeChoice>('nom-propre');

  const hasCoBorrower = !!filters.hasCoBorrower;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleGenerate = () => {
    const meta: ReportMeta = {
      projectName: projectName.trim() || undefined,
      address: address.trim() || undefined,
      borrowerName: borrowerName.trim() || undefined,
      coBorrowerName: hasCoBorrower ? coBorrowerName.trim() || undefined : undefined,
      notes: notes.trim() || undefined,
      date: formatDateFr(date),
    };
    const data = buildReportData(inputValues, {
      hasCoBorrower,
      isLMNP: !!filters.isLMNP,
      hasGLI: !!filters.hasGLI,
      hasPropertyManagement: !!filters.hasPropertyManagement,
    });

    const regimes: ReportRegime[] =
      regime === 'both' ? ['nom-propre', 'sci-is'] : [regime as ReportRegime];

    regimes.forEach((r) => {
      const html = generateHtmlReport(data, meta, r);
      openReportTab(html);
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-slate-800 text-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-bold">Exporter le rapport</h3>
          <p className="text-xs text-slate-300 mt-1">
            Tous les champs sont optionnels. Le rapport s'ouvrira dans un nouvel onglet et lancera l'aperçu
            d'impression.
          </p>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-200" htmlFor="projectName">
              Nom du projet
            </label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="ex : Appartement Lyon Croix-Rousse"
              className="bg-slate-700 text-white border-slate-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-200" htmlFor="address">
              Adresse du bien
            </label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ex : 12 rue de la République, 69001 Lyon"
              className="bg-slate-700 text-white border-slate-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-200" htmlFor="borrowerName">
              Emprunteur
            </label>
            <Input
              id="borrowerName"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder="Nom Prénom"
              className="bg-slate-700 text-white border-slate-600"
            />
          </div>
          {hasCoBorrower && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-200" htmlFor="coBorrowerName">
                Co-emprunteur
              </label>
              <Input
                id="coBorrowerName"
                value={coBorrowerName}
                onChange={(e) => setCoBorrowerName(e.target.value)}
                placeholder="Nom Prénom"
                className="bg-slate-700 text-white border-slate-600"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-200" htmlFor="reportDate">
              Date du rapport
            </label>
            <Input
              id="reportDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-700 text-white border-slate-600"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-200" htmlFor="notes">
              Notes / contexte
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Stratégie, contexte familial, objectif patrimonial…"
              className="flex w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-200">Régime</span>
            <div className="flex flex-col gap-1">
              {(['nom-propre', 'sci-is', 'both'] as RegimeChoice[]).map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="regime"
                    value={opt}
                    checked={regime === opt}
                    onChange={() => setRegime(opt)}
                  />
                  <span>
                    {opt === 'nom-propre' && 'Nom propre (régime réel)'}
                    {opt === 'sci-is' && "SCI à l'IS"}
                    {opt === 'both' && 'Les deux (2 onglets)'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-700 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleGenerate}>Générer</Button>
        </div>
      </div>
    </div>
  );
};

export default ExportReportDialog;
