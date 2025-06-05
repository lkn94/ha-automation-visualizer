import { useState } from 'react';
import AutomationList, { AutomationInfo } from './components/AutomationList';
import AutomationViewer from './components/AutomationViewer';
import './App.css';

export default function App() {
  const [selected, setSelected] = useState<AutomationInfo | null>(null);

  return (
    <div className="container mx-auto p-4">
      {!selected ? (
        <AutomationList onSelect={setSelected} />
      ) : (
        <AutomationViewer info={selected} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}
