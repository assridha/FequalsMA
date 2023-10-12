export default async function renderEquation(inputString) {
  let outputString;
  try {
    outputString = await window.MathJax.tex2svgPromise(inputString, {display: false});
  } catch (error) {
    console.error('Error rendering equation:', error);
  }
  return outputString.outerHTML;
}
