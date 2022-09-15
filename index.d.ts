import { WhereOptions } from 'sequelize';
import { IFields } from './interfaces/index';
import { TKeys } from './types';
/**
 * WHERE-BUILDER
 * @param query {IFields}
 * @param keys {TKeys}
 * @return {WhereOptions}
 */
export default function (query: IFields, keys: TKeys): WhereOptions;
