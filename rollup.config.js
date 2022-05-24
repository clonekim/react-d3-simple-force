import babel from '@rollup/plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
    uglify({ sourcemap: false }),
  ],
  external: ['d3', 'react', 'react-dom'],
};
