import express from 'express'

import { WhereOptions } from 'sequelize'

import whereBuilder from './index'

import { TKeys } from './types'

/**
 * MIDDLEWARE
 * @return {express.Handler}
 */
export default function (): express.Handler {
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    req.whereBuilder = (...keys: TKeys): WhereOptions => {
      if (Array.isArray(keys[0])) {
        keys = <TKeys>keys[0]
      }

      return whereBuilder(req.query, keys)
    }

    next()
  }
}

declare global {
  namespace Express {
    export interface Request {
      whereBuilder(...keys: TKeys): WhereOptions
    }
  }
}
