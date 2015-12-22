MAX SPA
=====

Overview
--------

This document aims to explain the best way to work with the product and its components.

__All the best and enjoy coding.__

### Support

In case you have questions

[Contact Support >](jeremy.hulick@gmail.com)


Getting started
---------------

### Tips

- Do not start from scratch, use this existing template and modify it to learn how it works.
- Explore the sources for ideas and sample code.
- Use Firebug or Chrome Developer Tools to find bugs on your website. Using one of those tools will help you to save time analyzing the site and finding elements structure, like classes, id or tags
  - Quick tip: open your site with Chrome, press F12 and go to console tab, reload your page and if something goes wrong you will see your page errors in red text.
- In case of error messages, someone might have seen it too, so you can try a Google search for a quick fix.

### Starting the app

Since this is AngularJS based application you need a server (Nodejs/Express, Apache, IIS, xampp, etc) to serve the html files and perform http request to load all views.
By default, Nodejs/Express is included for development purposes to serve static assets and test/mock middleware and back end services.

Clone this repo and run the content locally
```bash
$ npm install
$ bower install
$ gulp serve-dev
```
**Important!** Opening the index.html with a double click (i.e. using file:// protocol) will show you only a blank page because there's no server that response to the requests made for each view in order to display the app interface.

Customizing
-----------

### Structure

The app is structured such that you can Locate your code quickly, Identify the code at a glance, keep the Flattest structure you can, and Try to stay DRY. The structure should follow these 4 basic guidelines.

All of the app's code goes in a root folder named app. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the app folder. I didn't write them and I don't want them cluttering my app (bower_components, scripts, lib).

Place components that define the overall layout of the application in a folder named layout. These may include a shell view and controller may act as the container for the app, navigation, menus, content areas, and other regions.

Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed.

All app content follows a folders-by-feature (dashboard, admin, etc.) convention rather than folders-by-type (e.g. controllers, services, views, etc.)

Before starting to customize the template, here are the project files organization structure:

```
sampleApp
├── app
│   ├── app.module.js
│   ├── app.start.js
│   ├── blocks
│   │   ├── auth
│   │   │   ├── auth.module.js
│   │   │   └── providers
│   │   │       └── auth.max.js
│   │   ├── exception
│   │   │   ├── exception-handler.provider.js
│   │   │   ├── exception.js
│   │   │   └── exception.module.js
│   │   ├── logger
│   │   │   ├── logger.js
│   │   │   └── logger.module.js
│   │   ├── router
│   │   │   ├── router.module.js
│   │   │   └── routerHelper.provider.js
│   │   └── session
│   │       ├── controllers
│   │       │   └── monitor.js
│   │       ├── session.module.js
│   │       ├── session.timeout.manager.js
│   │       └── views
│   │           └── monitor.html
│   ├── core
│   │   ├── config.js
│   │   ├── constants.js
│   │   ├── core.module.js
│   │   ├── dataservice.js
│   │   └── userservice.js
│   ├── customers
│   │   ├── config.route.js
│   │   ├── controllers
│   │   │   └── customers.js
│   │   ├── customers.module.js
│   │   └── views
│   │       └── customers.html
│   ├── dashboard
│   │   ├── config.route.js
│   │   ├── controllers
│   │   │   └── dashboard.js
│   │   ├── dashboard.module.js
│   │   └── views
│   │       └── dashboard.html
│   ├── grid
│   │   ├── config.route.js
│   │   ├── controllers
│   │   │   └── grid.js
│   │   ├── grid.module.js
│   │   └── views
│   │       └── grid.html
│   ├── layout
│   │   ├── controllers
│   │   │   ├── shell.js
│   │   │   ├── sidebar.js
│   │   │   └── topnav.js
│   │   ├── layout.module.js
│   │   └── views
│   │       ├── shell.html
│   │       ├── sidebar.html
│   │       └── topnav.html
│   ├── loader.js
│   └── widgets
│       ├── breezeInput.js
│       ├── ccSidebar.js
│       ├── ccSpinner.js
│       ├── ccWidgetClose.js
│       ├── ccWidgetHeader.js
│       ├── ccWidgetMinimize.js
│       ├── widgetheader.html
│       └── widgets.module.js
├── content
├── e2e-test
├── fonts
├── index.html
```
---
#### Main folders explanation

__app/__ folder

This folder contains the compiled files. __This files are ready to deploy on your server.__

- pages/
This folder contains the compiled html files for the single pages (out of the app).
- views/
This folder contains the compiled html files for the views and partials used for the app.

__server/__ folder

This folder contains server side files used for nodejs/express server.


### Custom code

To add your own code you can follow this instructions:

Build
-----

**Important!** You only need to follow this instructions in case you want to work with LESS and concatenate all JS modules.

__Node.js__ is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications.

__Gulp__ is a task manager, you can define different tasks to run certain commands. Those commands does the compilation job for LESS, and concatenates the JS files.

__Bower__ is a dependency manager, it works by fetching and installing packages from all over, taking care of hunting, finding, downloading, and saving the stuff you're looking for. Bower keeps track of these packages in a manifest file, bower.json. 

The package includes the files __gulpfile.js__,  __package.json__ and __bower.json__ to install the required components and to compile the source files.


#### Installing tools

The following steps are intended to be an orientation guide, if you are not experienced with this you will need to learn more about it from independent research.

- To install node and npm, go to http://nodejs.org/
- Run __npm install -g bower__ to install bower to manage dependencies
- Download and install GIT for your platform http://git-scm.com/downloads

Once  you have all tools installed

- Open a terminal, go the application root folder, then run the command __npm install__. This command will install gulp and all project dependencies. 
- Then, to install vendor dependencies, run __bower install__
- Finally run __gulp help__ to display the list of available gulp tasks. The task __gulp serve-dev__ will start the application in development mode. 

Gulp development tasks enable the automatic page reload. This requires the LiveReload Chrome plugin [Livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)


### Javascript

The Javascript source is divided in two main files that controls the app



### LESS



Usage
-----

### Layout



### Lazy Load

This app requires only the necessary scripts according to the view that is loaded saving tons unnecessary request to the server.

The lazy load is handled by a custom core function based on the plugin [ocLazyLoad](https://github.com/ocombe/ocLazyLoad)

To configure the lazy scripts, you need to edit the constants `APP_REQUIRES` (constants.js)
Then edit the app configuration (config.js) where you will find the routes configuration and add or edit the params using the special function `resolveFor` which handles the scripts request order for the current route.

### RTL

RTL support uses the a tool called [css-flip](https://github.com/twitter/css-flip) which inverts most the css properties to change the page orientation.
It's also a property `$rootScope.isRTL`  to detect when the site is in RTL mode.

### Routes

This app uses for routing the [AngularUI Router](https://github.com/angular-ui/ui-router) with nested states making more simple to manage the routing system and load resource in cascade.

All routes are defined in the file __config.js__


### Markdown Docs

This documentation is loaded from a Markdown source using [Flatdoc](http://ricostacruz.com/flatdoc/) plugin.
The menu and the content is generated automatically from the .md file and styled directly from custom css.

Via the `flatdoc` directive you can use it like this

``` html
<flatdoc src="path/to/readme.md"></flatdoc>
```

### Icons

Icons included from

* [__Font Awesome__](http://fortawesome.github.io/Font-Awesome/)

### Themes

To change the color scheme you have 2 options:

#### From LESS files

Edit the LESS files in folder __master/less/app__ and the file __master/less/bootstrap/variables.less__ to use the color you want.
Like Bootstrap, most of the colors are based on `@brand-*` variables.

You can also edit the files in __master/less/theme__ folder to create your own set of color schemes. This files must be included after the __app.css__ in order to override the default color set.

> Changing the theme from LESS files helps you to avoid bloating your css by not double declaring your color rules.

#### From CSS files

This template support color schemes including a css file. You can find the color options in the folder app/css/  files are named theme-*.css

If you want to change or add a new component color, just inspect the color using your favorite browser devtool and then replace the value in the file.

This files are prepared to change the basic color scheme (both sidebars and  top navbar) but if you want to make a more deep change I suggest you to check the LESS way which is more simple for multiple component changes.

Directives
----------

This item include the following directives.



### Bootstrap

This item include all directives from [Angular BootstrapUI].

[Angular BootstrapUI]: http://github.com/api

Constants
---------

### Requires

`appRequires`
Defines the script used with the lazy load system.

Format:

``` js
// Put here all jQuery script (and not angular js)
scripts: {
  'friendly-name' : ['path/to/plugin.js', 'path/to/plugin.css', '...'],
  ...
}
// Put here all angular js modules that needs to be instantiated
modules: {
  {
    name: 'toaster', files: ['path/to/module.js', 'path/to/module.css', '...']
  },
  ...
}
```

Learn more by looking into the file __config.js__

Credits
-------
<div class="row">
<div class="col-lg-3">
[Angular](https://angularjs.org/)
[Angular Docs](https://docs.angularjs.org/guide/)
[ocLazyLoad](https://github.com/ocombe/ocLazyLoad)
[uiRouter](https://github.com/angular-ui/ui-router)
[uiBootstrap](http://angular-ui.github.io/bootstrap/)
[Toaster](https://github.com/jirikavi/AngularJS-Toaster)
[Angular Loading Bar](http://chieffancypants.github.io/angular-loading-bar/)
[Bootstrap](http://getbootstrap.com/)
[jQuery]( http://jquery.com/)
</div>
<div class="col-lg-3">
[Modernizr](http://modernizr.com/)
[MomentJs](http://momentjs.com/)
[Parsley](http://parsleyjs.org/)
[Bootstrap Slider](http://www.eyecon.ro/bootstrap-slider)
[Sparkline](http://omnipotent.net/jquery.sparkline/#s-about)
[slimSCroll](http://rocha.la/jQuery-slimScroll)
[DataTables](https://datatables.net/.)
[CsSpinner](http://jh3y.github.io/-cs-spinner/)
[FlatDoc](https://github.com/rstacruz/flatdoc)
</div>
<div class="col-lg-3">
[Font Awesome](http://fortawesome.github.io/Font-Awesome/)
</div>
</div>
