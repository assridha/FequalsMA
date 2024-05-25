    // Component imports
    import renderPageFlipperLinks from './component-modules/renderPageFlipperLinks.js';
    import renderHeader from './component-modules/renderHeader.js';
    import renderChildSummaryBlocks from './component-modules/renderChildSummaryBlocks.js';
    import { renderPageNavigation, renderReferences, renderSubjectNavigation } from './component-modules/renderSidebar.js';

    // Editor JS imports
    import HorizontalRule from './renderer-modules/HorizontalRule.js';
    import Numeric from './renderer-modules/Numeric.js';
    import {MCQ, MAQ} from './renderer-modules/MCTemplate.js';
    import Equation from './renderer-modules/Equation.js';
    import SimpleImage from './renderer-modules/SimpleImage.js';
    import EmbedGeo from './renderer-modules/EmbedGeo.js';
    import ExParagraph from './renderer-modules/ExParagraph.js';
    import HighlightBox from './renderer-modules/HighlightBox.js';

    // Editor JS interface function imports
    import {renderEquationInline,renderEquationBlock} from './renderer-modules/renderEquation.js';
    import getSubmoduleData from './renderer-modules/getSubmoduleData.js';
    import ProblemBlock from './renderer-modules/ProblemBlock.js';
    

    // Assign interface functions to window object so that EditorJS tools can access them
    window.MathJax = MathJax;
    window.cmodule = {};
    window.cmodule.renderMathBlock = renderEquationBlock;
    window.cmodule.renderMathInline = renderEquationInline;
    window.cmodule.getSubmoduleData = getSubmoduleData;
   
    // Parse URL
   function parseURL(){
    var pathElement = window.location.hash;
    return pathElement
   }

    // Function to scroll to the element
    function scrollToHash(nextPathLevel) {
                                  
        if (nextPathLevel) {
            const targetElement = document.querySelector(nextPathLevel);                                      
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
                console.log('executed scroll to view')
            }
        }
    }
   
   const nextPathLevel = parseURL();
   renderModule(moduleID,nextPathLevel);

    
    async function getModuleData(moduleID) {
        try {
            const response = await fetch(`/module/data/${moduleID}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch module data:", error);
        }
    }

    async function renderModule(moduleID,nextPathLevel) {
        const data = await getModuleData(moduleID);
        if (data) {
            const {parentModule, moduleCreateDate, moduleUpdateDate, module, nextModule, previousModule, childModules, category, toc} = data;
            const firstChildModule = childModules.find(childModule => childModule.index === 0);

            renderHeader(module, category, moduleCreateDate, moduleUpdateDate);
            renderBody(module,nextPathLevel);
            renderPageFlipperLinks(category, module, previousModule, nextModule, parentModule, firstChildModule);
            renderChildSummaryBlocks(childModules, category, module);
            renderSubjectNavigation(toc,module._id,category)

            const references = module.metaData?.references;
            renderReferences(references)
        }
    }

    function renderBody(module,nextPathLevel) {
    
        const body = module.body;
        
        const subTitleArray = module.body.blocks.filter(block => block.type === 'header');
        subTitleArray.forEach(subTitle => {
                    subTitle.id = 'UID' + subTitle.id;
                });

        const editor = new EditorJS({
            holder: 'editorjs',
            readOnly: true,
            autofocus: false,
            tools: {
                    paragraph: ExParagraph,
                    header: Header,
                    embed: Embed,
                    checklist:  editorjsNestedChecklist,
                    problem: ProblemBlock,
                    mcq: MCQ,
                    maq: MAQ,
                    numeric: Numeric,
                    equation: Equation,
                    image: SimpleImage,
                    embed: EmbedGeo,
                    hrule: HorizontalRule,
                    highlight: {
                         class: HighlightBox
                        }          
                     },
                     data: body,
                     onReady: () => {
                        console.log('Editor.js is ready!')
                        window.editor = editor;
                        // delete the first element with class 'ce-block' from the dom
                        const firstElement = document.querySelector('.ce-block');
                        firstElement.remove();
                        // find all elements with class 'ce-editor', read the data-id and set id to data-id
                        const editorElements = document.querySelectorAll('.ce-block');
                        editorElements.forEach(element => {
                            element.id = element.dataset.id;
                        });

                        renderPageNavigation(subTitleArray);          
                              // Assuming your dynamic content is loaded here, adjust accordingly
                              // For demonstration, using setTimeout as a placeholder for dynamic content loading
                              
                            setTimeout(() => {
                                      scrollToHash(nextPathLevel); // Call the function after the window is fully loaded and after a specific timeout
                            }, 1000); // Adjust the timeout according to when your content is expected to be loaded
                              
                     }
            });  
    }
