// function that takes subTitleArray and reders a list of links to the subtitles in id="flush-collapseTwo" div.
// subTitlesArray is an array of objects. subtitle is stored in data.text property of each object. link can be created by using id property of each object.

function renderPageNavigation(subTitleArray){
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
    if(references === undefined || references?.length === 0) {
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

function renderSubjectNavigation(toc, moduleID,category) {

    const subjectNavigation = document.getElementById('subjectNavigationAccordion');

    if (category.metaData.displayTOC) {
    subjectNavigation.style.display = 'block'
    const sidebarHandler = document.getElementById('sidebar-handler');
    sidebarHandler.innerHTML = ''
    let linkObject = [moduleID];
    let part = toc.parts.filter(part => part._id === moduleID);
    if (part.length > 0) {
        linkObject.push(part[0].parent);
    } else {
        let chapter = toc.chapters.filter(chapter => chapter._id === moduleID);
        if (chapter.length > 0) {
            linkObject.push(chapter[0].parent);
            part = toc.parts.filter(part => part._id === chapter[0].parent);
            if (part.length > 0) {
                linkObject.push(part[0].parent);
            }
        }
    }
    linkObject.reverse();

    let selectedSubject = toc.subjects.find(subject => subject._id === linkObject[0]);
    let subjectSpan = document.createElement('span');
    let subjectLink = document.createElement('a');
    subjectLink.href = `/module/${selectedSubject._id}`;
    subjectLink.id = "subject";
    subjectLink.className = "sidebar-heading";
    subjectLink.textContent = selectedSubject.title;
    subjectSpan.appendChild(subjectLink);
    sidebarHandler.appendChild(subjectSpan);

    let toggleLink = document.createElement('a');
    toggleLink.setAttribute('data-bs-toggle', 'collapse');
    toggleLink.href = "#collapseList";
    toggleLink.id = "link";
    toggleLink.role = "button";
    toggleLink.setAttribute('aria-expanded', 'false');
    toggleLink.setAttribute('aria-controls', 'collapseList');
    toggleLink.className = "sidebar-text";
    toggleLink.style.textDecoration = "none";
    toggleLink.innerHTML = '[<span id="plus_minus">-</span>]';
    sidebarHandler.appendChild(toggleLink);

    toggleLink.addEventListener("click", function() {
        let plusMinus = document.getElementById("plus_minus");
        plusMinus.innerHTML = plusMinus.innerHTML === "+" ? "-" : "+";
    });

    let partsSort = toc.parts.filter((part) => part.parent === selectedSubject._id).sort((a, b) => (a.index > b.index) ? 1 : -1);
    let collapseList = document.createElement('ul');
    collapseList.className = "collapse sidebar-text";
    collapseList.id = "collapseList";
    // initial conditions for collapseList
    collapseList.classList.add("show");

    partsSort.forEach((part, j) => {
        let li = document.createElement('li');
        li.className = "nav-item";
        let span = document.createElement('span');
        let partLink = document.createElement('a');
        partLink.href = `/module/${part._id}`;
        partLink.id = `part_${j}`;
        partLink.className = "sidebar-text";
        partLink.textContent = part.title;
        span.appendChild(partLink);
        li.appendChild(span);

        let togglePartLink = document.createElement('a');
        togglePartLink.setAttribute('data-bs-toggle', 'collapse');
        togglePartLink.href = `#collapseList_${j}`;
        togglePartLink.id = `link_${j}`;
        togglePartLink.role = "button";
        togglePartLink.setAttribute('aria-expanded', 'false');
        togglePartLink.setAttribute('aria-controls', `collapseList_${j}`);
        togglePartLink.className = "sidebar-text";
        togglePartLink.style.textDecoration = "none";
        let chaptersList = document.createElement('ul');
        chaptersList.className = "collapse sidebar-text";
        chaptersList.id = `collapseList_${j}`;
        // initial condition for parts
        if (linkObject.length>1 && partsSort[j]._id === linkObject[1]) { 
            chaptersList.classList.add("show");
            partLink.classList.remove("sidebar-text");
            partLink.classList.add("sidebar-heading");
            togglePartLink.innerHTML = `[<span id="plus_minus_${j}">-</span>]`;
        } else {
            togglePartLink.innerHTML = `[<span id="plus_minus_${j}">+</span>]`;
        }

        li.appendChild(togglePartLink);

        togglePartLink.addEventListener("click", function() {
            let plusMinus = document.getElementById(`plus_minus_${j}`);
            plusMinus.innerHTML = plusMinus.innerHTML === "+" ? "-" : "+";
        });

        let chaptersSort = toc.chapters.filter((chapter) => chapter.parent === part._id).sort((a, b) => (a.index > b.index) ? 1 : -1);
        chaptersSort.forEach((chapter, k) => {
            let chapterLi = document.createElement('li');
            chapterLi.className = "nav-item";
            let chapterSpan = document.createElement('span');
            let chapterLink = document.createElement('a');
            chapterLink.href = `/module/${chapter._id}`;
            chapterLink.id = `chapter_${j}_${k}`;
            chapterLink.className = "sidebar-text";
            chapterLink.textContent = chapter.title;
            chapterSpan.appendChild(chapterLink);
            chapterLi.appendChild(chapterSpan);
            chaptersList.appendChild(chapterLi);

            if (linkObject.length>2 && chaptersSort[k]._id === linkObject[2]) {
                    
                chapterLink.classList.add("sidebar-heading");
                chapterLink.classList.remove("sidebar-text");
             
            }
        });

        li.appendChild(chaptersList);
        collapseList.appendChild(li);
    });

    sidebarHandler.appendChild(collapseList);
} 
}




export { renderPageNavigation, renderReferences, renderSubjectNavigation }; 

