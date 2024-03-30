export default function renderPageFlipperLinks(category, module, previousModule, nextModule, parentModule, firstChildModule) {
    if (category.moduleSettings[module.metaData.generation].linkFlow.display) {
        if (category.moduleSettings[module.metaData.generation].linkFlow.chainSiblings) {
            if (previousModule) {
                let moduleType1 = category.moduleSettings[previousModule.metaData.generation].layoutName;
                let moduleType2;
                if (nextModule) {
                    moduleType2 = category.moduleSettings[nextModule.metaData.generation].layoutName;
                }
                handlePageFlipperLinks(previousModule, nextModule, moduleType1, moduleType2);
            } else {
                let moduleType1 = category.moduleSettings[parentModule.metaData.generation].layoutName;
                let moduleType2;
                if (nextModule) {
                    moduleType2 = category.moduleSettings[nextModule.metaData.generation].layoutName;
                }
                handlePageFlipperLinks(parentModule, nextModule, moduleType1, moduleType2);
            }
        } else {
            let moduleType1 = category.moduleSettings[parentModule.metaData.generation].layoutName;
            let moduleType2;
            if (firstChildModule) {
                moduleType2 = category.moduleSettings[firstChildModule.metaData.generation].layoutName;
            }
            handlePageFlipperLinks(parentModule, firstChildModule, moduleType1, moduleType2);
        }
    }
}


function handlePageFlipperLinks(previousModule,nextModule,moduleType1,moduleType2){

    let ModuleType1 = moduleType1.charAt(0).toUpperCase() + moduleType1.slice(1);
    let ModuleType2
    if (nextModule){
    ModuleType2 = moduleType2.charAt(0).toUpperCase() + moduleType2.slice(1);
    }
    let row = document.createElement('div');
    row.className = 'row row-cols-2 container-fluid';
    row.style.marginLeft = '0';
    row.style.paddingLeft = '0';
    row.style.paddingRight = '0';

    let col1 = linkBlockLeft(previousModule,ModuleType1);
    row.appendChild(col1);


if (nextModule) {
    let col2 = linkBlockRight(nextModule,ModuleType2);
    row.appendChild(col2);
}

    console.log('links rendered');
    const linksDivTop = document.getElementById('links-top');
    const linksDivBottom = document.getElementById('links-bottom');
    linksDivTop.appendChild(row);
    
    let hr = document.createElement('hr');
    linksDivTop.appendChild(hr);

    linksDivBottom.appendChild(hr.cloneNode(true));
    linksDivBottom.appendChild(row.cloneNode(true));

}

function linkBlockLeft(module,moduleType){

    let col1 = document.createElement('div');
    col1.className = 'col-md-6';
    col1.style.paddingLeft = '0';


    let row1 = document.createElement('div');
    row1.className = 'row container-fluid';
    row1.style.paddingLeft = '0';


    let headerHolder = document.createElement('div');
    headerHolder.className = 'col-md-auto navLinkLeft';
    headerHolder.style.paddingLeft = '0.5rem';

    let prefix = document.createElement('div');
    prefix.innerText = `⬅️ ${moduleType}`;
    prefix.style.fontSize = '0.8rem';

    let header = document.createElement('a');
    header.innerText = module.title;
    header.href = `/module?id=${module._id}`;

    headerHolder.appendChild(prefix);
    headerHolder.appendChild(header);

    row1.appendChild(headerHolder);
    col1.appendChild(row1);

    return col1;
}

function linkBlockRight(module,moduleType){

    let col2 = document.createElement('div');
    col2.className = 'col-md-6';
    col2.style.paddingLeft = '0';
    col2.style.marginLeft = '0';
    col2.style.paddingRight = '0';

    if (module) {
        let row2 = document.createElement('div');
        row2.className = 'row container-fluid justify-content-end';
        row2.style.paddingRight = '0';


        let headerHolder = document.createElement('div');
        headerHolder.className = 'col-md-auto navLinkRight';
        headerHolder.style.paddingLeft = '0.5rem';
        headerHolder.style.paddingRight = '0';

        let prefix = document.createElement('div');
        prefix.innerText = `➡️ ${moduleType}`;
        prefix.style.fontSize = '0.8rem';
        prefix.style.textAlign = 'right';

        let header = document.createElement('a');
        header.innerText = module.title;
        header.href = `/module?id=${module._id}`;
        header.style.textAlign = 'right'
        header.style.justifyContent = 'end'

        headerHolder.appendChild(prefix);
        headerHolder.appendChild(header);

        row2.appendChild(headerHolder);
        col2.appendChild(row2);

    }


    return col2;
}