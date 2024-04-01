class ExParagraph extends Paragraph {
  constructor({ data, api, config, readOnly }) {
    super({ data, config, api, readOnly })
    this._previewState = data.previewState
    this._dummyElement = document.createElement('div')
    if (readOnly) {
      this._previewState = true
    }
  }

  render() {
    this._element = super.render()
    this._setState()

    return this._element
  }

  renderSettings() {
    return [
      {
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
        label: 'Preview Mode',
        closeOnActivate: true,
        isActive: this._previewState,
        onActivate: () => this._toggleState()
      }
    ]
  }

  _toggleState() {
    this._data = this.data
    this._previewState = !this._previewState
    this._setState()
  }

  async _setState() {
    this._dummyElement.innerHTML = this._data.text || ''

    if (this._previewState) {
      await this._renderEquation()
    } else {
      this._undoRenderEquation()
    }

    this._data.text = this._dummyElement.innerHTML
    this._element.innerHTML = this._data.text
  }

  async _renderEquation() {
    // Find all substrings within paragraph with $[text]$ format and replace with <span data-equation="[text]">$[text]$</span>. Note that [text] can contain '\' characters.
    const regex = /\$([^$]+)\$/g
    this._dummyElement.innerHTML = this._dummyElement.innerHTML.replace(
      regex,
      '<span>&#8203;</span><span class="inline-equation" contenteditable="false" data-equation="$1">$ $1 $</span><span>&#8203;</span>'.replace(
        /\\/g,
        '\\\\'
      )
    )

    //--------------------
    // find all spans with class "inline-equation" and replace innerHTML with the "test text"
    const equations = this._dummyElement.querySelectorAll('.inline-equation')
    for (let i = 0; i < equations.length; i++) {
      const equation = equations[i]
      const equationText = equation.getAttribute('data-equation')
      const equationRendered = await window.cmodule.renderMathInline(equationText)
      equation.innerHTML = equationRendered
    }
  }

  _undoRenderEquation() {
    const equations = this._dummyElement.querySelectorAll('.inline-equation')
    for (let i = 0; i < equations.length; i++) {
      const equation = equations[i]
      const equationText = equation.getAttribute('data-equation')
      equation.innerHTML = equationText
    }

    // Using regex, remove all <span> elements with class "inline-equation" and replace with their inner text
    this._dummyElement.innerHTML = this._dummyElement.innerHTML.replace(
      /<span class="inline-equation" contenteditable="false" data-equation="([^"]+)">([^<]+)<\/span>/g,
      '&#36;$2&#36;'
    )
  }

  save(element) {
    this._dummyElement.innerHTML = element.innerHTML
    let text
    if (this._previewState) {
      this._undoRenderEquation()
      text = this._dummyElement.innerHTML
      this._renderEquation()
    } else {
      text = this._dummyElement.innerHTML
    }

    return {
      text: text,
      previewState: this._previewState
    }
  }
}

export default ExParagraph
