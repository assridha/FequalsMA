//import EditorJS from '@editorjs/editorjs'
//import Header from '@editorjs/header'
//import editorjsNestedChecklist from '@calumk/editorjs-nested-checklist'

import SimpleImage from '/es-modules/SimpleImage.js';
import Equation from '/es-modules/Equation.js';
import ExParagraph from '/es-modules/ExParagraph.js';
import HorizontalRule from '/es-modules/HorizontalRule.js';


export default class Numeric {
  constructor({ data, readOnly }) {
    this._data = data
    // set default data
    this._data.answer = this._data.answer !== undefined ? this._data.answer : '42'
    this._data.previewState =
      this._data.previewState !== undefined ? this._data.previewState : false

    // create a unique id
    this._idSubEditor = `sub-editor-${Math.floor(Math.random() * 1000000)}`
    this._subEditor = null

    this._data.solutionBlockData = this._data.solutionBlockData || this._setDefaultBlockData()

    if (readOnly) {
      this._data.previewState = true
    }

    this._block = this._buildBlock()
    this._setState()
  }

  _setDefaultBlockData() {
    const defaultBlockData = [
      {
        type: 'paragraph',
        data: {
          text: 'The correct answer is '
        }
      },
      {
        type: 'paragraph',
        data: {
          text: '<b>Solution explanation:</b> '
        }
      }
    ]

    return defaultBlockData
  }

  static get isReadOnlySupported() {
    return true
  }

  static get toolbox() {
    return {
      title: 'Numeric',
      icon: '<svg width="800px" height="800px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet"><path fill="#3B88C3" d="M36 32a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v28z"></path><path d="M9.613 6.096H8.492c-.912 0-1.292-.665-1.292-1.311c0-.665.475-1.311 1.292-1.311h2.698c.817 0 1.273.589 1.273 1.349v10.81c0 .95-.608 1.481-1.425 1.481c-.817 0-1.425-.532-1.425-1.481V6.096zm5.129 16.627c0 1.196-.513 2.241-1.558 2.906c1.368.627 2.318 1.9 2.318 3.4c0 2.28-2.09 4.198-4.788 4.198c-2.812 0-4.559-2.07-4.559-3.571c0-.74.779-1.272 1.463-1.272c1.291 0 .988 2.223 3.134 2.223c.988 0 1.786-.76 1.786-1.767c0-2.66-3.23-.703-3.23-2.944c0-1.995 2.698-.646 2.698-2.755c0-.722-.513-1.273-1.368-1.273c-1.805 0-1.558 1.862-2.85 1.862c-.779 0-1.235-.703-1.235-1.406c0-1.481 2.033-3.077 4.142-3.077c2.736-.001 4.047 1.993 4.047 3.476zm13.373-8.231c.836 0 1.48.38 1.48 1.254S28.951 17 28.228 17h-6.346c-.835 0-1.48-.38-1.48-1.254c0-.399.246-.741.437-.969c1.577-1.881 3.286-3.59 4.729-5.68c.343-.494.666-1.083.666-1.767c0-.779-.59-1.463-1.368-1.463c-2.185 0-1.14 3.078-2.964 3.078c-.912 0-1.387-.646-1.387-1.387c0-2.394 2.128-4.312 4.465-4.312c2.336 0 4.217 1.539 4.217 3.951c0 2.641-2.944 5.262-4.559 7.295h3.477zm-6.934 15.526c-.931 0-1.33-.627-1.33-1.121c0-.418.152-.646.267-.836l4.255-7.713c.418-.76.95-1.102 1.938-1.102c1.102 0 2.184.703 2.184 2.432v5.832h.323c.741 0 1.33.494 1.33 1.254s-.589 1.254-1.33 1.254h-.323v1.614c0 1.007-.398 1.483-1.367 1.483s-1.368-.476-1.368-1.483v-1.614h-4.579zm4.578-7.808h-.038l-2.564 5.3h2.603v-5.3z" fill="#FFF"></path></svg>'
    }
  }

