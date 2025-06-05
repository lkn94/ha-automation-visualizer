import yaml from 'js-yaml';

export interface Automation {
  alias?: string;
  description?: string;
  trigger?: unknown[];
  condition?: unknown[];
  action?: unknown[];
}

export function parseAutomation(content: string): Automation {
  const data = yaml.load(content) as Automation | undefined;
  return data ?? {};
}

export function automationToMermaid(a: Automation): string {
  const t = a.trigger ?? [];
  const c = a.condition ?? [];
  const act = a.action ?? [];
  const lines: string[] = ['flowchart TD'];

  lines.push('start([Start])');
  if (t.length) {
    lines.push('start --> trig[Trigger]:::trigger');
    lines.push('trig --> cond');
  } else {
    lines.push('start --> cond');
  }

  if (c.length) {
    lines.push('cond{Condition}:::condition');
    lines.push('cond -->|true| act[Action]:::action');
  } else {
    lines.push('cond --> act[Action]:::action');
  }

  lines.push('act --> finish([End])');

  return lines.join('\n');
}
