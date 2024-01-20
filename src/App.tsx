import './App.css';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable';
import Inputs from '@/components/inputs/Inputs';
import Outputs from '@/components/outputs/Outputs';
import Filters from '@/components/filters/Filters';

function App() {
  return (
    <>
      <ResizablePanelGroup className="min-h-[100vh]" direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={5} maxSize={30}>
          <Inputs />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Outputs />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={5} minSize={5} maxSize={20}>
          <Filters />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default App;
