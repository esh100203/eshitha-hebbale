import EventEmitter from './EventEmitter.js'

export default class Loader extends EventEmitter {
  constructor() {
    super()

    this._loaderEl   = document.querySelector('.loader')
    this._titleEl    = document.querySelector('.loader_title')
    this._lineEl     = document.querySelector('.loader_line')
    this._numberEl   = document.querySelector('.loader_number')
    this._subtitleEl = document.querySelector('.loader_subtitle')

    requestAnimationFrame(() => this._run())
  }

  _run() {
    this._loaderEl.style.display = 'flex'

    const tl = gsap.timeline({ onComplete: () => this._finish() })

    tl.to(this._titleEl,    { y: '0%', duration: 0.8, ease: 'sine.inOut' }, 0.1)
    tl.to(this._lineEl,     { width: '100%', duration: 0.8, ease: 'sine.inOut' }, 0.3)
    tl.to(this._numberEl,   { y: '0%', duration: 0.8, ease: 'sine.inOut' }, 0.5)
    tl.to(this._subtitleEl, { y: '0%', duration: 0.8, ease: 'sine.inOut', delay: 0.15 }, 0.5)

    tl.to({ n: 0 }, {
      n: 100,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: function () {
        const v = Math.round(this.targets()[0].n)
        const el = document.querySelector('.loader_number')
        el.childNodes[0].textContent = v
      }
    }, 0.6)

    tl.to(this._numberEl,   { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.8)
    tl.to(this._subtitleEl, { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.85)
    tl.to(this._lineEl,     { width: '0%', duration: 0.5, ease: 'sine.inOut' }, 2.9)
    tl.to(this._titleEl,    { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.95)
  }

  _finish() {
    this._loaderEl.style.display = 'none'
    this.trigger('ready')
  }
}
