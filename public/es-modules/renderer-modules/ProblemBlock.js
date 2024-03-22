import SimpleImage from './SimpleImage.js';
import Equation from './Equation.js';
import ExParagraph from './ExParagraph.js';
import HorizontalRule from './HorizontalRule.js';
import {MCQ,MAQ} from './MCTemplate.js';
import Numeric from './Numeric.js';

class ProblemBlock {
  constructor({ data, readOnly, block }) {
    this._data = data
    // sort submodules by index
    this._data.submodules.sort((a, b) => a.index - b.index)
    this._blockAPI = block
    this._data.previewState = data.previewState ? data.previewState : false
    this._data.previewState = readOnly ? true : this._data.previewState
    this._element = document.createElement('div')
    this._element.classList.add('problem-block')

    this._buildElement()
  }

  _buildElement() {
    // remove element content including event listeners
    this._element.innerHTML = ''

    if (this._data.previewState) {
      this._buildPreviewElement()
    } else {
      this._buildEditElement()
    }
  }

  render() {
    return this._element
  }

  async _buildPreviewElement() {
    const subEditors = []
    const header = document.createElement('h5')
    if (this._data.submodules.length === 1) {
      header.innerText = 'Practice Problem'
    } else {
      header.innerText = 'Practice Problems'
    }
    header.style.marginBottom = '1rem'
    header.style.marginTop = '1rem'
    header.style.fontWeight = 'bold'

    this._element.appendChild(header)
    
    for (let index = 0; index < this._data.submodules.length; index++) {
      const submodule = this._data.submodules[index]
      const submoduleData = await window.cmodule.getSubmoduleData(submodule._id)
      const subHeader = document.createElement('h5')
      subHeader.style.marginTop = '1rem'
      subHeader.innerText = `#${index + 1}: ` + submodule.title
      // make subHeader bold
      subHeader.style.fontWeight = 'bold'

      const line = document.createElement('hr')

      const subeditorElement = document.createElement('div')
      subeditorElement.setAttribute('id', submodule._id)
      // set subeditorElement z-index to 0 so that it doesn't block the editorjs toolbar
      subeditorElement.style.zIndex = -1

      subEditors[index] = new EditorJS({
        holder: submodule._id,
        readOnly: true,
        autofocus: false,
        tools: {
          paragraph: {
            class: ExParagraph
          },
          header: Header,
          image: SimpleImage,
          equation: Equation,
          checklist: editorjsNestedChecklist,
          hrule: HorizontalRule,
          mcq: MCQ,
          maq: MAQ,
          numeric: Numeric
        },
        data: submoduleData,
        onReady: () => {
          // remove the first block
         const firstBlockID =  subEditors[index].blocks.getBlockByIndex(0).id
         // find element with data-id equal to firstBlockID and remove it
          const firstBlock = document.querySelector(`[data-id="${firstBlockID}"]`)
          firstBlock.remove()
        }
      })
      this._element.appendChild(subHeader)
      this._element.appendChild(subeditorElement)
      if (index !== this._data.submodules.length - 1) {
        this._element.appendChild(line)
      }
    }
  }

  async _buildEditElement() {
    // create a multi select form for selecting options from input array called submodules
    const multiSelect = document.createElement('select')
    multiSelect.classList.add('multi-select')
    multiSelect.setAttribute('multiple', '')
    multiSelect.setAttribute('size', '5')
    multiSelect.setAttribute('name', 'submodules')
    multiSelect.setAttribute('id', 'submodules')

    // text element when submodules is empty
    const emptyText = document.createElement('p')
    emptyText.classList.add('warning-text')
    emptyText.innerText = '⚠️ Module has no submodules'

    // get options from window.cmodules.getSubmodules()
    window.cmodule.getSubmodules().then((submodules) => {
      if (submodules.length > 0) {
        // add options to the multi select form
        submodules.forEach((submodule) => {
          const option = document.createElement('option')
          option.setAttribute('value', submodule._id)
          option.innerText = submodule.title
          multiSelect.appendChild(option)

          // if the option is present in the data (based on if submodule.id matches data.submodules[i].id), select it
          if (this._data.submodules?.some((dataSubmodule) => dataSubmodule._id === submodule._id)) {
            option.selected = true
          }
        })

        // create a button with event listener to set data.submodules to the selected options
        const saveButton = document.createElement('button')
        saveButton.classList.add('save-button')
        saveButton.innerText = 'Save'
        saveButton.addEventListener('click', () => {
          const selectedOptions = Array.from(multiSelect.selectedOptions)
          this._data.submodules = selectedOptions.map((option) => {
            return {
              title: option.innerText,
              _id: option.value
            }
          })
          this._blockAPI.dispatchChange()
          this._toggleState()
        })

        this._element.appendChild(multiSelect)
        this._element.appendChild(saveButton)
      } else {
        this._element.appendChild(emptyText)
      }
    })
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

  _toggleState() {
    this._data.previewState = !this._data.previewState

    this._buildElement()
  }

  static get toolbox() {
    return {
      title: 'Problem Block',
      icon: '<svg width="800px" height="800px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-299.000000, -520.000000)" fill="#000000"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M253.2669,374.512 C253.2669,375.064 252.7965,375.512 252.2169,375.512 C251.6373,375.512 251.1669,375.064 251.1669,374.512 C251.1669,373.96 251.6373,373.512 252.2169,373.512 C252.7965,373.512 253.2669,373.96 253.2669,374.512 L253.2669,374.512 Z M249.0669,365 C249.0669,364.448 249.5373,364 250.1169,364 L256.1124,364 C256.98915,364 257.7,364.677 257.7,365.512 L257.7,368 C257.7,369.1 256.755,370 255.6,370 L254.03445,370 C253.7394,370 253.5,370.228 253.5,370.509 L253.5,371.512 C253.5,372.064 253.03065,372.512 252.45,372.512 C251.8704,372.512 251.4,372.064 251.4,371.512 L251.4,369.778 C251.4,368.796 252.2358,368 253.2669,368 L254.3169,368 C254.8965,368 255.3669,367.552 255.3669,367 C255.3669,366.448 254.8965,366 254.3169,366 L250.1169,366 C249.5373,366 249.0669,365.552 249.0669,365 L249.0669,365 Z M245.1,378 L261.9,378 L261.9,362 L245.1,362 L245.1,378 Z M243,380 L264,380 L264,360 L243,360 L243,380 Z" id="question-[#1444]"></path> </g></g></g></svg>'
    }
  }

  save() {
    return {
      previewState: this._data.previewState,
      submodules: this._data.submodules
    }
  }

  static get isReadOnlySupported() {
    return true
  }
  static get enableLineBreaks() {
    return true
  }
}

export default ProblemBlock