import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const db = {
  exec: (_event, query: string) => ipcRenderer.invoke('db-exec', query),
  getFlips: () => ipcRenderer.invoke('db-get-flips')
}

const actions = {
  restartApp: () => ipcRenderer.invoke('restart-app')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('db', db)
    contextBridge.exposeInMainWorld('actions', actions)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.db = db
  // @ts-ignore (define in dts)
  window.actions = actions
}
