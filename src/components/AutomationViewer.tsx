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
      <button onClick={onBack} className="underline text-yellow-400 hover:text-yellow-300">Zurück</button>
      <h2 className="text-xl font-bold">{info.title}</h2>
      {(info.description || info.affiliate) && (
        <div className="md:flex md:items-center md:justify-between">
          {info.description && (
            <p className="opacity-80">{info.description}</p>
          )}
          {info.affiliate && (
            <p className="mt-2 md:mt-0 md:ml-4">
              <a
                href={info.affiliate}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-500 text-blue-900 px-4 py-2 rounded-md hover:bg-yellow-400"
              >
                Jetzt Produkt entdecken
              </a>
              <span className="ml-1">*</span>
            </p>
          )}
        </div>
      )}
      <pre className="bg-gray-200 dark:bg-gray-800 p-4 overflow-auto">
        <code>{yamlText}</code>
      </pre>
      <DiagramRenderer definition={mermaidDef} />
    </div>
  )
}
