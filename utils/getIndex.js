//function for determining the index of a content document. 
module.exports.getIndex = (content) => {
    //find the child with the highest index if content exists else return -1
    const maxIndex = content.length > 0 ? Math.max(...content.map(c => c.index)) : -1;

    // return the max index + 1
    return maxIndex + 1;

}

