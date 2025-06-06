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
      <div className="flex items-center space-x-2">
        <button
          onClick={onBack}
          className="text-yellow-400 hover:text-yellow-300"
          aria-label="Zurück"
        >
          &larr;
        </button>
        <h2 className="text-xl font-bold">{info.title}</h2>
      </div>
      {info.description && (
        <p className="opacity-80">{info.description}</p>
      )}
      <pre className="bg-black text-white p-4 overflow-auto">
        <code>{yamlText}</code>
      </pre>
      <DiagramRenderer definition={mermaidDef} />
    </div>
  )
}
