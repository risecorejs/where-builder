import express from 'express';
import { WhereOptions } from 'sequelize';
import { TKeys } from './types';
/**
 * MIDDLEWARE
 * @return {express.Handler}
 */
export default function (): express.Handler;
declare global {
    namespace Express {
        interface Request {
            whereBuilder(...keys: TKeys): WhereOptions;
        }
    }
}
