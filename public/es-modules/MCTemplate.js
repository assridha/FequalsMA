class MCTemplate {
  constructor({ data, readOnly, qType }) {
    this._data = data
    this._qType = qType
    if (this._qType === 'MCQ') {
      this._queryText = 'radio'
    } else if (this._qType === 'MAQ') {
      this._queryText = 'checkbox'
    }
    // set default data
    this._data.options = this._data.options || ['option 0', 'option 1', 'option 2', 'option 3']
    this._data.answer = this._data.answer || ['option 0']
    this._data.previewState =
      this._data.previewState !== undefined ? this._data.previewState : false

    if (readOnly) {
      this._data.previewState = true
    }

    this._block = this._buildBlock()
    this._renderOptions(this._block.input.value)
    this._setState()
  }

  static get enableLineBreaks() {
    return true
  }

  static get toolbox() {
    const qType = this._qType
    return {
      title: qType,
      icon: '<svg width="800px" height="800px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#3B88C3" d="M36 32a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v28z"></path><path d="M8.004 4.823c.323-.874 1.064-1.577 2.033-1.577c1.007 0 1.71.665 2.033 1.577l3.724 10.334c.114.304.152.57.152.703c0 .741-.608 1.253-1.311 1.253c-.798 0-1.197-.417-1.387-.988l-.57-1.786H7.396l-.57 1.767c-.19.589-.589 1.007-1.368 1.007c-.76 0-1.406-.57-1.406-1.33c0-.304.095-.532.133-.627L8.004 4.823zm.209 6.896h3.609L10.055 6.21h-.038l-1.804 5.509zm2.841 7.527c1.387 0 4.084.456 4.084 2.127c0 .685-.475 1.274-1.178 1.274c-.779 0-1.311-.665-2.907-.665c-2.355 0-3.571 1.995-3.571 4.312c0 2.261 1.235 4.198 3.571 4.198c1.596 0 2.242-.798 3.02-.798c.855 0 1.254.856 1.254 1.292c0 1.823-2.869 2.241-4.274 2.241c-3.856 0-6.535-3.059-6.535-6.99c.001-3.952 2.66-6.991 6.536-6.991zm9.348-14.347c0-.912.627-1.425 1.5-1.425h3.648c1.976 0 3.571 1.33 3.571 3.343c0 1.33-.551 2.223-1.767 2.792v.038c1.615.228 2.888 1.577 2.888 3.229c0 2.679-1.785 4.123-4.407 4.123h-3.913c-.874 0-1.52-.551-1.52-1.444V4.899zm2.85 3.932h1.48c.932 0 1.539-.551 1.539-1.5c0-.893-.703-1.349-1.539-1.349h-1.48v2.849zm0 5.661h2.241c1.026 0 1.786-.589 1.786-1.652c0-.893-.685-1.501-2.014-1.501h-2.014v3.153zm-3.354 6.446c0-.875.608-1.463 1.463-1.463h3.153c4.255 0 6.687 2.735 6.687 6.952c0 3.989-2.583 6.573-6.496 6.573h-3.307c-.627 0-1.5-.342-1.5-1.425V20.938zm2.85 9.44h1.918c2.451 0 3.572-1.805 3.572-4.084c0-2.432-1.141-4.198-3.762-4.198h-1.729v8.282z" fill="#FFF"></path></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  _buildBlock() {
    const block = {}

    block.element = document.createElement('div')
    block.element.className = 'container-fluid'

    // create a form
    const form = document.createElement('form')
    form.className = 'form-input'

    // create text input
    const input = document.createElement('textarea')
    input.rows = 4
    input.className = 'form-control mt-3'
    input.placeholder = 'Enter options separated by semicolon'
    input.value = this._data.options.join(';\n')

    // add eventlistener to input to call _renderOptions on change
    input.addEventListener('change', (event) => {
      this._renderOptions(event.target.value)
    })

    // create blank options
    const options = document.createElement('div')
    options.className = 'form-group row'

    // add an eventlistener to the options
    if (this._qType === 'MCQ') {
      options.addEventListener('click', (event) => {
        const selectedOption = event.target
        if (selectedOption.tagName === 'INPUT') {
          const allOptions = options.querySelectorAll(`input[type="${this._queryText}"]`)
          for (let i = 0; i < allOptions.length; i++) {
            if (allOptions[i] !== selectedOption) {
              allOptions[i].checked = false
            }
          }
        }
      })
    }

    // combine the input and options into the form
    form.appendChild(input)
    form.appendChild(options)

    // create a submit button
    const submit = document.createElement('button')
    submit.type = 'submit'
    submit.className = 'btn btn-dark btn-lg mt-3 mb-3'

    // add an eventlistener to the submit button
    submit.addEventListener('click', (event) => {
      event.preventDefault()

      // remove any previous alerts
      const alert = this._block.element.querySelector('.alert')
      if (alert) {
        alert.remove()
      }

      // store the result in data.answer
      const selectedOptions = this._block.options.querySelectorAll(
        `input[type="${this._queryText}"]:checked`
      )
      let answerCorrect = false
      if (selectedOptions.length > 0) {
        if (!this._data.previewState) {
          this._data.answer = Array.from(selectedOptions).map((option) => option.name)
        } else {
          // check if the answer is correct
          answerCorrect =
            Array.from(selectedOptions)
              .map((option) => option.name)
              .sort()
              .join(',') === this._data.answer.sort().join(',')
        }
      }
      if (this._data.previewState) {
        if (answerCorrect) {
          this._alertMessage('Correct!', 'success')
        } else if (selectedOptions.length > 0) {
          this._alertMessage('Incorrect!', 'danger')
        } else {
          this._alertMessage('Please select an option', 'warning')
        }
      } else {
        if (selectedOptions.length > 0) {
          this._alertMessage(
            `Answer recorded: ${Array.from(selectedOptions)
              .map((option) => option.name)
              .join(', ')}`,
            'success'
          )
        } else {
          this._alertMessage('Please select an option', 'warning')
        }
      }
    })

    form.appendChild(submit)

    // combine the form and result into the block
    block.element.appendChild(form)

    // set the block
    block.form = form
    block.options = options
    block.alert = alert
    block.submit = submit
    block.input = input

    return block
  }

  _renderOptions(inputValue) {
    // remove existing option div including event listeners
    const options = this._block.options
    options.innerHTML = ''

    // split the input value into options
    const optionValues = inputValue.split(';\n')

    // create option elements
    for (let i = 0; i < optionValues.length; i++) {
      const option = document.createElement('div')
      option.className = 'form-check form-check-inline col-md-5 py-2'
      const optionInput = document.createElement('input')
      optionInput.type = `${this._queryText}`
      optionInput.style.width = '25px'
      optionInput.style.height = '25px'
      optionInput.style.border = '1px solid black'
      optionInput.name = `option ${i}`
      optionInput.className = 'form-check-input vetical-center'
      const optionLabel = document.createElement('label')
      optionLabel.style.margin = '2px 10px'
      optionLabel.className = 'form-check-label'
      optionLabel.innerText = optionValues[i]
      option.appendChild(optionInput)
      option.appendChild(optionLabel)
      options.appendChild(option)
    }

    // render equation
    this._renderEquation()
  }

  _setState() {
    this._setSubmitText()
    this._showHideInput()
  }

  _showHideInput() {
    if (this._data.previewState) {
      this._block.input.style.display = 'none'
    } else {
      this._block.input.style.display = 'block'
    }
  }

  _setSubmitText() {
    if (this._data.previewState) {
      this._block.submit.innerText = 'Check'
    } else {
      this._block.submit.innerText = 'Set Answer'
    }
  }

  _alertMessage(message, type) {
    const alert = document.createElement('div')
    alert.className = `alert alert-${type} alert-dismissible`
    alert.role = 'alert'
    alert.innerHTML = `<div>${message}</div>`
    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.className = 'btn-close'
    closeButton.setAttribute('data-bs-dismiss', 'alert')
    closeButton.setAttribute('aria-label', 'Close')
    // add event listener to close button to remove the alert
    closeButton.addEventListener('click', () => {
      alert.remove()
    })
    alert.appendChild(closeButton)
    this._block.element.appendChild(alert)
  }

  render() {
    return this._block.element
  }

  renderSettings() {
    return [
      {
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
        label: 'Preview Mode',
        closeOnActivate: true,
        isActive: this._data.previewState,
        onActivate: () => this._toggleState()
      }
    ]
  }

  _toggleState() {
    console.log(this._data.previewState)
    this._data.previewState = !this._data.previewState

    this._setState()

    // reset buttons
    const allOptions = this._block.options.querySelectorAll(`input[type="${this._queryText}"]`)
    for (let i = 0; i < allOptions.length; i++) {
      allOptions[i].checked = false
    }

    // remove any previous alerts
    const alert = this._block.element.querySelector('.alert')
    if (alert) {
      alert.remove()
    }
  }

  async _renderEquation() {
    // Find all substrings within paragraph with $[text]$ format and replace with <span data-equation="[text]">$[text]$</span>. Note that [text] can contain '\' characters.
    const regex = /\$([^$]+)\$/g
    // find all labels within options
    const allLabels = this._block.options.querySelectorAll('label')
    // modify the innerHTML of each label
    for (let i = 0; i < allLabels.length; i++) {
      allLabels[i].innerHTML = allLabels[i].innerHTML.replace(
        regex,
        '<span>&#8203;</span><span class="inline-equation" contenteditable="false" data-equation="$1">$ $1 $</span><span>&#8203;</span>'.replace(
          /\\/g,
          '\\\\'
        )
      )

      //--------------------
      // find all spans with class "inline-equation" and replace innerHTML with the "test text"
      const equations = allLabels[i].querySelectorAll('.inline-equation')
      for (let i = 0; i < equations.length; i++) {
        const equation = equations[i]
        const equationText = equation.getAttribute('data-equation')
        const equationRendered = await window.cmodule.renderMathInline(equationText)
        equation.innerHTML = equationRendered
      }
    }
  }

  // _undoRenderEquation() {
  //   const allLabels = this._block.options.querySelectorAll('label')
  //   for (let i = 0; i < allLabels.length; i++) {
  //     allLabels[i].innerHTML = this._data.options[i].value
  //   }
  // }

  save() {
    // get options from input
    const inputValue = this._block.input.value
    const optionValues = inputValue.split('; ')

    return {
      previewState: this._data.previewState,
      options: optionValues,
      answer: this._data.answer
    }
  }
}

export class MCQ extends MCTemplate {
  constructor({ data, readOnly }) {
    const qType = 'MCQ'
    super({ data, readOnly, qType })
  }
}

export class MAQ extends MCTemplate {
  constructor({ data, readOnly }) {
    const qType = 'MAQ'
    super({ data, readOnly, qType })
  }
}
