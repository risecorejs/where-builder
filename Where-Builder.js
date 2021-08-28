module.exports = class WhereBuilder {
  #query
  #abstractions

  where = {}

  constructor(query, abstractions) {
    this.#query = query
    this.#abstractions = abstractions
  }

  #getQueryValue(key) {
    const value = this.#query[key]

    if (value === void 0) return
    if (typeof value !== 'string') throw TypeError('Expected string')

    return value
  }

  #methods = [
    {
      Type: String,
      method(str) {
        // 'whereKeyQueryKey'
        const data = this.#getQueryValue(str)

        if (data) this.where[str] = data
      }
    },
    {
      Type: Array,
      method(arr) {
        if (arr.length === 2) {
          // ['whereKey', 'queryKey']
          if (typeof arr[1] === 'string') {
            const [whereKey, queryKey] = arr

            const data = this.#getQueryValue(queryKey)

            if (data) this.where[whereKey] = data

            return
          }

          // ['whereKeyQueryKey', Object]
          if (arr[1].constructor === Object) {
            const [whereKeyQueryKey, obj] = arr

            if (this.#getQueryValue(whereKeyQueryKey)) {
              this.where[whereKeyQueryKey] = obj
            }

            return
          }

          // ['whereKey', Function]
          if (typeof arr[1] === 'function') {
            const [whereKey, func] = arr

            const result = func()

            if (result !== void 0 && result !== '') {
              this.where[whereKey] = result
            }

            return
          }

          return
        }

        // ['whereKey' || null, 'queryKey', Object || Function]
        if (arr.length === 3) {
          const [whereKey, queryKey, objOrFunc] = arr

          if (!this.#getQueryValue(queryKey)) return

          if (objOrFunc.constructor === Object) {
            if (whereKey === null) {
              Object.assign(this.where, objOrFunc)
            } else {
              this.where[whereKey] = objOrFunc
            }

            return
          }

          if (typeof objOrFunc === 'function') {
            const result = objOrFunc()

            if (result === void 0 && result === '') return

            if (whereKey === null) {
              Object.assign(this.where, result)
            } else {
              this.where[whereKey] = result
            }
          }
        }
      }
    },
    {
      Type: Object,
      method(obj) {
        Object.assign(this.where, obj)
      }
    }
  ]

  run() {
    if (!this.#abstractions.length) return

    for (const abstraction of this.#abstractions) {
      for (const { Type, method } of this.#methods) {
        if (abstraction.constructor !== Type) continue

        method.call(this, abstraction)

        break
      }
    }
  }
}
