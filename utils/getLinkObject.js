// define required modules


const Subject = require('../models/subject');
const Part = require('../models/part');



module.exports.getLinkObject = async (content, type) => {

    let linkObject = [];

    if (type === 'chapter') {
        const part = await Part.findById(content.part);
        const subject = await Subject.findById(part.subject);
        linkObject[0] = { link: `/pola/${subject._id}`, text: subject.title, index: subject.index, _id: subject._id };


        linkObject[1] = { link: `/pola/subject/${part._id}`, text: part.title, index: part.index, _id: part._id };

        linkObject[2] = { link: `/pola/subject/part/${content._id}`, text: content.title, index: content.index, _id: content._id };

    }
    if (type === 'part') {

        const subject = await Subject.findById(content.subject);
        linkObject[0] = { link: `/pola/${subject._id}`, text: subject.title, index: subject.index, _id: subject._id };

        linkObject[1] = { link: `/pola/subject/${content._id}`, text: content.title, index: content.index, _id: content._id };

    }
    if (type === 'subject') {
        linkObject[0] = { link: `/pola/${content._id}`, text: content.title, index: content.index, _id: content._id };
    }
    return linkObject;
}