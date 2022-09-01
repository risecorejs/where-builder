import _ from 'lodash'

import { IFields, IResult } from './interfaces/index'
import { TKeys } from './types'

/**
 * WHERE-BUILDER
 * @param query {IFields}
 * @param keys {TKeys}
 * @returns {IFields}
 */
export default function (query: IFields, keys: TKeys): IFields {
  const where: IFields = {}

  for (const key of keys) {
    // IS-STRING
    if (typeof key === 'string') {
      const whereKey_queryKey = key

      const { has, value } = getValueByQueryKey(query, whereKey_queryKey)

      if (has) {
        where[whereKey_queryKey] = value
      }
    }

    // IS-ARRAY
    else if (Array.isArray(key)) {
      // IS-2
      if (key.length === 2) {
        // IS-STRING
        if (typeof key[1] === 'string') {
          const [whereKey, queryKey] = key

          const { has, value } = getValueByQueryKey(query, queryKey)

          if (has) {
            where[whereKey] = value
          }
        }

        // IS-OBJECT
        else if (key[1].constructor === Object) {
          const [whereKey_queryKey, object] = key

          const { has } = getValueByQueryKey(query, whereKey_queryKey)

          if (has) {
            where[whereKey_queryKey] = object
          }
        }

        // IS-FUNCTION
        else if (typeof key[1] === 'function') {
          const [whereKey, handler] = key

          const { value } = getValueByQueryKey(query, whereKey)

          const result = handler(value)

          if (result !== void 0) {
            where[whereKey] = result
          }
        }
      }

      // IS-3
      else if (key.length === 3) {
        const [whereKey, queryKey, objectOrHandler] = key

        const { has, value } = getValueByQueryKey(query, queryKey)

        if (has) {
          // IS-OBJECT
          if (objectOrHandler.constructor === Object) {
            if (whereKey === null) {
              Object.assign(where, objectOrHandler)
            } else {
              where[whereKey] = objectOrHandler
            }
          }

          // IS-FUNCTION
          else if (typeof objectOrHandler === 'function') {
            const result = objectOrHandler(value)

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
    else if (key.constructor === Object) {
      Object.assign(where, key)
    }
  }

  return where
}

/**
 * GET-VALUE-BY-QUERY-KEY
 * @param query {object}
 * @param key {string}
 * @returns {{
 *   has: boolean,
 *   value: void|any
 * }}
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
