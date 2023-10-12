export default class Equation {
  constructor({ data }) {
    this.data = data
    this._previewState = data.previewState !== undefined ? data.previewState : false
    this._element = document.createElement('div')
    this._element.className = 'equation-block block-edit-mode'
    this._form = document.createElement('div')
    this._form.className = 'form-input'

    // equation input  ----------------------
    const inputEquationWrapper = document.createElement('div')
    inputEquationWrapper.className = 'input-wrapper'

    this._inputEquation = document.createElement('input')
    this._inputEquation.type = 'text'

    inputEquationWrapper.appendChild(this._inputEquation)

    // name input -----------------------------
    const inputNameWrapper = document.createElement('div')
    inputNameWrapper.className = 'input-wrapper'

    this._inputName = document.createElement('input')
    this._inputName.type = 'text'

    inputNameWrapper.appendChild(this._inputName)

    // combine equation and name input into form
    this._form.appendChild(inputNameWrapper)
    this._form.appendChild(inputEquationWrapper)

    // output field -------------------------------
    this._outputElement = document.createElement('div')
    this._outputElement.className = 'equation-output'

    //combine form and output into element
    this._element.appendChild(this._form)
    this._element.appendChild(this._outputElement)

    this._inputEquation.addEventListener('input', () => {
      this._renderEquation()
    })

    // Set preview state
    this._setState(this._previewState)
  }

  static get enableLineBreaks() {
    return true
  }

  render() {
    if (this.data && this.data.equation) {
      this._renderInput()
      this._renderEquation()
    }

    return this._element
  }

  renderSettings() {
    return [
      {
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
        label: 'Preview Mode',
        closeOnActivate: true,
        isActive: this._previewState,
        //toggle: true,
        onActivate: () => this._toggleState()
      }
    ]
  }

  _toggleState() {
    this._previewState = !this._previewState
    this._setState(this._previewState)
  }

  _setState(state) {
    if (state) {
      this._form.style.display = 'none'
      //this._renderEquation();
      this._element.classList.remove('block-edit-mode')
    } else {
      this._form.style.display = 'block'
      this._element.classList.add('block-edit-mode')
    }
  }

  _renderInput() {
    this._inputEquation.value = this.data.equation
    this._inputName.value = this.data.name
  }

  async _renderEquation() {
    this.data = { equation: this._inputEquation.value }
    // this._outputElement.innerHTML = '$$'.concat(this.data.equation.concat('$$'))

    // try {
    //   await window.MathJax.typesetPromise([this._outputElement], {
    //     output: 'svg'
    //   })
    // } catch (error) {
    //   console.error('Error rendering equation:', error)
    // }

    const mathOutput = await window.cmodule.renderMathBlock(this.data.equation)
    this._outputElement.innerHTML = mathOutput
  }

  static get toolbox() {
    return {
      title: 'Equation',
      icon: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><path d="M1920 260v112.941h-871.567L558.494 1660.696l-106.503-2.371-207.247-627.276H0V918.11h285.515l53.647 38.738 170.203 515.125L956.612 296.367 1009.468 260H1920Zm-133.982 603.219 79.85 79.962-280.208 279.981 280.207 280.207-79.85 79.737-280.206-280.094-279.981 280.094-79.85-79.737 280.094-280.207-280.094-279.98 79.85-79.963 279.98 280.094 280.208-280.094Z" fill-rule="evenodd"/></svg>'
    }
  }

  save() {
    return {
      equation: this._inputEquation.value,
      name: this._inputName.value,
      previewState: this._previewState
    }
  }

  static get isReadOnlySupported() {
    return true
  }
}
