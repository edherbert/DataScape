# DataScape
A web based SQL data generator.

## Tests
You can find helium testing documents in app/Tests.

## Running
You should be able to run the application by going to public/index.html.

If this does not work then you'll need to build the application from source.

## Building
We used a JavaScript build tool named Brunch for this project. This compiles the entire application into a single .js file.
In order to use it you need to first install node.js. You can get this from their website.

Once you've got node you can install brunch from the npm:
```
npm install -g brunch
```

Then to build, navigate to the directory in which you cloned DataScape and run:
```
brunch build
```

This will create a directory named public which contains index.html, ready to be run.
