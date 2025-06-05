# HA Automation Visualizer

Dieses Projekt visualisiert Home-Assistant-Automationen als Flussdiagramm.
Die YAML-Dateien liegen im Ordner `public/automations/` und werden
clientseitig geladen und mit [Mermaid](https://mermaid.js.org/) dargestellt.

## Entwicklung

```bash
npm install
npm run dev
```

## Deployment auf GitHub Pages

1. Stelle sicher, dass in `vite.config.ts` der Base-Pfad korrekt ist:
   ```ts
   export default defineConfig({
     base: '/ha-automation-visualizer/',
   })
   ```
2. Baue das Projekt und veröffentliche es auf dem Branch `gh-pages`:
   ```bash
   npm run deploy
   ```
3. Teste das gebaute Projekt lokal, um sicherzustellen, dass alle Pfade korrekt sind:
   ```bash
   npx serve dist
   ```

GitHub Pages kann anschließend aus dem Branch `gh-pages` die statische Seite
hosten.
