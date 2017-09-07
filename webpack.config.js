var webpack = require('webpack');
var path = require('path');
var inProduction = (process.env.NODE_ENV === 'production');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var PurifyCSSPlugin = require('purifycss-webpack');
var glob = require('glob');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        
        app: [
         
            './src/main.js',

            './src/main.scss'
        ]

    },

    output: {

        path: path.resolve(__dirname, './dist'),

        filename: '[name].js'

    },

    module: {

        rules: [

            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({

                    use: ['css-loader', 'sass-loader'],
                    
                    fallback: 'style-loader'
                    /* use: [
                        {
                            loader: 'css-loader',
                            options: { url: false }
                        },
                        'sass-loader'
                    ], */
                })
            },

            {
                test: /\.png|jpe?g|JPG|gif$/,
                loader: [
                    
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name]_[hash].[ext]'
                        }
                    },

                    'img-loader'
                ],
                
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]

    },

    plugins: [

        new CleanWebpackPlugin(['dist'], {

            root: __dirname,

            verbose: true,

            dry: false

        }),

        new ExtractTextPlugin('[name].css'),

        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'index.html')),

            minimize: inProduction
        }),

        new webpack.LoaderOptionsPlugin({
            
            minimize: inProduction

        }),

        function(){

            this.plugin('done', stats => {

                require('fs').writeFileSync(

                    path.join(__dirname, 'dist/manifest.json'),

                    JSON.stringify(stats.toJson().assetsByChunkName)

                )

            });

        }

    ]
};

if( inProduction ){
    module.exports.plugins.push(

        new webpack.optimize.UglifyJsPlugin()

    );
}