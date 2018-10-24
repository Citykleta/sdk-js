export default {
    input: './dist/src/sdk.js',
    output: [{
        file: './dist/bundle/citykleta.js',
        format: 'iife',
        name: 'Citykleta',
        sourcemap: true
    }, {
        file: './dist/bundle/citykleta.es.js',
        format: 'es',
        sourcemap: true
    }]
};
