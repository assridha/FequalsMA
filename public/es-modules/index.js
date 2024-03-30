    // Component imports
    import renderPageFlipperLinks from './component-modules/renderPageFlipperLinks.js';
    import renderHeader from './component-modules/renderHeader.js';
    import renderChildSummaryBlocks from './component-modules/renderChildSummaryBlocks.js';
    import { renderSubTitles, renderReferences } from './component-modules/renderPageNavigation.js';

    // Editor JS imports
    import HorizontalRule from './renderer-modules/HorizontalRule.js';
    import Numeric from './renderer-modules/Numeric.js';
    import {MCQ, MAQ} from './renderer-modules/MCTemplate.js';
    import Equation from './renderer-modules/Equation.js';
    import SimpleImage from './renderer-modules/SimpleImage.js';
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
    var moduleID = window.location.search.split('=')[1];
    renderModule(moduleID)
    
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

    async function renderModule(moduleID) {
        const data = await getModuleData(moduleID);
        if (data) {
            const {parentModule, moduleCreateDate, moduleUpdateDate, module, nextModule, previousModule, childModules, category} = data;
            const firstChildModule = childModules.find(childModule => childModule.index === 0);

            renderHeader(module, category, moduleCreateDate, moduleUpdateDate);
            renderBody(module, childModules, category);
            renderPageFlipperLinks(category, module, previousModule, nextModule, parentModule, firstChildModule);
            renderChildSummaryBlocks(childModules, category, module);

            const references = module.metaData?.references;
            renderReferences(references)
        }
    }

    function renderBody(module,childModules,category) {
    
        const body = module.body;
        
        const displayChildren = category.moduleSettings[module.metaData.generation].childLayout.display;
        const childLayoutType = category.moduleSettings[module.metaData.generation].childLayout.layoutType;

        //if (displayChildren && childLayoutType === 'full'){
        //    // merge the body.blocks of all child modules into one array and push to module.body
        //    let mergedBlocks = [];
        //    childModules.forEach(childModule => {
        //        const secTitle = {id: `UID${childModule._id}`, type: 'header', data: { text: `${childModule.title} <a href="#UID${childModule._id}" class="subheader-anchor" style="text-decoration:none;font-size:1.2rem"> 🔗 </a>`, level: 2}};
        //        mergedBlocks = mergedBlocks.concat(secTitle);
        //        mergedBlocks = mergedBlocks.concat(childModule.body.blocks);
        //    });
            
        //    module.body.blocks = module.body.blocks.concat(mergedBlocks);
        //}
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
                        checklist:  editorjsNestedChecklist,
                        problem: ProblemBlock,
                        mcq: MCQ,
                        maq: MAQ,
                        numeric: Numeric,
                        equation: Equation,
                        image: SimpleImage,
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

                        renderSubTitles(subTitleArray);
                            // Function to scroll to the element
                              function scrollToHash() {
                                  const hash = window.location.hash;
                                  
                                  if (hash) {
                                    console.log('This is the hash',hash)
                                      const targetElement = document.querySelector(hash);                                      if (targetElement) {
                                          targetElement.scrollIntoView({ behavior: "smooth" });
                                          console.log('executed scroll to view')
                                      }
                                  }
                              }
                          
                              // Assuming your dynamic content is loaded here, adjust accordingly
                              // For demonstration, using setTimeout as a placeholder for dynamic content loading
                              
                            setTimeout(() => {
                                      scrollToHash(); // Call the function after the window is fully loaded and after a specific timeout
                            }, 3000); // Adjust the timeout according to when your content is expected to be loaded
                              
                     }
                    });  
    }
