import { useEffect, useState } from 'react';

export interface AutomationInfo {
  file: string;
  title: string;
  description?: string;
}

interface Props {
  onSelect: (info: AutomationInfo) => void;
}

export default function AutomationList({ onSelect }: Props) {
  const [list, setList] = useState<AutomationInfo[]>([]);

  useEffect(() => {
    fetch('automations/automations.json')
      .then((res) => res.json())
      .then((data) => setList(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Automationen</h1>
      <ul className="space-y-2">
        {list.map((item) => (
          <li
            key={item.file}
            className="p-4 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onSelect(item)}
          >
            <h2 className="text-xl font-semibold">{item.title}</h2>
            {item.description && <p className="text-sm opacity-80">{item.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
