import _ from 'lodash'

import { IFields, IResult } from './interfaces/index'
import { TKeys } from './types'

/**
 * WHERE-BUILDER
 * @param query {IFields}
 * @param keys {TKeys}
 * @returns {object}
 */
export default function (query: IFields, keys: TKeys): object {
  const where: IFields = {}

  for (const key of keys) {
    // IS-STRING
    if (typeof key === 'string') {
      const whereKeyQueryKey = <string>key

      const { has, value } = getValueByQueryKey(query, whereKeyQueryKey)

      if (has) {
        where[whereKeyQueryKey] = value
      }
    }

    // IS-ARRAY
    else if (Array.isArray(key)) {
      // IS-2
      if (key.length === 2) {
        // IS-STRING
        if (typeof key[1] === 'string') {
          const [whereKey, queryKey] = <[string, string]>key

          const { has, value } = getValueByQueryKey(query, queryKey)

          if (has) {
            where[whereKey] = value
          }
        }

        // IS-OBJECT
        else if (typeof key[1] === 'object' && key[1].constructor === Object) {
          const [whereKeyQueryKey, obj] = <[string, object]>key

          const { has } = getValueByQueryKey(query, whereKeyQueryKey)

          if (has) {
            where[whereKeyQueryKey] = obj
          }
        }

        // IS-FUNCTION
        else if (typeof key[1] === 'function') {
          const [whereKeyQueryKey, func] = <[string, (val: any) => any]>key

          const { value } = getValueByQueryKey(query, whereKeyQueryKey)

          const result = func(value)

          if (result !== void 0) {
            where[whereKeyQueryKey] = result
          }
        }
      }

      // IS-3
      else if (key.length === 3) {
        const [whereKey, queryKey, objOrFunc] = <[string, string, object | ((val: any) => any)]>key

        const { has, value } = getValueByQueryKey(query, queryKey)

        if (has) {
          // IS-OBJECT
          if (typeof objOrFunc === 'object' && objOrFunc.constructor === Object) {
            if (whereKey === null || whereKey === void 0) {
              Object.assign(where, objOrFunc)
            } else {
              where[whereKey] = objOrFunc
            }
          }

          // IS-FUNCTION
          else if (typeof objOrFunc === 'function') {
            const result = objOrFunc(value)

            if (result !== void 0) {
              if (whereKey === null) {
                Object.assign(where, result)
              } else {
                where[whereKey] = result
              }
            }
          }
        }
      }
    }

    // IS-OBJECT
    else if (typeof key === 'object' && key.constructor === Object) {
      Object.assign(where, key)
    }
  }

  return where
}

/**
 * GET-VALUE-BY-QUERY-KEY
 * @param query {IFields}
 * @param key {string}
 * @returns {IResult}
 */
function getValueByQueryKey(query: IFields, key: string): IResult {
  const result: IResult = {
    has: false,
    value: query[key]
  }

  if (
    result.value?.length ||
    ['number', 'boolean'].includes(typeof result.value) ||
    result.value === null ||
    (result.value?.constructor === Object && !_.isEmpty(result.value))
  ) {
    result.has = true
  }

  return result
}
