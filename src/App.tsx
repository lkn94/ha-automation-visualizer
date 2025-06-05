import { useState } from 'react';
import AutomationList, { AutomationInfo } from './components/AutomationList';
import AutomationViewer from './components/AutomationViewer';
import './App.css';

export default function App() {
  const [selected, setSelected] = useState<AutomationInfo | null>(null);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-4 flex justify-between items-center border-b pb-2">
        <a href="/" className="text-xl font-bold no-underline">
          HA YAML Visualizer
        </a>
        <span>
          Ein Projekt von{' '}
          <a
            href="https://hobbyblogging.de"
            className="font-bold no-underline"
          >
            hobbyblogging.de
          </a>
        </span>
      </header>
      {!selected ? (
        <AutomationList onSelect={setSelected} />
      ) : (
        <AutomationViewer info={selected} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}
