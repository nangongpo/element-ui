// @ts-nocheck
import vue from 'rollup-plugin-vue';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== 通用 Babel 配置 ====================
const babelConfig = babel.default({
  babelHelpers: 'bundled',
  exclude: 'node_modules/**',
  babelrc: false,
  configFile: false,
  extensions: ['.js', '.vue'],
  presets: [
    ['@babel/preset-env',
      { 
        modules: false,
        targets: {
          browsers: ['ie > 9', 'last 2 versions']
        }
      }
    ],
    ['@vue/babel-preset-jsx']
  ]
});

// 核心路径重定向：由于直接输出到 lib/，所有内部引用的 element-ui/src/* 自动重定向到 element-ui/lib/*
const aliasPaths = (id) => {
  if (id.startsWith('element-ui/src/')) {
    return id.replace('element-ui/src/', 'element-ui/lib/');
  }
  return id;
};

// ==================== 1. 组件打包配置 (packages/*) ====================
const componentsDir = path.resolve(__dirname, 'packages');

// 精准过滤样式文件夹 theme-chalk，其余全作为组件打包
const components = fs.readdirSync(componentsDir).filter(dir => {
  const isDir = fs.statSync(path.join(componentsDir, dir)).isDirectory();
  return isDir && dir !== 'theme-chalk'; 
});

const config = components.map(name => ({
  input: `packages/${name}/index.js`,
  output: {
    file: `lib/${name}.js`,         // 👈 核心修改：直接输出到 lib/ 根目录下
    format: 'es',                   // 👈 核心修改：纯 ESM 规范
    exports: 'named',
    paths: aliasPaths
  },
  plugins: [
    resolve({ extensions: ['.js', '.jsx', '.vue'] }),
    vue({ css: false, compileTemplate: true }),
    babelConfig,
    commonjs()
  ],
  external: ['vue', /^element-ui\/lib\//, /^element-ui\/src\//] 
}));

// ==================== 2. 批量编译 src/ 下的五大核心目录 ====================
const srcDirsToCopy = ['directives', 'locale', 'mixins', 'transitions', 'utils'];

srcDirsToCopy.forEach(dirName => {
  const targetDir = path.resolve(__dirname, `src/${dirName}`);
  if (fs.existsSync(targetDir)) {
    const getAllFiles = (dirPath, arrayOfFiles = []) => {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
          arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else if (file.endsWith('.js')) {
          arrayOfFiles.push(path.join(dirPath, file));
        }
      });
      return arrayOfFiles;
    };

    const allJsFiles = getAllFiles(targetDir);
    allJsFiles.forEach(absolutePath => {
      const relativePath = path.relative(__dirname, absolutePath);
      // 👈 核心修改：将 src/ 替换为 lib/，直接平铺
      const outputPath = relativePath.replace(/^src\//, 'lib/');

      config.push({
        input: relativePath,
        output: {
          file: outputPath,
          format: 'es',            // 👈 纯 ESM 规范
          exports: 'named',
          paths: aliasPaths
        },
        plugins: [
          resolve({ extensions: ['.js'] }),
          babelConfig,
          commonjs()
        ],
        external: ['vue', /^element-ui\/lib\//, /^element-ui\/src\//]
      });
    });
  }
});

// ==================== 3. 全量入口追加 (src/index.js) ====================
config.push({
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',          // 👈 核心修改：直接放到 lib/index.js
    format: 'es',                  // 👈 纯 ESM 规范
    exports: 'named',
    paths: aliasPaths
  },
  plugins: [
    resolve({ extensions: ['.js', '.vue'] }),
    vue({ css: false, compileTemplate: true }),
    babelConfig,
    commonjs()
  ],
  external: ['vue', /^element-ui\/src\//]
});

export default config;
