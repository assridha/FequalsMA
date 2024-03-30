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

## Change log
- Added Basic references
- Right align right module links 
- Dont filter out unpublished modules in dev mode
- Figure: image should appear bigger on mobile screens > Idea: default to max width on mobile screens. 
- Page navigation links might not work due to editorjs 
- subtitle metadata font size is too big on mobile screens > use p tag instead of h5? 
- Change to equation numbering. 
- Use defer when setting page navigation. 
- Change to figure numbering.


