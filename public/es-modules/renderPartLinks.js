function renderPartLinks(parentModule,firstChildModule){

    let row = document.createElement('div');
    row.className = 'row container-fluid';
    row.style.marginLeft = '0';
    row.style.paddingLeft = '0';
    row.style.paddingRight = '0';

    let col1 = document.createElement('div');
    col1.className = 'col-md-6';
    col1.style.paddingLeft = '0';


    let row1 = document.createElement('div');
    row1.className = 'row container-fluid';
    row1.style.paddingLeft = '0';


    let nextText = document.createElement('div');
    nextText.className = 'col-md-auto navLinkRight mt-2 mb-2';
    nextText.style.paddingRight = '0.5rem';
    nextText.innerHTML = 'Hello there' ;
        
    let divider = document.createElement('div');
    divider.className = 'col-md-auto';
    divider.style.borderRight = '1px solid black';
    divider.style.padding='0';


    let headerHolder = document.createElement('div');
    headerHolder.className = 'col-md-auto navLinkLeft';
    headerHolder.style.paddingLeft = '0.5rem';

    let prefix = document.createElement('div');
    prefix.innerText = 'Subject'
    prefix.style.fontSize = '0.8rem';

    let header = document.createElement('a');
    header.innerText = parentModule.title;
    header.href = `/module?id=${parentModule._id}`;

    headerHolder.appendChild(prefix);
    headerHolder.appendChild(header);

    row1.appendChild(nextText);
    row1.appendChild(divider);
    row1.appendChild(headerHolder);
    col1.appendChild(row1);


    let col2 = document.createElement('div');
    col2.className = 'col-md-6 navLinkRight';
    col2.style.paddingLeft = '0';
    col2.style.marginLeft = '0';
    col2.style.paddingRight = '0';

    if (firstChildModule) {


        let row2 = document.createElement('div');
        row2.className = 'row container-fluid justify-content-end';
        row2.style.paddingRight = '0';


        let nextText = document.createElement('div');
        nextText.className = 'col-md-auto navLinkRight mt-2 mb-2';
        nextText.style.paddingRight = '0.5rem';
        nextText.innerHTML = '➡️' ;
        
        let divider = document.createElement('div');
        divider.className = 'col-md-auto';
        divider.style.borderRight = '1px solid black';
        divider.style.padding='0';


        let headerHolder = document.createElement('div');
        headerHolder.className = 'col-md-auto navLinkLeft justify-content-start';
        headerHolder.style.paddingLeft = '0.5rem';

        let prefix = document.createElement('div');
        prefix.innerText = 'Chapter 1';
        prefix.style.fontSize = '0.8rem';
        prefix.style.textAlign = 'left';

        let header = document.createElement('a');
        header.innerText = firstChildModule.title;
        header.href = `/module?id=${firstChildModule._id}`;

        headerHolder.appendChild(prefix);
        headerHolder.appendChild(header);

        row2.appendChild(nextText);
        row2.appendChild(divider);
        row2.appendChild(headerHolder);
        col2.appendChild(row2);


    }

    row.appendChild(col1);
    row.appendChild(col2);

    console.log('links rendered');
    const linkDiv = document.getElementById('links-top');
    linkDiv.appendChild(row);
    let hr = document.createElement('hr');
    linkDiv.appendChild(hr);

}