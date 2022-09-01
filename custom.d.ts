import { TKeys } from './types'

declare global {
  namespace Express {
    export interface Request {
      whereBuilder(...keys: TKeys): object
    }
  }
}
