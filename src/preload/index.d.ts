import { ElectronAPI } from '@electron-toolkit/preload'
import { DatabaseApi } from '../types/databaseApi'
import { ActionsApi } from 'src/types/actionsApi'

declare global {
  interface Window {
    electron: ElectronAPI
    db: DatabaseApi
    actions: ActionsApi
  }
}
