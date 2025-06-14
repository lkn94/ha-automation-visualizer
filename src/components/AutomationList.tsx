import { useEffect, useState } from 'react';

export interface AutomationInfo {
  file: string;
  title: string;
  description?: string;
  affiliate?: string;
  category: string;
}

interface Props {
  onSelect: (info: AutomationInfo) => void;
}

export default function AutomationList({ onSelect }: Props) {
  const [list, setList] = useState<AutomationInfo[]>([]);

  useEffect(() => {
    fetch('automations/automations.json')
      .then((res) => res.json())
      .then((data) => {
        const withCat = data.map((item: Omit<AutomationInfo, 'category'>) => {
          const [category = 'Sonstiges'] = item.file.split('_');
          return { ...item, category } as AutomationInfo;
        });
        setList(withCat);
      });
  }, []);

  const groups = list.reduce<Record<string, AutomationInfo[]>>((acc, item) => {
    acc[item.category] = acc[item.category] || []
    acc[item.category].push(item)
    return acc
  }, {})

  const categories = Object.keys(groups).sort((a, b) =>
    a.localeCompare(b, 'de', { sensitivity: 'base' })
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Automationen</h1>
      <p className="mb-4 opacity-90">
        Hier findest du YAML-Automationen aus Home Assistant, die anschaulich
        visualisiert werden.
      </p>
      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{cat}</h2>
          <ul className="space-y-2">
            {groups[cat]
              .slice()
              .sort((a, b) =>
                a.title.localeCompare(b.title, 'de', { sensitivity: 'base' })
              )
              .map((item) => (
              <li key={item.file}>
                <a
                  href={`?automation=${encodeURIComponent(item.file)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(item);
                  }}
                  className="block p-4 border border-blue-800 rounded cursor-pointer hover:bg-blue-900 hover:border-yellow-500 transition-colors no-underline"
                >
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm opacity-80">{item.description}</p>
                  )}
                </a>
              </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
