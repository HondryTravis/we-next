/**
 * @description 工具函数集合
 * @author wangfupeng
 */

import { type } from 'jquery'
import { values } from 'lodash'

/**
 * 判断当前浏览器是什么或者版本号
 * @param getVersion true时获取版本否则返回浏览器( 'ie' | 'firefox' | 'chrome' | 'opera' | 'safari')
 * @author liuwei
 */
export function getBrowser(
    getVersion: boolean = false
): undefined | string | 'ie' | 'firefox' | 'chrome' | 'opera' | 'safari' {
    // 定义对象接口类型
    interface ieVeriosn {
        [values: string]: number
    }
    const ua_str: string = navigator.userAgent.toLowerCase()

    let trident: string | undefined
    let match_str: string | null | RegExpMatchArray
    let ie_aer_rv: string | 0
    let browser_chi_Type: string | undefined
    let ie_Tridents: ieVeriosn = {
        'trident/7.0': 11,
        'trident/6.0': 10,
        'trident/5.0': 9,
        'trident/4.0': 8,
    }
    //判断IE 浏览器,
    if ('ActiveXObject' in self) {
        // ie_aer_rv:  指示IE 的版本.
        // It can be affected by the current document mode of IE.
        ie_aer_rv = (match_str = ua_str.match(/msie ([\d.]+)/))
            ? match_str[1]
            : (match_str = ua_str.match(/rv:([\d.]+)/))
            ? match_str[1]
            : 0
        // ie: Indicate the really version of current IE browser.

        //匹配 ie8, ie11, edge
        trident = (match_str = ua_str.match(/(trident\/[\d.]+|edge\/[\d.]+)/))
            ? match_str[1]
            : undefined
        if (trident) {
            browser_chi_Type = (ie_Tridents[trident] || ie_aer_rv) > 0 ? 'ie' : undefined
        }
    } else {
        //判断 windows edge 浏览器
        // match_str[1]: 返回浏览器及版本号,如: "edge/13.10586"
        // match_str[1]: 返回版本号,如: "edge"
        browser_chi_Type = (match_str = ua_str.match(/edge\/([\d.]+)/))
            ? 'ie'
            : //判断firefox 浏览器
            (match_str = ua_str.match(/firefox\/([\d.]+)/))
            ? 'firefox'
            : //判断chrome 浏览器
            (match_str = ua_str.match(/chrome\/([\d.]+)/))
            ? 'chrome'
            : //判断opera 浏览器
            (match_str = ua_str.match(/opera.([\d.]+)/))
            ? 'opera'
            : //判断safari 浏览器
            (match_str = ua_str.match(/version\/([\d.]+).*safari/))
            ? 'safari'
            : undefined
    }
    //返回浏览器类型和版本号
    let verStr: string | undefined
    let verNum: number | string | null
    verNum = trident && ie_Tridents[trident] ? ie_Tridents[trident] : match_str && match_str[1]
    verStr = getVersion ? browser_chi_Type + '/' + verNum : browser_chi_Type
    return verStr
}

// 和 UA 相关的属性
export const UA = {
    _ua: navigator.userAgent,

    // 是否 webkit
    isWebkit: function () {
        const reg = /webkit/i
        return reg.test(this._ua)
    },

    // 是否 IE
    isIE: function () {
        return 'ActiveXObject' in window
    },
}

/**
 * 获取随机石
 * @param prefix 前缀
 */
export function getRandom(prefix: string = ''): string {
    return prefix + Math.random().toString().slice(2)
}

/**
 * 替换 html 特殊字符
 * @param html html 字符串
 */
export function replaceHtmlSymbol(html: string): string {
    return html
        .replace(/</gm, '&lt;')
        .replace(/>/gm, '&gt;')
        .replace(/"/gm, '&quot;')
        .replace(/(\r\n|\r|\n)/g, '<br/>')
}

export function replaceSpecialSymbol(value: string) {
    return value
        .replace(/&lt;/gm, '<')
        .replace(/&gt;/gm, '>')
        .replace(/&quot;/gm, '"')
}

/**
 * 遍历对象或数组，执行回调函数
 * @param obj 对象或数组
 * @param fn 回调函数 (key, val) => {...}
 */
export function forEach(obj: Object | [], fn: Function): void {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const result = fn(key, (obj as any)[key])
            if (result === false) {
                // 提前终止循环
                break
            }
        }
    }
}

/**
 * 遍历类数组
 * @param fakeArr 类数组
 * @param fn 回调函数
 */
export function arrForEach(fakeArr: any, fn: Function): void {
    let i, item, result
    const length = fakeArr.length || 0
    for (i = 0; i < length; i++) {
        item = fakeArr[i]
        result = fn.call(fakeArr, item, i)
        if (result === false) {
            break
        }
    }
}

/**
 * 节流
 * @param fn 函数
 * @param interval 间隔时间，毫秒
 */
export function throttle(fn: Function, interval: number = 200): Function {
    let flag = false
    return function (...args: any): void {
        if (!flag) {
            flag = true
            setTimeout(() => {
                flag = false
                fn.call(null, ...args) // this 报语法错误，先用 null
            }, interval)
        }
    }
}

/**
 * 防抖
 * @param fn 函数
 * @param delay 间隔时间，毫秒
 */
export function debounce(fn: Function, delay: number = 200): Function {
    let lastFn = 0
    return function (...args: any) {
        if (lastFn) {
            window.clearTimeout(lastFn)
        }
        lastFn = window.setTimeout(() => {
            lastFn = 0
            fn.call(null, ...args) // this 报语法错误，先用 null
        }, delay)
    }
}

/**
 * isFunction 是否是函数
 * @param fn 函数
 */
export function isFunction(fn: any) {
    return typeof fn === 'function'
}

/**
 * 引用与非引用值 深拷贝方法
 * @param data
 */
export function deepClone(data: any) {
    if (typeof data !== 'object' || typeof data == 'function' || data === null) {
        return data
    }

    let item: any
    if (Array.isArray(data)) {
        item = []
    }

    if (!Array.isArray(data)) {
        item = {}
    }

    for (let i in data) {
        if (Object.prototype.hasOwnProperty.call(data, i)) {
            item[i] = deepClone(data[i])
        }
    }

    return item
}
