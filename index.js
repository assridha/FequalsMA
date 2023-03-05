const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const fs = require('fs');
const bodyParser = require('body-parser');
const subjectRoute = require('./routes/subject');
const partRoute = require('./routes/part');
const chapterRoute = require('./routes/chapter');
const sectionRoute = require('./routes/section');


// set view engine to ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//connect to mongodb and console log if connected or not. Set strictQuery to true to prevent deprecation warning.
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://ashwinsridhara:kLhBq7cjKzxbAwvD@alphasandbox.niws52d.mongodb.net/fEqaulsMA?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.json())

//--------------------- SUJECT ROUTES---------------------//
app.use('/pola', subjectRoute);
//--------------------- PART ROUTES---------------------//
app.use('/pola/subject', partRoute);
// //--------------------- CHAPTER ROUTES---------------------//
app.use('/pola/subject/part', chapterRoute);
// //--------------------- SECTION ROUTES---------------------//
app.use('/pola/subject/part/chapter', sectionRoute);

// // get route to each content page
// app.get('/:id/content', async (req, res) => {
//     const contentID = req.params.id;

//     const content = await Content.findById(contentID);
//     // find all content documents with content.path/ in the path and is not a subject. 
//     const subContents = await Content.find({ parent: contentID })
//         .deepPopulate('children.children.children');

//     // res.send(subContents);
//     // render content.ejs with content and subContents variables
//     res.render('content', { content, subContents });
// });

// // get route to edit page of each sub-content page
// app.get('/:id/edit', async (req, res) => {

//     const contentID = req.params.id;
//     const content = await Content.findById(contentID);

//     // render content_edit.ejs file with subject and parts variables
//     res.render('content_edit', { content });
// });


// // create post route to add new content
// app.post('/:id/add', async (req, res) => {
//     const contentID = req.params.id;
//     const content = await Content.findById(contentID);
//     const children = await Content.find({ parent: contentID });

//     // create new content document
//     const newContent = new Content({
//         title: req.body.title,
//         summary: 'No summary yet.',
//         parent: contentID,
//         // index is max level of content children + 1
//         index: getIndex(children),
//         // level is level below parent
//         level: content.level + 1,
//         path: `${content.path}${contentID}/`
//     });

//     // save new content document
//     await newContent.save();

//     // update child of content document
//     content.children.push(newContent);
//     await content.save();


//     // redirect to content page
//     res.redirect(`/${contentID}/content`);
// });

// // create post route to delete content
// app.post('/:id/delete', async (req, res) => {
//     const contentID = req.params.id;
//     const content = await Content.findById(contentID);
//     parentID = content.parent;

//     // delete content document
//     await Content.findByIdAndDelete(contentID);
//     // delete all decendent content documents
//     await Content.deleteMany({ path: { $regex: `/${contentID}` } });

//     console.log('Deleted content document and all decendents');
//     // redirect to parent content page if parent exists else redirect to home page
//     if (parentID) {
//         res.redirect(`/${parentID}/content`);
//     }
//     else {
//         res.redirect('/');
//     }

// });



//function for determining the index of a content document. 
function getIndex(content) {
    //find the child with the highest index if content exists else return -1
    const maxIndex = content.length > 0 ? Math.max(...content.map(c => c.index)) : -1;

    // return the max index + 1
    return maxIndex + 1;

}




// listen on port 8080
app.listen(8080, () => {
    console.log('listening on port 8080');
});