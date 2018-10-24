export default {
    input: './dist/src/sdk.js',
    output: [{
        file: './dist/bundle/index.js',
        format: 'cjs'
    }, {
        file: './dist/bundle/module.js',
        format: 'es'
    }]
};
