export async function renderEquationBlock(inputString) {
  let outputString;
  try {
    outputString = await window.MathJax.tex2svgPromise(inputString, {display: true});
  } catch (error) {
    console.error('Error rendering equation:', error);
  }
  return outputString.outerHTML;
}
export async function renderEquationInline(inputString) {
  let outputString;
  try {
    outputString = await window.MathJax.tex2svgPromise(inputString, {display: false});
  } catch (error) {
    console.error('Error rendering equation:', error);
  }
  return outputString.outerHTML;
}