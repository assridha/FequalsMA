function renderHeader(module, category){

    const moduleType = category.moduleSettings[module.metaData.generation].layoutName;

    const header = document.getElementById('header');
    const prefix = document.createElement('h6');
    prefix.style.marginBottom = '0';
    prefix.textContent = `${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} ${module.index+1}`;
    header.appendChild(prefix);
    const h1 = document.createElement('h1');
    h1.textContent = module.title;
    header.appendChild(h1);

}