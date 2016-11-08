# yabs
yet another bookmark solution

#install
install package.json dependencies

`npm install`

#chrome
go to `chrome://extensions`

click `Developer Mode` checkbox

click `Load unpacked extensions`

navigate to `/build` in the git repo and load this folder

the extension will appear in your chrome toolbar as a little gear

run `webpack` to compile the `/app` folder to `build` and pipe it through webpack's loaders, bundling it into a single js file

click the gear in your chrome bar and see the contents of `app/js/YabsApp.jsx`, compiled

run `webpack --watch` to have webpack auto recompile upon file change
