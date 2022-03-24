module.exports = (query, abstractions) => {
  const where = {}

  for (const abstraction of abstractions) {
    if (typeof abstraction === 'string') {
      const whereKey_queryKey = abstraction

      if (query[whereKey_queryKey]?.length) {
        where[whereKey_queryKey] = query[whereKey_queryKey]
      }
    } else if (Array.isArray(abstraction)) {
      switch (abstraction.length) {
        case 2:
          {
            const secondElement = abstraction[1]

            if (typeof secondElement === 'string') {
              const [whereKey, queryKey] = abstraction

              if (query[queryKey]?.length) {
                where[whereKey] = query[queryKey]
              }
            } else if (secondElement.constructor === Object) {
              const [whereKey_queryKey, object] = abstraction

              if (query[whereKey_queryKey]?.length) {
                where[whereKey_queryKey] = object
              }
            } else if (typeof secondElement === 'function') {
              const [whereKey, handler] = abstraction

              const result = handler(query[whereKey])

              if (result !== void 0) {
                where[whereKey] = result
              }
            }
          }
          break

        case 3:
          const [whereKey, queryKey, objectOrHandler] = abstraction

          if (query[queryKey]?.length) {
            if (objectOrHandler.constructor === Object) {
              if (whereKey === null) {
                Object.assign(where, objectOrHandler)
              } else {
                where[whereKey] = objectOrHandler
              }
            } else if (typeof objectOrHandler === 'function') {
              const result = objectOrHandler(query[queryKey])

              if (result !== void 0) {
                if (whereKey === null) {
                  Object.assign(where, result)
                } else {
                  where[whereKey] = result
                }
              }
            }
          }
          break
      }
    } else if (abstraction.constructor === Object) {
      Object.assign(where, abstraction)
    }
  }

  return where
}
