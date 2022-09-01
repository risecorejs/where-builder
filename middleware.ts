import express from 'express'

import { TKeys } from './types'
import whereBuilder from './index'

/**
 * MIDDLEWARE
 * @return {express.Handler}
 */
export default function (): express.Handler {
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    req.whereBuilder = (...keys: TKeys) => {
      if (Array.isArray(keys[0])) {
        keys = <TKeys>keys[0]
      }

      return whereBuilder(req.query, keys)
    }

    next()
  }
}
