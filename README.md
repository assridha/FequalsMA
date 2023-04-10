<!-- write a summary of the current repository -->
# README

This repository contains the source code for my personal website for teaching physics. The website is built using Node.js and the Express framework. The website is hosted on Heroku (TBD) and uses a MongoDB database. The website is built using the EJS templating engine.

**(NOTE: This website is still under development. It is not yet ready for production!)**

## Installation

To install the website, first clone the repository:

```bash 
git clone https://github.com/assridha/FequalsMA.git
```

Then, install the dependencies:

```bash 
npm install
```

Next, configure database and authorization

```bash
npm run setup
```

Finally, run the website:

```bash
npm run start-dev 
```
## Structure

The website is structured as follows:

- `index.js` is the main file that runs the website.
- *models* contains the models for the MongoDB database.
- *routes* contains the routes for the website.
- *views* contains the EJS templates for the website.
  - subfolders contain the EJS templates for each page.
  - *layout* contains the EJS templates for the layout of the website.
  - *subject* contains the EJS templates for the subject pages.
  - *part* contains the EJS templates for the part pages.
  - *chapter* contains the EJS templates for the chapter pages.
  - *section* contains the EJS templates for the section pages.
  - *reference* contains the EJS templates for the reference pages.
- *utils* contains the utility functions for the website.

## Things to do

- [ ] Polish the website. Make sure it looks good on all devices. 
- [ ] Setup authorization. 
- [ ] Add content.
- [ ] Connect to MongoDB Atlas so that the website can be hosted on a server.
- [ ] Setup a domain name for the website. 
- [ ] Setup a SSL certificate for the website.
- [ ] Add a contact form.
- [ ] fix the navbar on mobile devices.
- [ ] Add a favicon.
- [ ] add a 404 page.
- [ ] verify that the website is accessible by screen readers.
- [ ] keep track of the number of views for each page.
- [ ] write a blog post about the website.
- [ ] optimize the website for search engines.
- [ ] create a workflow for publishing new articles to the website.

