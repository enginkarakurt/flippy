import { ElectronAPI } from '@electron-toolkit/preload'
import { DatabaseApi } from '../types/databaseApi'

declare global {
  interface Window {
    electron: ElectronAPI
    db: DatabaseApi
  }
}
