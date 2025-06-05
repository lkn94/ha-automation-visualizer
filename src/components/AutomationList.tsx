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
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Automationen</h1>
      {Object.entries(groups).map(([cat, items]) => (
        <div key={cat} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{cat}</h2>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.file}
                className="p-4 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => onSelect(item)}
              >
                <h3 className="text-lg font-medium">{item.title}</h3>
                {item.description && (
                  <p className="text-sm opacity-80">{item.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
