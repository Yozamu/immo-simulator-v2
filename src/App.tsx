import './App.css';
import { Button } from './components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable';
import Inputs from '@/components/inputs/Inputs';
import Outputs from '@/components/outputs/Outputs';
import Filters from '@/components/filters/Filters';

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <Button onClick={() => alert('ok')}>text</Button>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Inputs />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Outputs />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Filters />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default App;
