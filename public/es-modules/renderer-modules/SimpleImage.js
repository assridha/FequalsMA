export default class SimpleImage {
  constructor({ data, readOnly, block }) {
    this._data = {}
    this._block = this._buildBlock()
    this._blockAPI = block
    if (readOnly) {
      this._block.form.style.display = 'none'
    }
    this.data = data
  }
  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="white"/><path d="M21 16V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V18M21 16V4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V18M21 16L15.4829 12.3219C15.1843 12.1228 14.8019 12.099 14.4809 12.2595L3 18" stroke="#000000" stroke-linejoin="round"/><circle cx="8" cy="9" r="2" stroke="#000000" stroke-linejoin="round"/></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  _buildBlock() {
    const block = {
      element: document.createElement('div'),
      urlInput: document.createElement('input'),
      titleInput: document.createElement('input'),
      captionInput: document.createElement('input'),
      urlWrapper: document.createElement('div'),
      titleWrapper: document.createElement('div'),
      captionWrapper: document.createElement('div'),
      form: document.createElement('div'),
      figure: document.createElement('figure'),
      img: document.createElement('img'),
      figureCaption: document.createElement('figcaption'),
      titleSpan: document.createElement('span'),
      captionSpan: document.createElement('span'),
      anchor: document.createElement('a'),
      slideContainer: document.createElement('div'),
      slider: document.createElement('input')
    }

    block.slideContainer.className = 'slide-container'
    block.img.style.width = '50%'
    block.img.className = 'body-image'

    block.slider.type = 'range'
    block.slider.min = '0'
    block.slider.max = '100'
    block.slider.value = '50' // set initial value to 50% if needed
    block.captionInput.placeholder = 'Enter caption'
    block.urlInput.placeholder = 'Enter image url'
    block.titleInput.placeholder = 'Enter title'

    block.captionWrapper.className = 'input-wrapper'
    block.urlWrapper.className = 'input-wrapper'
    block.titleWrapper.className = 'input-wrapper'
    block.form.className = 'form-input'

    block.anchor.innerHTML = ' 🔗'
    block.anchor.style.textDecoration = 'none'
    block.anchor.style.color = 'inherit'
    block.anchor.className = 'subheader-anchor'

    block.figureCaption.appendChild(block.titleSpan)
    block.figureCaption.appendChild(block.captionSpan)
    block.figureCaption.appendChild(block.anchor)
    block.figure.appendChild(block.img)
    block.figure.appendChild(block.figureCaption)
    block.slideContainer.appendChild(block.slider)

    block.urlWrapper.appendChild(block.urlInput)
    block.titleWrapper.appendChild(block.titleInput)
    block.captionWrapper.appendChild(block.captionInput)

    block.form.appendChild(block.urlWrapper)
    block.form.appendChild(block.titleWrapper)
    block.form.appendChild(block.captionWrapper)
    block.form.appendChild(block.slideContainer)

    block.element.appendChild(block.form)
    block.element.appendChild(block.figure)


    // Add event listener to urlInput
    block.urlInput.addEventListener('paste', function (event) {
      // Get the pasted URL from the clipboard
      const pastedUrl = (event.clipboardData || window.clipboardData).getData('text')

      // Apply the URL to the image element
      block.img.src = pastedUrl
    })

    // Add event listener to slider
    block.slider.addEventListener('input', function () {
      // Get the value of the slider (between 0 and 100)
      const sliderValue = this.value

      // Set the width of the figure based on the slider value
      block.img.style.width = sliderValue + '%'
    })

    // Add event listener to titleInput
    block.titleInput.addEventListener('input', function () {
      // Update the text content of the title span
      block.titleSpan.innerHTML = `<u>Fig [${this.value}]</u>`
    })

    // Add event listener to captionInput
    block.captionInput.addEventListener('input', function () {
      // Update the text content of the caption span
      block.captionSpan.innerHTML = this.value
    })

    return block
  }

  get data() {
    this._data.url = this._block.img.src || ''
    this._data.previewState = this._block.slideContainer.style.display === 'none' ? true : false
    this._data.sliderValue = this._block.slider.value
    this._data.caption = this._block.captionInput.value
    this._data.title = this._block.titleInput.value

    return this._data
  }

  set data(data) {
    this._data = data

    this._block.img.src = data.url || ''
    this._block.anchor.href = `#${this._blockAPI.id || ''}`
    this._block.slideContainer.style.display = data.previewState ? 'none' : 'block'
    this._block.urlWrapper.style.display = data.previewState ? 'none' : 'block'
    this._block.titleWrapper.style.display = data.previewState ? 'none' : 'block'
    this._block.captionWrapper.style.display = data.previewState ? 'none' : 'block'

    if (data.previewState) {
      this._block.element.classList.remove('block-edit-mode')
    } else {
      this._block.element.classList.add('block-edit-mode')
    }

    this._block.urlInput.value = data.url || ''

    // Set the value of the slider and the image width based on `data.sliderValue`
    const sliderValue = data.sliderValue || 50 // Default value is 50 if `data.sliderValue` is not provided
    const captionInput = data.caption || ''
    const title = data.title || ''
    this._block.slider.value = sliderValue
    this._block.img.style.width = `${sliderValue}%`

    this._block.captionInput.value = captionInput
    this._block.titleInput.value = title

    this._block.captionSpan.innerHTML = captionInput
    if (title==='0'){
      this._block.titleSpan.innerHTML = ''
    } else {
      this._block.titleSpan.innerHTML = `Figure ${title}: `
    }
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
        isActive: this.data.previewState,
        onActivate: () => this._toggleState()
      }
    ]
  }

  _toggleState() {
    this._data = this.data
    console.log(this._data.previewState)
    this._data.previewState = !this._data.previewState
    this.data = this._data
  }

  save() {
    this._data = this.data

    return {
      url: this._data.url,
      previewState: this._data.previewState,
      sliderValue: this._data.sliderValue,
      caption: this._data.caption,
      title: this._data.title
    }
  }
}