  _buildBlock() {
    const block = {}

    const element = document.createElement('div')
    element.className = 'container-fluid'

    // create input
    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'form-control mt-3'
    input.placeholder = 'Enter answer'
    element.appendChild(input)

    const form = document.createElement('form')
    form.className = 'form-input'
    element.appendChild(form)

    // create button holder
    const buttonHolder = document.createElement('div')

    // create a submit button
    const submit = document.createElement('button')
    submit.type = 'submit'
    submit.className = 'btn btn-dark mt-3 mb-3'
    // create a solution button
    const solution = document.createElement('button')
    solution.className = 'btn btn-dark mt-3 mb-3'
    solution.style.marginLeft = '10px'
    solution.innerText = 'Solution'

    // disable solution button
    solution.disabled = true && this._data.previewState

    // add an eventlistener to the submit button
    submit.addEventListener('click', (event) => {
      event.preventDefault()

      // remove any previous alerts
      const alert = element.querySelector('.alert')
      if (alert) {
        alert.remove()
      }

      // store the result in data.answer
      const enteredAnswer = input.value
      let answerCorrect = false
      if (enteredAnswer) {
        if (!this._data.previewState) {
          this._data.answer = enteredAnswer
        } else {
          // check if the answer is correct up to 2 decimal places
          answerCorrect = Math.abs(parseFloat(enteredAnswer) - parseFloat(this._data.answer)) < 0.01
        }
      }
      if (this._data.previewState) {
        if (answerCorrect) {
          this._alertMessage('Correct!', 'success')
          this._block.solution.disabled = false
        } else if (enteredAnswer) {
          this._alertMessage('Incorrect!', 'danger')
          this._block.solution.disabled = false
        } else {
          this._alertMessage('Please enter a value', 'warning')
        }
      } else {
        if (enteredAnswer) {
          this._alertMessage(`Answer recorded: ${enteredAnswer}`, 'success')
        } else {
          this._alertMessage('Please enter a value', 'warning')
        }
      }
    })

    // add eventlistener to solution button to show/hide solution
    solution.addEventListener('click', (event) => {
      event.preventDefault()
      this._initializeSubEditor(this._data.solutionBlockData, this._data.previewState)
      if (this._block.solutionBlock.style.display === 'none') {
        this._block.solutionBlock.style.display = 'block'
      } else {
        this._block.solutionBlock.style.display = 'none'
      }
    })

    buttonHolder.appendChild(submit)
    buttonHolder.appendChild(solution)
    // combine the submit button into the button holder
    form.appendChild(buttonHolder)

    // create a div for solution block
    const solutionBlock = document.createElement('div')
    solutionBlock.id = this._idSubEditor
    solutionBlock.style.display = 'none'
    solutionBlock.className = 'solution-box'
    solutionBlock.style.border = '1px solid lightgray'
    solutionBlock.style.borderRadius = '5px'
    solutionBlock.style.padding = '10px'
    element.appendChild(solutionBlock)

    // set the block
    block.element = element
    block.input = input
    block.alert = alert
    block.submit = submit
    block.solution = solution
    block.solutionBlock = solutionBlock

    return block
  }

  _setState() {
    this._setSubmitText()
    this._setValue()
  }

  _setValue() {
    if (!this._data.previewState && this._data.answer) {
      this._block.input.value = this._data.answer
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
    this._block.element.insertBefore(alert, this._block.solutionBlock)
  }

  render() {
    return this._block.element
  }

  renderSettings() {
    return [
      {
        name: 'preview',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`,
        label: 'Preview Mode',
        closeOnActivate: true,
        isActive: this._data.previewState,
        onActivate: () => this._toggleState()
      }
    ]
  }

  _initializeSubEditor(solutionBlockData, readOnly) {
    if (this._subEditor) {
      this._subEditor.destroy()
    }

    this._subEditor = new EditorJS({
      holder: this._idSubEditor,
      readOnly: readOnly,
      autofocus: !readOnly,
      tools: {
        paragraph: {
          class: ExParagraph
        },
        header: Header,
        image: SimpleImage,
        equation: Equation,
        checklist: editorjsNestedChecklist,
        hrule: HorizontalRule
      },
      data: { blocks: solutionBlockData },
      onReady: () => {
        // find all elements within solutionBlock with class "ce-block" and set its id to value in data-id attribute
        const allBlocks = this._block.solutionBlock.querySelectorAll('.ce-block')
        for (let i = 0; i < allBlocks.length; i++) {
          const block = allBlocks[i]
          const blockId = block.getAttribute('data-id')
          block.id = blockId
        }
      }
    })
  }

  _toggleState() {
    console.log(this._data.previewState)
    this._data.previewState = !this._data.previewState

    // reset input
    this._block.input.value = ''

    this._setState()

    this._initializeSubEditor(this._data.solutionBlockData, this._data.previewState)

    this._block.solution.disabled = this._data.previewState
    if (this._data.previewState) {
      this._block.solutionBlock.style.display = 'none'
    }

    // remove any previous alerts
    const alert = this._block.element.querySelector('.alert')
    if (alert) {
      alert.remove()
    }
  }

  async save() {
    if (this._subEditor && !this._data.previewState) {
      const outputData = await this._subEditor.save()
      this._data.solutionBlockData = outputData.blocks
    }

    return {
      previewState: this._data.previewState,
      answer: this._data.answer,
      solutionBlockData: this._data.solutionBlockData
    }
  }
}
