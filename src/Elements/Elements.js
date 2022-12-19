import Tool from '../DevTools/Tool'
import $ from 'licia/$'
import isEl from 'licia/isEl'
import nextTick from 'licia/nextTick'
import Emitter from 'licia/Emitter'
import map from 'licia/map'
import isEmpty from 'licia/isEmpty'
import toNum from 'licia/toNum'
import copy from 'licia/copy'
import isMobile from 'licia/isMobile'
import LunaDomViewer from 'luna-dom-viewer'
import { isErudaEl, classPrefix as c } from '../lib/util'
import evalCss from '../lib/evalCss'
import Detail from './Detail'
import chobitsu from '../lib/chobitsu'
import { formatNodeName } from './util'

export default class Elements extends Tool {
  constructor() {
    super()

    this._style = evalCss(require('./Elements.scss'))

    this.name = 'elements'
    this._selectElement = false
    this._observeElement = true
    this._history = []

    Emitter.mixin(this)
  }
  init($el, container) {
    super.init($el)

    this._container = container

    this._initTpl()
    this._htmlEl = document.documentElement
    this._detail = new Detail(this._$detail, container)
    this.config = this._detail.config
    this._domViewer = new LunaDomViewer(this._$domViewer.get(0), {
      node: this._htmlEl,
      ignore: (node) => isErudaEl(node),
    })
    this._domViewer.expand()
    this._bindEvent()
    chobitsu.domain('Overlay').enable()

    nextTick(() => this._updateHistory())
  }
  show() {
    super.show()

    if (!this._curNode) {
      this._setNode(document.body)
    }
  }
  // To be removed in 3.0.0
  set(node) {
    return this.select(node)
  }
  select(node) {
    this._setNode(node)
    this.emit('change', node)
    return this
  }
  destroy() {
    super.destroy()

    evalCss.remove(this._style)
    this._detail.destroy()
    chobitsu
      .domain('Overlay')
      .off('inspectNodeRequested', this._inspectNodeRequested)
    chobitsu.domain('Overlay').disable()
  }
  _updateButtons() {
    const $control = this._$control
    const $showDetail = $control.find(c('.show-detail'))
    const $copyNode = $control.find(c('.copy-node'))
    const iconDisabled = c('icon-disabled')

    $showDetail.addClass(iconDisabled)
    $copyNode.addClass(iconDisabled)

    const node = this._curNode

    if (!node) {
      return
    }

    $copyNode.rmClass(iconDisabled)

    if (node.nodeType === Node.ELEMENT_NODE) {
      $showDetail.rmClass(iconDisabled)
    }
  }
  _initTpl() {
    const $el = this._$el

    $el.html(
      c(`<div class="control">
        <span class="icon icon-select select"></span>
        <span class="icon icon-eye show-detail"></span>
        <span class="icon icon-copy copy-node"></span>
      </div>
      <div class="dom-viewer-container">
        <div class="dom-viewer"></div>
      </div>
      <div class="crumbs"></div>
      <div class="detail"></div>`)
    )

    this._$detail = $el.find(c('.detail'))
    this._$domViewer = $el.find(c('.dom-viewer'))
    this._$control = $el.find(c('.control'))
    this._$crumbs = $el.find(c('.crumbs'))
  }
  _renderCrumbs() {
    const crumbs = getCrumbs(this._curNode)
    let html = ''
    if (!isEmpty(crumbs)) {
      html = map(crumbs, ({ text, idx }) => {
        return `<li class="${c('crumb')}" data-idx="${idx}">${text}</div></li>`
      }).join('')
    }
    this._$crumbs.html(html)
  }
  _back() {
    if (this._curNode === this._htmlEl) return

    const parentQueue = this._curParentQueue
    let parent = parentQueue.shift()

    while (!isElExist(parent)) {
      parent = parentQueue.shift()
    }

    this.set(parent)
  }
  _bindEvent() {
    const self = this

    this._$el.on('click', c('.crumb'), function () {
      let idx = toNum($(this).data('idx'))
      let node = self._curNode

      while (idx-- && node.parentElement) {
        node = node.parentElement
      }

      if (isElExist(node)) {
        self._setNode(node)
      }
    })

    this._$control
      .on('click', c('.select'), this._toggleSelect)
      .on('click', c('.show-detail'), () => this._detail.show(this._curNode))
      .on('click', c('.copy-node'), this._copyNode)

    this._domViewer.on('select', this._setNode)

    chobitsu
      .domain('Overlay')
      .on('inspectNodeRequested', this._inspectNodeRequested)
  }
  _copyNode = () => {
    const node = this._curNode

    if (node.nodeType === Node.ELEMENT_NODE) {
      copy(node.outerHTML)
    } else {
      copy(node.nodeValue)
    }

    this._container.notify('Copied')
  }
  _toggleSelect = () => {
    this._$el.find(c('.select')).toggleClass(c('active'))
    this._selectElement = !this._selectElement

    if (this._selectElement) {
      chobitsu.domain('Overlay').setInspectMode({
        mode: 'searchForNode',
        highlightConfig: {
          showInfo: !isMobile(),
          showRulers: false,
          showAccessibilityInfo: !isMobile(),
          showExtensionLines: false,
          contrastAlgorithm: 'aa',
          contentColor: 'rgba(111, 168, 220, .66)',
          paddingColor: 'rgba(147, 196, 125, .55)',
          borderColor: 'rgba(255, 229, 153, .66)',
          marginColor: 'rgba(246, 178, 107, .66)',
        },
      })
      this._container.hide()
    } else {
      chobitsu.domain('Overlay').setInspectMode({
        mode: 'none',
      })
    }
  }
  _inspectNodeRequested = ({ backendNodeId }) => {
    this._container.show()
    this._toggleSelect()
    const { node } = chobitsu.domain('DOM').getNode({ nodeId: backendNodeId })
    this.select(node)
  }
  _setNode = (node) => {
    if (node === this._curNode) return

    this._curNode = node
    this._domViewer.select(node)
    this._renderCrumbs()

    const parentQueue = []

    let parent = node.parentNode
    while (parent) {
      parentQueue.push(parent)
      parent = parent.parentNode
    }
    this._curParentQueue = parentQueue

    this._updateButtons()
    this._updateHistory()
  }
  _updateHistory() {
    const console = this._container.get('console')
    if (!console) return

    const history = this._history
    history.unshift(this._curNode)
    if (history.length > 5) history.pop()
    for (let i = 0; i < 5; i++) {
      console.setGlobal(`$${i}`, history[i])
    }
  }
}

const isElExist = (val) => isEl(val) && val.parentNode

function getCrumbs(el) {
  const ret = []
  let i = 0

  while (el) {
    ret.push({
      text: formatNodeName(el, { noAttr: true }),
      idx: i++,
    })

    el = el.parentElement
  }

  return ret.reverse()
}
