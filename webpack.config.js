var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
		"webpack-dev-server/client?http://localhost:3000", // Needed for hot reloading
		"webpack/hot/only-dev-server", // See above
		path.resolve(__dirname, 'js/app.js') // Start with js/app.js...
	],
	output: { // ...and compile it into js/bundle.js
		path: path.resolve(__dirname, 'js/'),
	    filename: "bundle.js",
	    publicPath: '/js/'
	},
	module: {
	    loaders: [
	    	{
	    		test: /\.js$/, // Transform all .js files required somewhere within an entry point...
	    		loaders: ['react-hot', 'babel'], // ...with babel and react-hot...
	    		exclude: path.join(__dirname, '/node_modules/') // ...except for the node_modules folder.
	    	}, {
                test:   /\.css$/, // Transform all .css files required somewhere within an entry point...
                loader: "style-loader!css-loader!postcss-loader" // ...with PostCSS
            }
	    ]
	},
	postcss: function() {
		return [
			require('postcss-import')({ // Import all the css files...
                onImport: function (files) {
                    files.forEach(this.addDependency); // ...and add dependecies from the main.css files to the other css files...
                }.bind(this) // ...so they get hot–reloaded when something changes...
            }),
           	require('postcss-simple-vars')(), // ...then replace the variables...
           	require('postcss-focus')(), // ...add a :focus to ever :hover...
           	require('autoprefixer-core')({ // ...add vendor prefixes...
           		browsers: ['last 2 versions', 'IE > 8'] // ...supporting the last 2 major browser versions and IE 8 and up...
           	}),
           	require('cssnano')({ // ...and minify the result.
       			autoprefixer: false, // Don't run autoprefixer since we've already done that...
       			comments: {
       				removeAll: true // ...and remove all comments, even those marked important.
       			}
           	}),
           	require('postcss-reporter')({ // This plugin makes sure we get warnings in the console
           		clearMessages: true
           	})
		];
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // Make hot loading work
		// new webpack.optimize.UglifyJsPlugin({ // Optimize the JS...
		// 	compress: {
		//         warnings: false // ...but ignore all warnings (there's a lot of them that are unnecessary)
		//     }
		// }),
		new webpack.NoErrorsPlugin() // No assets get emitted that throw errors
	],
	target: "web", // Make web variables accessible to webpack, e.g. window
	stats: false, // Don't show stats in the console
	progress: true
}