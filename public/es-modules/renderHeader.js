function renderHeader(module, category){

    const moduleType = category.moduleSettings[module.metaData.generation].layoutName;

    const title = document.getElementById('header');
    const prefix = document.createElement('h6');
    const subtitle = document.createElement('h6');
    
    prefix.style.marginBottom = '0';
    prefix.textContent = `${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} ${module.index+1}`;
    subtitle.textContent = `Author: Ashwin Sridhar, Created: ${module.metaData.created}, Last Updated: ${module.metaData.updated}`;

    const h1 = document.createElement('h1');
    h1.textContent = module.title;
    
    title.appendChild(prefix);
    title.appendChild(h1);
    title.appendChild(subtitle);


}