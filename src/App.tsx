import { useState } from 'react';
import AutomationList, { AutomationInfo } from './components/AutomationList';
import AutomationViewer from './components/AutomationViewer';
import './App.css';

export default function App() {
  const [selected, setSelected] = useState<AutomationInfo | null>(null);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-4 flex justify-between items-center border-b border-yellow-600 pb-2">
        <a href="/" className="text-xl font-bold no-underline text-yellow-400">
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
      <div className="relative min-h-[200px]">
        <div
          className={`transition-opacity duration-500 ${selected ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`}
        >
          <AutomationList onSelect={setSelected} />
        </div>
        <div
          className={`transition-opacity duration-500 ${selected ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
        >
          {selected && (
            <AutomationViewer info={selected} onBack={() => setSelected(null)} />
          )}
        </div>
      </div>
      <footer className="text-sm mt-8 border-t border-yellow-600 pt-4 text-center opacity-80">
        Beim mit * gekennzeichneten Link handelt es sich um einen Affiliate-Link.
        Ich erhalte eine Provision, für Dich entstehen keine Mehrkosten.
        <br />
        <a
          href="https://hobbyblogging.de/impressum"
          target="_blank"
          rel="noopener noreferrer"
        >
          Impressum
        </a>
      </footer>
    </div>
  );
}
