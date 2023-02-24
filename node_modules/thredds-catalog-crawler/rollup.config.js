import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'

const output = (input, format, outputName, plugins) => ({
    input,
    output: {
        name: 'threddsCrawler',
        file: outputName,
        format,
        exports: 'default'
    },
    plugins
})

export default [
    output('./src/entryNode.js', 'cjs', './dist/threddsCrawlerNode.js', [
        json(),
        commonjs(),
        resolve()
    ]),
    output('./src/entryBrowser.js', 'umd', './dist/threddsCrawler.js', [
        json(),
        commonjs(),
        resolve()
    ]),
    output('./src/entryBrowser.js', 'umd', './dist/threddsCrawler.min.js', [
        json(),
        commonjs(),
        resolve(),
        terser()
    ])
]
