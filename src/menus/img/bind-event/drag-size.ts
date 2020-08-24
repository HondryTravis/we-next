/**
 * @description 图片拖拽事件绑定
 * @author xiaokyo
 */

import Editor from '../../../editor'
import $, { DomElement } from '../../../utils/dom-core'
import '../../../assets/style/drag-size.less'

let $imgTarget: DomElement

/**
 * 隐藏拖拽框
 */
const hideDragBox = ($textContainerElem: DomElement) => {
    const $drag = $textContainerElem.find('.w-e-img-drag-mask')
    $drag.hide()
}

/**
 * 设置拖拽框的rect
 * @param $drag drag Dom
 * @param width 要设置的宽度
 * @param height 要设置的高度
 * @param left 要设置的左边
 * @param top 要设置的顶部距离
 */
const setDragStyle = (
    $drag: DomElement,
    width: number,
    height: number,
    left: number,
    top: number
) => {
    $drag.attr(
        'style',
        `
      width:${width}px;
      height:${height}px;
      left:${left}px;
      top:${top}px;
    `
    )
}

/**
 * 设置拖拽事件
 * @param $drag 拖拽框的domElement
 * @param $textContainerElem 编辑器实例
 */
const addDragListen = ($drag: DomElement, $textContainerElem: DomElement) => {
    $drag.on('click', function (e: Event) {
        e.stopPropagation()
    })
    $drag.on('mousedown', '.w-e-img-drag-rb', (e: MouseEvent) => {
        // e.stopPropagation()
        e.preventDefault()

        if (!$imgTarget) return

        const firstX = e.clientX
        const firstY = e.clientY
        const boxRect = $textContainerElem.getBoundingClientRect()
        const imgRect = $imgTarget.getBoundingClientRect()
        const width = imgRect.width
        const height = imgRect.height
        const left = imgRect.left - boxRect.left
        const top = imgRect.top - boxRect.top
        const ratio = width / height

        let setW = width
        let setH = height
        document.onmousemove = function (ev: MouseEvent) {
            ev = ev || event
            ev.stopPropagation()
            ev.preventDefault()

            setW = width + (ev.clientX - firstX)
            setH = height + (ev.clientY - firstY)

            // 等比计算
            if (setW / setH != ratio) {
                setH = setW / ratio
            }

            $drag
                .find('.w-e-img-drag-show-size')
                .text(
                    `${setW.toFixed(2).replace('.00', '')}px * ${setH
                        .toFixed(2)
                        .replace('.00', '')}px`
                )
            setDragStyle($drag, setW, setH, left, top)
        }

        document.onmouseup = function () {
            $imgTarget.attr('width', setW + '')
            $imgTarget.attr('height', setH + '')
            const newImgRect = $imgTarget.getBoundingClientRect()
            setDragStyle(
                $drag,
                setW,
                setH,
                newImgRect.left - boxRect.left,
                newImgRect.top - boxRect.top
            )

            document.onmousemove = document.onmouseup = null
        }

        document.onmouseleave = function () {
            document.onmousemove = document.onmouseup = null
        }
    })
}

/**
 * 生成一个图片指定大小的拖拽框
 * @param $textContainerElem 编辑框对象
 */
const setDragMask = ($textContainerElem: DomElement): DomElement => {
    const $drag = $(
        `<div class="w-e-img-drag-mask">
            <div class="w-e-img-drag-rb"></div>
            <div class="w-e-img-drag-show-size"></div>
         </div>`
    )

    addDragListen($drag, $textContainerElem)
    $drag.hide()
    $textContainerElem.append($drag)
    return $drag
}

/**
 * 显示拖拽框并设置宽度
 * @param $textContainerElem 编辑框实例
 * @param $drag 拖拽框对象
 */
const showDarg = ($textContainerElem: DomElement, $drag: DomElement) => {
    const boxRect = $textContainerElem.getBoundingClientRect()
    const rect = $imgTarget.getBoundingClientRect()
    $drag.find('.w-e-img-drag-show-size').text(`${rect.width}px * ${rect.height}px`)
    setDragStyle($drag, rect.width, rect.height, rect.left - boxRect.left, rect.top - boxRect.top)
    $drag.show()
}

/**
 * 点击事件委托
 * @param editor 编辑器实例
 */
const bindDragImgSize = (editor: Editor) => {
    const $textContainerElem = editor.$textContainerElem

    const $drag = setDragMask($textContainerElem)

    // 图片点击事件
    const imgClickHooks = ($target: DomElement) => {
        if ($target) {
            $imgTarget = $target
            showDarg($textContainerElem, $drag)
        }
    }
    editor.txt.eventHooks.imgClickEvents.push(imgClickHooks)

    /**
     * 隐藏拖拽框
     */
    const hideDrag = function () {
        hideDragBox($textContainerElem)
    }
    editor.txt.eventHooks.textScrollEvents.push(hideDrag)
    editor.txt.eventHooks.keyupEvents.push(hideDrag)
    editor.txt.eventHooks.toolbarClickEvents.push(hideDrag)
    document.onclick = hideDrag
}

export default bindDragImgSize
