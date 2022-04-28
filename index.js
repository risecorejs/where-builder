const _ = require('lodash')

/**
 * WHERE-BUILDER
 * @param query {Object}
 * @param abstractions {any[]}
 * @returns {Object}
 */
module.exports = (query, abstractions) => {
  const where = {}

  for (const abstraction of abstractions) {
    if (typeof abstraction === 'string') {
      const whereKey_queryKey = abstraction

      const { has, value } = getValueByQueryKey(query, whereKey_queryKey)

      if (has) {
        where[whereKey_queryKey] = value
      }
    } else if (Array.isArray(abstraction)) {
      if (abstraction.length === 2) {
        const secondElement = abstraction[1]

        if (typeof secondElement === 'string') {
          const [whereKey, queryKey] = abstraction

          const { has, value } = getValueByQueryKey(query, queryKey)

          if (has) {
            where[whereKey] = value
          }
        } else if (secondElement.constructor === Object) {
          const [whereKey_queryKey, object] = abstraction

          const { has } = getValueByQueryKey(query, whereKey_queryKey)

          if (has) {
            where[whereKey_queryKey] = object
          }
        } else if (typeof secondElement === 'function') {
          const [whereKey, handler] = abstraction

          const { value } = getValueByQueryKey(query, whereKey)

          const result = handler(value)

          if (result !== void 0) {
            where[whereKey] = result
          }
        }
      } else if (abstraction.length === 3) {
        const [whereKey, queryKey, objectOrHandler] = abstraction

        const { has, value } = getValueByQueryKey(query, queryKey)

        if (has) {
          if (objectOrHandler.constructor === Object) {
            if (whereKey === null) {
              Object.assign(where, objectOrHandler)
            } else {
              where[whereKey] = objectOrHandler
            }
          } else if (typeof objectOrHandler === 'function') {
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
    } else if (abstraction.constructor === Object) {
      Object.assign(where, abstraction)
    }
  }

  return where
}

/**
 * GET-VALUE-BY-QUERY-KEY
 * @param query {Object}
 * @param key {string}
 * @returns {{
 *   has: boolean,
 *   value: void|any
 * }}
 */
function getValueByQueryKey(query, key) {
  const result = {
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
