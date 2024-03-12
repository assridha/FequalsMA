// function that takes subTitleArray and reders a list of links to the subtitles in id="flush-collapseTwo" div.
// subTitlesArray is an array of objects. subtitle is stored in data.text property of each object. link can be created by using id property of each object.

function renderSubTitles(subTitleArray){
    if(subTitleArray.length === 0) {
        document.getElementById('flush-collapseTwo').innerHTML = '<div style="margin: 20px;">There are no sections to display on this page.</div>';
    } else {
        const subTitles = subTitleArray.map(subTitle => {
            // remove any anchor tags from the text
            subTitle.data.text = subTitle.data.text.replace(/<a.*a>/g, '');
            if(subTitle.data.level > 2) {
                return `<a class="list-group-item list-group-item-action" href="#${subTitle.id}" style="font-size: 0.8em;">${subTitle.data.text}</a>`;
            } else {
                return `<a class="list-group-item list-group-item-action" href="#${subTitle.id}">${subTitle.data.text}</a>`;
            }
        });
        const subTitlesHtml = subTitles.join('');
        document.getElementById('flush-collapseTwo').innerHTML = subTitlesHtml;
    }
}
export { renderSubTitles }; 

