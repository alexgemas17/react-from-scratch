import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel';

export default defineConfig({
    plugins: [
        babel({
            babelConfig: {
                babelrc: false,
                configFile: false,
                plugins: ['@babel/plugin-transform-react-jsx']
            }
        })
    ],
})