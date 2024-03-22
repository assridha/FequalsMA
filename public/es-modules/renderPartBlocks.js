export default function renderPartBlocks(childModules,category){

    let moduleType = category.moduleSettings[childModules[0].metaData.generation].layoutName;
    moduleType = moduleType.charAt(0).toUpperCase() + moduleType.slice(1);

    childModules.sort((a, b)=> (a.index > b.index) ? 1 : -1);
    for (let i=0; i < childModules.length; i++) {
        let partBlock = document.getElementById('part-blocks');

        let prefix = document.createElement('h6');
        prefix.style.marginBottom = '0';
        prefix.textContent = `${moduleType} ${childModules[i].index+1}`;
        partBlock.appendChild(prefix);

        let h2 = document.createElement('h2');
        //h2.className = "mt-2 pt-2";
        h2.textContent = childModules[i].title;
        partBlock.appendChild(h2);

        let p = document.createElement('p');
        p.textContent = childModules[i].metaData.summary;
        partBlock.appendChild(p);

        let div = document.createElement('div');
        div.className = "mb-2 pb-4";
        let arrow = document.createElement('span');
        arrow.textContent = '➡️ Go to ';
        let a = document.createElement('a');
        a.href = `/module?id=${childModules[i]._id}`;
        a.textContent = childModules[i].title;
        div.appendChild(arrow);
        div.appendChild(a);
        partBlock.appendChild(div);
    }



}