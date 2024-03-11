    import HorizontalRule from '/es-modules/HorizontalRule.js';
    import Numeric from '/es-modules/Numeric.js';
    import {MCQ, MAQ} from '/es-modules/MCTemplate.js';
    import Equation from '/es-modules/Equation.js';
    import SimpleImage from '/es-modules/SimpleImage.js';
    import ExParagraph from '/es-modules/ExParagraph.js';
    import HighlightBox from '/es-modules/HighlightBox.js';

    import {renderEquationInline,renderEquationBlock} from '/es-modules/renderEquation.js';
    import getSubmoduleData from '/es-modules/getSubmoduleData.js';
    import ProblemBlock from '/es-modules/ProblemBlock.js';

    window.MathJax = MathJax;
    window.cmodule = {};
    window.cmodule.renderMathBlock = renderEquationBlock;
    window.cmodule.renderMathInline = renderEquationInline;
    window.cmodule.getSubmoduleData = getSubmoduleData;
   
    // check window.location.search for id
    var moduleID = window.location.search.split('=')[1];
    // get module data via GET request
   
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/module/data/${moduleID}`, true);
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = xhr.responseText;
            data = JSON.parse(data);

            const {parentModule, moduleCreateDate, moduleUpdateDate, module, nextModule, previousModule, childModules, category} = data;

            const firstChildModule = childModules.find(childModule => childModule.index === 0);

            renderHeader(module, category,moduleCreateDate,moduleUpdateDate);
            renderEditor(module,childModules,category)

            if (category.moduleSettings[module.metaData.generation].linkFlow.display){
                if (category.moduleSettings[module.metaData.generation].linkFlow.chainSiblings){
                    if (previousModule){
                        let moduleType1 = category.moduleSettings[previousModule.metaData.generation].layoutName;
                        let moduleType2
                        if (nextModule){
                         moduleType2 = category.moduleSettings[nextModule.metaData.generation].layoutName;
                        }
                         renderChapterLinks(previousModule,nextModule,moduleType1,moduleType2)
                    }else{
                        let moduleType1 = category.moduleSettings[parentModule.metaData.generation].layoutName;
                        let moduleType2
                        if (nextModule){
                            moduleType2 = category.moduleSettings[nextModule.metaData.generation].layoutName;
                        }
                        renderChapterLinks(parentModule,nextModule,moduleType1,moduleType2)
                    }
                    
                }else{
                    let moduleType1 = category.moduleSettings[parentModule.metaData.generation].layoutName;
                    let moduleType2
                    if (firstChildModule){
                         moduleType2 = category.moduleSettings[firstChildModule.metaData.generation].layoutName;
                    }
                    
                    renderChapterLinks(parentModule,firstChildModule,moduleType1,moduleType2)
                }
                
            }
            if (category.moduleSettings[module.metaData.generation].childLayout.display &&
                category.moduleSettings[module.metaData.generation].childLayout.layoutType === 'summary'){
                renderPartBlocks(childModules,category)
            }

            } else {
                console.error(xhr.statusText);
        }
        
    };
    xhr.onerror = function () {
        console.error(xhr.statusText);
    };
    xhr.send(null);

    function renderEditor(module,childModules,category) {
    
        const body = module.body;
        
        const displayChildren = category.moduleSettings[module.metaData.generation].childLayout.display;
        const childLayoutType = category.moduleSettings[module.metaData.generation].childLayout.layoutType;

        if (displayChildren && childLayoutType === 'full'){

            // merge the body.blocks of all child modules into one array and push to module.body
            let mergedBlocks = [];
            childModules.forEach(childModule => {
                const secTitle = {id: childModule._id, type: 'header', data: { text: `${childModule.title} <a href="#${childModule._id}" class="subheader-anchor" style="text-decoration:none;font-size:1.2rem"> 🔗 </a>`, level: 2}};
                mergedBlocks = mergedBlocks.concat(secTitle);
                mergedBlocks = mergedBlocks.concat(childModule.body.blocks);
            });
            module.body.blocks = module.body.blocks.concat(mergedBlocks);
        }
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

    
                     }
                    });  
    }
