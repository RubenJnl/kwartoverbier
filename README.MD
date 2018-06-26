Kwartoverbier.nl
================

### Tools
* [Jekyll](https://jekyllrb.com/)
* [Gulp](http://gulpjs.com/)
* [AutoPrefixer](https://github.com/postcss/autoprefixer)
* [Node.JS](https://nodejs.org)
* [BrowserSync](browsersync.io)

### Languages
* HTML
* Javascript
* [SASS](http://sass-lang.com/)
* CSS 

### Conventions
* [ABEM](https://css-tricks.com/abem-useful-adaptation-bem/)


Installation
------------

For the Jekyll dev environment only Ruby is required because for Sass.


## Deployment
For deployment you need gulp

First make sure you've got Ruby and NodeJS installed. Then proceed as follows:

* Install Gulp (`npm install gulp`)
* Install all packages defined in package.json (`npm install`)


Gulp deployment tasks
----------------------

After adding images to the ./images folder you first of all need to run this.
This task deploys the responsive images.

You need GraphicsMagick and ImageMagick for the images.

Mac OS X (using [Homebrew](http://brew.sh/)):
`brew install imagemagick`
`brew install graphicsmagick`

## gulp copy-img-to-assets
Fill the assets folder with the images that are not responsive

## gulp create-responsive-images
create the responsive images

## gulp responsive-to-dev
Fill dev folder with responsive images

## gulp deploy
Deploy to deploy folder to upload via FTP, this also encodes fonts base64, minifies all js & html
