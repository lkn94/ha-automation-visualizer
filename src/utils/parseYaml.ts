import yaml from 'js-yaml';

export interface Automation {
  alias?: string;
  description?: string;
  trigger?: unknown[];
  condition?: unknown[];
  action?: unknown[];
}

export function parseAutomation(content: string): Automation {
  return yaml.load(content) as Automation;
}

export function automationToMermaid(a: Automation): string {
  const t = a.trigger ?? [];
  const c = a.condition ?? [];
  const act = a.action ?? [];
  const lines: string[] = ['flowchart TD'];

  lines.push('start([Start])');
  if (t.length) {
    lines.push('start --> trig');
    lines.push('trig>Trigger]:::trigger');
  } else {
    lines.push('start --> cond');
  }

  if (t.length) lines.push('trig --> cond');
  if (c.length) {
    lines.push('cond{Condition}:::condition');
  } else {
    lines.push('cond --> act');
  }

  if (c.length) lines.push('cond -->|true| act');
  lines.push('act>Action]:::action');
  lines.push('act --> end([End])');

  return lines.join('\n');
}
