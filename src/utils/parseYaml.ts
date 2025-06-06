import yaml from 'js-yaml'

export interface Automation {
  alias?: string
  description?: string
  trigger?: unknown[]
  condition?: unknown[]
  action?: unknown[]
}

export function parseAutomation(content: string): Automation {
  const data = yaml.load(content) as Record<string, unknown> | undefined
  if (!data) return {}

  const automation: Automation = {}
  if (typeof data.alias === 'string') automation.alias = data.alias
  if (typeof data.description === 'string') automation.description = data.description

  const trig =
    (data.trigger as unknown) ??
    (data.triggers as unknown)
  if (trig !== undefined) automation.trigger = Array.isArray(trig) ? trig : [trig]

  const cond =
    (data.condition as unknown) ??
    (data.conditions as unknown)
  if (cond !== undefined) automation.condition = Array.isArray(cond) ? cond : [cond]

  const act =
    (data.action as unknown) ??
    (data.actions as unknown)
  if (act !== undefined) automation.action = Array.isArray(act) ? act : [act]

  return automation
}

function summarizeTrigger(t: unknown): string {
  if (t && typeof t === 'object') {
    const obj = t as Record<string, unknown>
    const platform = obj.platform ?? obj.trigger ?? obj.type
    if (platform) {
      const details = Object.entries(obj)
        .filter(([k]) => k !== 'platform' && k !== 'trigger' && k !== 'type')
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')
      const name = String(platform)
      return details ? `${name} ${details}` : name
    }
  }
  return JSON.stringify(t)
}

function summarizeCondition(c: unknown): string {
  if (c && typeof c === 'object' && 'condition' in (c as any)) {
    const obj = c as Record<string, unknown>
    const type = String(obj.condition)
    const details = Object.entries(obj)
      .filter(([k]) => k !== 'condition')
      .map(([k, v]) => `${k}=${v}`)
      .join('\n')
    return details ? `${type}\n${details}` : type
  }
  return JSON.stringify(c)
}

function summarizeAction(a: unknown): string {
  if (a && typeof a === 'object') {
    const obj = a as Record<string, unknown>
    const service = obj.service ?? obj.action
    if (service) {
      let label = String(service)
      if (typeof obj.target === 'object') {
        const target = Object.entries(obj.target as Record<string, unknown>)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')
        if (target) label += `\n${target}`
      }
      if (typeof obj.data === 'object') {
        const data = Object.entries(obj.data as Record<string, unknown>)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')
        if (data) label += `\n${data}`
      }
      return label
    }
    if ('choose' in obj) {
      const choices = Array.isArray(obj.choose) ? obj.choose : []
      const lines: string[] = ['choose']
      choices.forEach((ch, idx) => {
        const c = (ch as any).conditions ?? []
        const cond = c.map(summarizeCondition).join(' && ')
        const seq = ((ch as any).sequence ?? [])
          .map((act: unknown) => summarizeAction(act))
          .join(' -> ')
        lines.push(`${idx + 1}: ${cond} => ${seq}`)
      })
      if (Array.isArray(obj.default)) {
        const seq = obj.default
          .map((act: unknown) => summarizeAction(act))
          .join(' -> ')
        lines.push(`default => ${seq}`)
      }
      return lines.join('\n')
    }
  }
  return JSON.stringify(a)
}

function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
}

export function automationToMermaid(a: Automation): string {
  const t =
    (a.trigger as unknown[] | undefined) ??
    ((a as any).triggers as unknown[] | undefined) ??
    []
  const c =
    (a.condition as unknown[] | undefined) ??
    ((a as any).conditions as unknown[] | undefined) ??
    []
  const act =
    (a.action as unknown[] | undefined) ??
    ((a as any).actions as unknown[] | undefined) ??
    []
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
