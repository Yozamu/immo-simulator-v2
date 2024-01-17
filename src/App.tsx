import './App.css';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable';
import Inputs from '@/components/inputs/Inputs';
import Outputs from '@/components/outputs/Outputs';
import Filters from '@/components/filters/Filters';

function App() {
  return (
    <>
      <h1 className="bg-slate-700">Simulateur de projet immobilier</h1>
      <ResizablePanelGroup className="min-h-[100vh]" direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={5} maxSize={30}>
          <Inputs />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Outputs />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={10} minSize={5} maxSize={30}>
          <Filters />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default App;
