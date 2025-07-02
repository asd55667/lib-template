import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
// import terser from '@rollup/plugin-terser'; // Keep terser commented out as in the original

export function createConfig(packageJson, tsconfig = './tsconfig.json') {
  const peerDependenciesKeys = packageJson.peerDependencies
    ? Object.keys(packageJson.peerDependencies)
    : [];
  const dtsInputFile = 'dist/index.d.ts';
  const dtsOutputFile = packageJson.types || 'dist/index.d.ts';

  return [
    {
      input: 'src/index.ts',
      output: [
        {
          file: packageJson.main,
          format: 'cjs',
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
        {
          file: packageJson.module,
          format: 'esm',
          sourcemap: true,
          sourcemapExcludeSources: true,
        },
      ],
      plugins: [
        resolve(),
        commonjs(),
        typescript({ tsconfig }),
        // terser(),
      ],
      external: peerDependenciesKeys,
    },
    {
      input: dtsInputFile,
      output: [{ file: dtsOutputFile, format: 'es' }],
      plugins: [dts()],
      external: [/\.css$/, ...peerDependenciesKeys],
    },
  ];
}
