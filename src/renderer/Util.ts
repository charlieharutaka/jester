import { ipcRenderer } from 'electron'

export function runJest(project: string) {
  ipcRenderer.send('exec', project)
}
