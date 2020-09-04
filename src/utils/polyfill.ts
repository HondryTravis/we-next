/**
 * @discription IE浏览器不支持matches,assign,includes函数,所以在这里手动实现以下
 * @author maxinwei
 */

//element.matches的polyfill, for IE
if (!Element.prototype.matches) {
    Element.prototype.matches = function (s) {
        const matches: NodeListOf<Element> = this.ownerDocument.querySelectorAll(s)
        let i: number = matches.length
        for (i; i >= 0; i--) {
            if (matches.item(i) === this) break
        }
        return i > -1
    }
}

//string.includes function的polyfill, for IE
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict'
        if (typeof start !== 'number') {
            start = 0
        }
        if (start + search.length > this.length) {
            return false
        } else {
            return this.indexOf(search, start) !== -1
        }
    }
}

// object.assign function 的 polyfill, for IE
if (typeof Object.assign !== 'function') {
    Object.assign = function (...target: object[]): object {
        if (target === null) {
            throw new TypeError('Cannot convert undefined or null to object')
        }

        target = Object(target)
        for (let index: number = 1; index < arguments.length; index++) {
            const source: object = arguments[index]
            if (source !== null) {
                for (let key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key]
                    }
                }
            }
        }
        return target
    }
}

// array.includes function 的 polyfill, for IE
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (valueToFind: string, fromIndex: number) {
            if (this === null) {
                throw new TypeError('"this" is null or not defined')
            }

            const o: string[] = Object(this)
            const len: number = o.length >>> 0 //无符号移位，移动0位并非没有意义，根据JS特性，在移位之前会将非number数据转换为number，将小数转换为整数，将负数转为正数。

            // 3. If len is 0, return false.
            if (len === 0) {
                return false
            }

            const n: number = fromIndex | 0

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            let k: number = Math.max(n >= 0 ? n : len - Math.abs(n), 0) //确定起始搜索位置arr[k]

            function sameValueZero(x: string, y: string): boolean {
                return (
                    x === y ||
                    (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y))
                )
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(valueToFind, elementK) is true, return true.
                if (sameValueZero(o[k], valueToFind)) {
                    return true
                }
                k++
            }
            return false
        },
    })
}
