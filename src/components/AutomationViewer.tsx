import { useEffect, useState } from 'react'
import DiagramRenderer from './DiagramRenderer'
import { AutomationInfo } from './AutomationList'
import { automationToMermaid, parseAutomation } from '../utils/parseYaml'

interface Props {
  info: AutomationInfo;
  onBack: () => void;
}

export default function AutomationViewer({ info, onBack }: Props) {
  const [yamlText, setYamlText] = useState('')

  useEffect(() => {
    fetch(`automations/${info.file}`)
      .then((res) => res.text())
      .then((text) => setYamlText(text));
  }, [info.file]);

  const automation = parseAutomation(yamlText);
  const mermaidDef = automationToMermaid(automation);

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="underline">Zurück</button>
      <h2 className="text-xl font-bold">{info.title}</h2>
      {info.description && (
        <p className="opacity-80">{info.description}</p>
      )}
      <pre className="bg-gray-200 dark:bg-gray-800 p-4 overflow-auto">
        <code>{yamlText}</code>
      </pre>
      <DiagramRenderer definition={mermaidDef} />
    </div>
  )
}
