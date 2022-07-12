import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import { terser } from "rollup-plugin-terser"
import copy from 'rollup-plugin-copy'
import vue from 'rollup-plugin-vue' // Handle .vue SFC files

const name = "vueVmodelValidator";
const lib = 'vue-vmodel-validator';

const globals = {
    'tslib': 'tslib'
};

export default {
    input: 'src/index.ts', // our source file

    output: [
        {
            // Keep the bundle as an ES module file, suitable for other bundlers
            // and inclusion as a <script type=module> tag in modern browsers
            name,
            file: `lib/${lib}.esm.js`,
            format: 'esm', // the preferred format
            sourcemap: true
        },
        {
            // Universal Module Definition, works as amd, cjs and iife all in one
            name,
            file: `lib/${lib}.umd.js`,
            format: 'umd',
            sourcemap: true,
            globals,
            exports: 'named'
        },
        {
            // A self-executing function, suitable for inclusion as a <script> tag.
            // (If you want to create a bundle for your application, you probably want to use this.)
            name,
            file: `lib/${lib}.min.js`,
            format: 'iife',
            sourcemap: false,
            plugins: [terser()],
            globals,
            exports: 'named'
        },
        {
            name,
            file: `lib/${lib}.cjs.js`,
            format: 'cjs',
            sourcemap: true,
            globals,
            exports: 'named'
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        "tslib",
        "vue"
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            objectHashIgnoreUnknownHack: true,
            module: 'esnext',

            tsconfig: "tsconfig.json",
            tsconfigOverride: { exclude: [
                "node_modules", "tests",
                    "src/main.ts",
                    "src/router.ts",
                    "src/plugins",
                    "src/simulations",
                    "src/views",
                ] }
        }),
        
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
            defaultLang: { script: 'ts' },
            postcssOptions: {
                extract: true
            }
        }),

        copy({
            targets: [
                { src: 'README.md', dest: 'lib/' },
                { src: 'package.json', dest: 'lib/' }
            ]
        })
    ]
};
