export default class HorizontalRule {
  static get toolbox() {
    return {
      title: 'Rule',
      icon: '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L20 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  render() {
    const hr = document.createElement('hr')

    return hr
  }

  save() {
    return {}
  }
}
