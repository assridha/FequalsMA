// function that takes subTitleArray and reders a list of links to the subtitles in id="flush-collapseTwo" div.
// subTitlesArray is an array of objects. subtitle is stored in data.text property of each object. link can be created by using id property of each object.

function renderSubTitles(subTitleArray){
    if(subTitleArray.length === 0) {
        document.getElementById('flush-collapseTwo').innerHTML = '<div style="margin: 20px;">There are no sections to display on this page.</div>';
    } else {
        const subTitles = subTitleArray.map(subTitle => {
            // remove any anchor tags from the text
            const subTitleMod =  subTitle.data.text.replace(/<a.*a>/g, '');
            if(subTitle.data.level > 2) {
                return `<a class="list-group-item list-group-item-action" href="#${subTitle.id}" style="font-size: 0.7em;"> &nbsp; &nbsp; ${subTitleMod}</a>`;
            } else {
                return `<a class="list-group-item list-group-item-action" href="#${subTitle.id}" style="font-size: 0.8em;">${subTitleMod}</a>`;
            }
        });
        const subTitlesHtml = subTitles.join('');
        const listDiv = document.createElement('div');
        listDiv.id = 'subtitle-list';
        listDiv.className = 'list-group';
        listDiv.innerHTML = subTitlesHtml;
        document.getElementById('flush-collapseTwo').innerHTML = ''; // Clear existing content
        document.getElementById('flush-collapseTwo').appendChild(listDiv);
    }
}

function renderReferences(references){
    if(references && references.length === 0) {
        document.getElementById('flush-collapseThree').innerHTML = '<div style="margin-left: 20px; margin-right: 20px;padding-bottom: 20px;padding-top: 20px;">There are no references to display on this page.</div>';
    } else {

        const referenceHtml = references.map((reference,index) =>{ 
           return `<a class="list-group-item list-group-item-action" href="${reference.href}" style="font-size: 0.8em;">[${index+1}] ${reference.text}</a>`;
        })
        const listDiv = document.createElement('div');
        listDiv.id = 'subtitle-list';
        listDiv.className = 'list-group';
        listDiv.innerHTML = referenceHtml.join('');
        document.getElementById('flush-collapseThree').innerHTML = ''; // Clear existing content
        document.getElementById('flush-collapseThree').appendChild(listDiv);
    }

}

export { renderSubTitles, renderReferences }; 

