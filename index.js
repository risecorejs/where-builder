"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
/**
 * WHERE-BUILDER
 * @param query {IFields}
 * @param keys {TKeys}
 * @returns {object}
 */
function default_1(query, keys) {
    const where = {};
    for (const key of keys) {
        // IS-STRING
        if (typeof key === 'string') {
            const whereKeyQueryKey = key;
            const { has, value } = getValueByQueryKey(query, whereKeyQueryKey);
            if (has) {
                where[whereKeyQueryKey] = value;
            }
        }
        // IS-ARRAY
        else if (Array.isArray(key)) {
            // IS-2
            if (key.length === 2) {
                // IS-STRING
                if (typeof key[1] === 'string') {
                    const [whereKey, queryKey] = key;
                    const { has, value } = getValueByQueryKey(query, queryKey);
                    if (has) {
                        where[whereKey] = value;
                    }
                }
                // IS-OBJECT
                else if (typeof key[1] === 'object' && key[1].constructor === Object) {
                    const [whereKeyQueryKey, obj] = key;
                    const { has } = getValueByQueryKey(query, whereKeyQueryKey);
                    if (has) {
                        where[whereKeyQueryKey] = obj;
                    }
                }
                // IS-FUNCTION
                else if (typeof key[1] === 'function') {
                    const [whereKeyQueryKey, func] = key;
                    const { value } = getValueByQueryKey(query, whereKeyQueryKey);
                    const result = func(value);
                    if (result !== void 0) {
                        where[whereKeyQueryKey] = result;
                    }
                }
            }
            // IS-3
            else if (key.length === 3) {
                const [whereKey, queryKey, objOrFunc] = key;
                const { has, value } = getValueByQueryKey(query, queryKey);
                if (has) {
                    // IS-OBJECT
                    if (typeof objOrFunc === 'object' && objOrFunc.constructor === Object) {
                        if (whereKey === null || whereKey === void 0) {
                            Object.assign(where, objOrFunc);
                        }
                        else {
                            where[whereKey] = objOrFunc;
                        }
                    }
                    // IS-FUNCTION
                    else if (typeof objOrFunc === 'function') {
                        const result = objOrFunc(value);
                        if (result !== void 0) {
                            if (whereKey === null) {
                                Object.assign(where, result);
                            }
                            else {
                                where[whereKey] = result;
                            }
                        }
                    }
                }
            }
        }
        // IS-OBJECT
        else if (typeof key === 'object' && key.constructor === Object) {
            Object.assign(where, key);
        }
    }
    return where;
}
exports.default = default_1;
/**
 * GET-VALUE-BY-QUERY-KEY
 * @param query {IFields}
 * @param key {string}
 * @returns {IResult}
 */
function getValueByQueryKey(query, key) {
    const result = {
        has: false,
        value: query[key]
    };
    if (result.value?.length ||
        ['number', 'boolean'].includes(typeof result.value) ||
        result.value === null ||
        (result.value?.constructor === Object && !lodash_1.default.isEmpty(result.value))) {
        result.has = true;
    }
    return result;
}
