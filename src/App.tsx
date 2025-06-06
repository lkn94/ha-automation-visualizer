import { useEffect, useState } from 'react';
import AutomationList, { AutomationInfo } from './components/AutomationList';
import AutomationViewer from './components/AutomationViewer';
import './App.css';

export default function App() {
  const [selected, setSelected] = useState<AutomationInfo | null>(null);

  useEffect(() => {
    const loadFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const file = params.get('automation');
      if (file) {
        fetch('automations/automations.json')
          .then((res) => res.json())
          .then((data) => {
            const found = data.find((item: AutomationInfo) => item.file === file);
            if (found) {
              const [category = 'Sonstiges'] = found.file.split('_');
              setSelected({ ...found, category });
            }
          });
      } else {
        setSelected(null);
      }
    };

    loadFromUrl();
    window.addEventListener('popstate', loadFromUrl);
    return () => window.removeEventListener('popstate', loadFromUrl);
  }, []);

  const handleSelect = (info: AutomationInfo) => {
    setSelected(info);
    const params = new URLSearchParams();
    params.set('automation', info.file);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  };

  const handleBack = () => {
    setSelected(null);
    window.history.pushState({}, '', window.location.pathname);
  };

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
          <AutomationList onSelect={handleSelect} />
        </div>
        <div
          className={`transition-opacity duration-500 ${selected ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
        >
          {selected && (
            <AutomationViewer info={selected} onBack={handleBack} />
          )}
        </div>
      </div>
      <footer className="text-sm mt-8 border-t border-yellow-600 pt-4 text-center opacity-80">
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
