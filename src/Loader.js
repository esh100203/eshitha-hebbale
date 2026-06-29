import EventEmitter from './EventEmitter.js'

export default class Loader extends EventEmitter {
  constructor() {
    super()

    this._loaderEl   = document.querySelector('.loader')
    this._titleEl    = document.querySelector('.loader_title')
    this._lineEl     = document.querySelector('.loader_line')
    this._numberEl   = document.querySelector('.loader_number')
    this._subtitleEl = document.querySelector('.loader_subtitle')
    this._statusEl   = document.querySelector('.loader_status')

    // Defer one RAF tick so Experience.js can register the 'ready' listener first
    requestAnimationFrame(() => this._run())
  }

  _setStatus(text) {
    if (!this._statusEl) return
    this._statusEl.style.opacity = '0'
    setTimeout(() => {
      this._statusEl.textContent = text
      this._statusEl.style.opacity = '1'
    }, 200)
  }

  _run() {
    this._loaderEl.style.display = 'flex'

    this._setStatus('initialising')

    const tl = gsap.timeline({ onComplete: () => this._finish() })

    // Title slides in
    tl.to(this._titleEl, { y: '0%', duration: 0.8, ease: 'sine.inOut' }, 0.1)

    // Progress bar fills
    tl.to(this._lineEl, { width: '100%', duration: 0.8, ease: 'sine.inOut' }, 0.3)

    // Number + subtitle slide in
    tl.to(this._numberEl,   { y: '0%', duration: 0.8, ease: 'sine.inOut' }, 0.5)
    tl.to(this._subtitleEl, { y: '0%', duration: 0.8, ease: 'sine.inOut', delay: 0.15 }, 0.5)

    // Count 0 → 100%
    tl.to({ n: 0 }, {
      n: 100,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: function () {
        const v = Math.round(this.targets()[0].n)
        const el = document.querySelector('.loader_number')
        el.childNodes[0].textContent = v
        if (v > 30)  document.querySelector('.loader_status').textContent = 'loading gallery'
        if (v > 65)  document.querySelector('.loader_status').textContent = 'preparing exhibition'
        if (v === 100) document.querySelector('.loader_status').textContent = 'entering'
      }
    }, 0.6)

    // Show status
    tl.to(this._statusEl, { opacity: 1, duration: 0.3 }, 0.7)

    // Hold then slide everything out
    tl.to(this._numberEl,   { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.8)
    tl.to(this._subtitleEl, { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.85)
    tl.to(this._lineEl,     { width: '0%', duration: 0.5, ease: 'sine.inOut' }, 2.9)
    tl.to(this._titleEl,    { y: '-110%', duration: 0.6, ease: 'sine.inOut' }, 2.95)
    tl.to(this._statusEl,   { opacity: 0, duration: 0.4, ease: 'sine.inOut' }, 2.8)
  }

  _finish() {
    this._loaderEl.style.display = 'none'
    this.trigger('ready')
  }
}
