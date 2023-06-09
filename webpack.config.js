require('dotenv').config();

const path = require('path');
const glob = require('glob');
const PugPlugin = require('pug-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const PATHS = {
    PAGES: 'src/pages',
};

function getPagesSync() {
    return glob.sync(`{${PATHS.PAGES}/*.pug,${PATHS.PAGES}/**/_index.pug}`).map((file) => {
        const name = file.split(PATHS.PAGES)[1];

        return name.substring(1, name.lastIndexOf('.'));
    });
}

const pages = getPagesSync();

const entries = pages.reduce((obj, page) => {
    obj[page] = path.resolve(__dirname, PATHS.PAGES, `${page}.pug`);

    return obj;
}, {});

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';
    const publicPath = '/';

    return {
        entry: entries,
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath,
        },
        resolve: {
            alias: {
                // use alias to avoid relative paths like `./../../images/`
                '@dist': path.join(__dirname, './dist'),
                '@src': path.join(__dirname, './src'),
                '@assets': path.join(__dirname, './src/assets'),
                '@fonts': path.join(__dirname, './src/assets/fonts'),
                '@images': path.join(__dirname, './src/assets/images'),
                '@scripts': path.join(__dirname, './src/assets/scripts'),
                '@styles': path.join(__dirname, './src/assets/styles'),
                '@components': path.join(__dirname, './src/components'),
                '@layout': path.join(__dirname, './src/layout'),
                '@pages': path.join(__dirname, './src/pages'),
                '@static': path.join(__dirname, './static'),
            },
        },
        plugins: [
            new PugPlugin({
                pretty: isDev,
                js: {
                    filename: '[name].[contenthash:8].js',
                },
                css: {
                    filename: '[name].[contenthash:8].css',
                },
            }),
            new FileManagerPlugin({
                events: {
                    onStart: {
                        delete: ['dist'],
                    },
                    onEnd: {
                        copy: [
                            {
                                source: path.resolve('static'),
                                destination: 'dist',
                            },
                        ],
                    },
                },
            }),
        ],
        module: {
            rules: [
                {
                    test: /.pug$/,
                    loader: PugPlugin.loader, // Pug loader
                    options: {
                        data: {
                            publicPath,
                            env: {
                                isDev,
                                reqEp: process.env.CALLBACK_REQUEST_ENDPOINT_API,
                                reqToken: process.env.CALLBACK_REQUEST_TOKEN,
                                mainLink: process.env.MAIN_LINK,
                                mainLinkParam: process.env.MAIN_LINK_PARAM,
                                mainLinkCookieExpires: process.env.MAIN_LINK_COOKIE_EXPIRES,
                                mainLinkReqEp: process.env.MAIN_LINK_REQUEST_ENDPOINT_API,
                                socials: {
                                    fb: process.env.SOCIAL_FACEBOOK,
                                    ig: process.env.SOCIAL_INSTAGRAM,
                                    tw: process.env.SOCIAL_TWITTER,
                                    yt: process.env.SOCIAL_YOUTUBE,
                                    tg: process.env.SOCIAL_TELEGRAM,
                                },
                                privacyPolicyLink: process.env.PRIVACY_POLICY_LINK,
                                legalNoticeLink: process.env.LEGAL_NOTICE_LINK,
                                contacts: {
                                    email: process.env.CONTACT_EMAIL,
                                },
                                teamLink: process.env.TEAM_LINK,
                                cf: {
                                    accountId: process.env.CF_ACCOUNT_ID,
                                    namespaceId: process.env.CF_NAMESPACE_ID,
                                    bearerToken: process.env.CF_BEARER_TOKEN,
                                    dataExpiration: process.env.CF_DATA_EXPIRATION,
                                },
                            },
                        },
                    },
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(scss|css)$/,
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                },
                {
                    test: /\.(gif|png|jpe?g|webp)$/i,
                    type: 'asset/resource',
                    use: {
                        loader: 'responsive-loader',
                        options: {
                            // output filename of images
                            name: 'media/[name].[hash:8]-[width]w.[ext]',
                        },
                    },
                    generator: {
                        // output filename of images
                        filename: 'media/[name].[hash:8][ext]',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        // output filename of fonts
                        filename: 'media/[name].[hash:8][ext][query]',
                    },
                },
            ],
        },
        optimization: {
            minimize: !isDev,
            minimizer: [
                new TerserPlugin({
                    exclude: [/\.min\.(js|ts)$/],
                    terserOptions: {
                        compress: true,
                        toplevel: true,
                        output: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
                new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            plugins: [
                                ['gifsicle', { interlaced: true }],
                                ['jpegtran', { progressive: true }],
                                ['optipng', { optimizationLevel: 5 }],
                                ['svgo', { name: 'preset-default' }],
                            ],
                        },
                    },
                }),
            ],
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            watchFiles: path.join(__dirname, 'src'),
            port: 9000,
        },
        devtool: isDev ? 'inline-source-map' : false,
    };
};
