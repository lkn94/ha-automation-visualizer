import yaml from 'js-yaml'

export interface Automation {
  alias?: string
  description?: string
  trigger?: unknown[]
  condition?: unknown[]
  action?: unknown[]
}

export function parseAutomation(content: string): Automation {
  const data = yaml.load(content) as Automation | undefined
  return data ?? {}
}

function summarizeTrigger(t: unknown): string {
  if (t && typeof t === 'object' && 'platform' in (t as any)) {
    const obj = t as Record<string, unknown>
    const platform = String(obj.platform)
    const details = Object.entries(obj)
      .filter(([k]) => k !== 'platform')
      .map(([k, v]) => `${k}=${v}`)
      .join(', ')
    return details ? `${platform} ${details}` : platform
  }
  return JSON.stringify(t)
}

function summarizeCondition(c: unknown): string {
  if (c && typeof c === 'object' && 'condition' in (c as any)) {
    return String((c as any).condition)
  }
  return JSON.stringify(c)
}

function summarizeAction(a: unknown): string {
  if (a && typeof a === 'object' && 'service' in (a as any)) {
    return String((a as any).service)
  }
  return JSON.stringify(a)
}

function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
}

export function automationToMermaid(a: Automation): string {
  const t = a.trigger ?? []
  const c = a.condition ?? []
  const act = a.action ?? []
  const lines: string[] = ['flowchart TD']

  lines.push('classDef trigger fill:#FEF3C7')
  lines.push('classDef condition fill:#DBEAFE')
  lines.push('classDef action fill:#D1FAE5')

  lines.push('start([Start])')
  let last = 'start'
  t.forEach((item, i) => {
    const id = `trig${i}`
    lines.push(`${last} --> ${id}["${esc(summarizeTrigger(item))}"]:::trigger`)
    last = id
  })

  lines.push(`${last} --> cond`)
  last = 'cond'

  c.forEach((item, i) => {
    const id = `cond${i}`
    const label = esc(summarizeCondition(item))
    if (i === 0) {
      lines.push(`${last}{${label}}:::condition`)
    } else {
      lines.push(`${last} --> ${id}{${label}}:::condition`)
      last = id
    }
  })

  act.forEach((item, i) => {
    const id = `act${i}`
    lines.push(`${last} --> ${id}["${esc(summarizeAction(item))}"]:::action`)
    last = id
  })

  lines.push(`${last} --> finish([End])`)

  return lines.join('\n')
}
