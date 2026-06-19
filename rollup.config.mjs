// @ts-nocheck
import vue from 'rollup-plugin-vue';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== 1. 基础配置与常量 ====================
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const PKG_NAME = pkg.name;       
const OLD_NAME = 'element-ui';   
const TARGET_DIRS = ['directives', 'locale', 'mixins', 'transitions', 'utils'];

// ==================== 2. 自定义核心插件：处理路径与 require ====================
const elementUiEsmHelper = () => {
  const srcDir = path.resolve(__dirname, 'src');

  return {
    name: 'element-ui-esm-helper',
    // 拦截路径解析，强制将 src 下的工具类指向 lib 并设为外部依赖
    resolveId(source, importer) {
      if (!importer) return null;
      if (source.startsWith('.')) {
        const absoluteTarget = path.resolve(path.dirname(importer), source);
        if (absoluteTarget.startsWith(srcDir)) {
          const relativeToSrc = path.relative(srcDir, absoluteTarget).replace(/\\/g, '/');
          const parts = relativeToSrc.split('/');
          
          if (TARGET_DIRS.includes(parts[0])) {
            const cleanPath = relativeToSrc.replace(/\.(js|vue)$/, '');
            return { id: `${PKG_NAME}/lib/${cleanPath}`, external: true };
          }
        }
      }
      return null;
    },
    // 将 vue-popper.js 中的 require 转为 import
    transform(code, id) {
      if (code.includes("require('./popper") || code.includes('require("./popper')) {
        const popperImportPath = `${PKG_NAME}/lib/utils/popper`;
        let transformedCode = `import _PopperLib from '${popperImportPath}';\n` + code;
        transformedCode = transformedCode.replace(/require\(['"]\.\/popper(\.js)?['"]\)/g, '_PopperLib');
        return { code: transformedCode, map: null };
      }
      return null;
    }
  };
};

const externalDeps = [
  'vue', 
  new RegExp(`^${OLD_NAME}/lib/`), 
  new RegExp(`^${PKG_NAME}/lib/`), 
  /^vue-runtime-helpers\//, 
  /^lodash-es/
];

const aliasPaths = (id) => {
  if (id.startsWith(`${OLD_NAME}/src/`)) return id.replace(`${OLD_NAME}/src/`, `${PKG_NAME}/lib/`);
  if (id.startsWith(`${OLD_NAME}/packages/`)) return id.replace(`${OLD_NAME}/packages/`, `${PKG_NAME}/lib/`);
  if (id.startsWith(`${PKG_NAME}/src/`)) return id.replace(`${PKG_NAME}/src/`, `${PKG_NAME}/lib/`);
  if (id.startsWith(`${PKG_NAME}/packages/`)) return id.replace(`${PKG_NAME}/packages/`, `${PKG_NAME}/lib/`);
  return id;
};

// ==================== 3. 基础配置工厂 ====================
const createConfig = (input, outputFile, options = {}) => ({
  input,
  output: {
    file: outputFile,
    format: 'es',
    exports: 'named',
    paths: options.paths || aliasPaths
  },
  external: (id) => {
    if (id === input || path.resolve(__dirname, id) === path.resolve(__dirname, input)) return false;
    if (id.includes('popper')) return true;
    if (id.startsWith(`${PKG_NAME}/lib/`)) return true;
    if (typeof options.external === 'function') return options.external(id);
    return externalDeps.some(dep => dep instanceof RegExp ? dep.test(id) : dep === id);
  },
  plugins: [
    elementUiEsmHelper(),
    alias({
      entries: [
        { find: /^\.?\.\.?\/packages\/([^/]+)\/index\.js$/, replacement: `${PKG_NAME}/lib/$1` },
        { find: new RegExp(`^\\.?\\.\\.?\\/(.*)?${OLD_NAME}/src/`), replacement: `${PKG_NAME}/lib/` }
      ]
    }),
    replace({
      preventAssignment: true,
      values: {
        [`${OLD_NAME}/packages/`]: `${PKG_NAME}/lib/`,
        [`${OLD_NAME}/src/`]: `${PKG_NAME}/lib/`,
        [`${OLD_NAME}/lib/`]: `${PKG_NAME}/lib/`,
        [`${OLD_NAME}`]: PKG_NAME
      }
    }),
    resolve({ extensions: options.extensions || ['.js', '.vue'] }),
    options.useVue && vue({ css: false, compileTemplate: true, runtimeComponentImports: true }),
    babel.default({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      babelrc: false,
      configFile: false,
      extensions: ['.js', '.vue'],
      presets: [
        ['@babel/preset-env', { modules: false, targets: { browsers: ['ie > 9', 'last 2 versions'] } }],
        ['@vue/babel-preset-jsx']
      ]
    }),
    commonjs()
  ].filter(Boolean)
});

// ==================== 4. 打包流水线 ====================
const config = [];

// A. 编译 packages 组件
const componentsDir = path.resolve(__dirname, 'packages');
if (fs.existsSync(componentsDir)) {
  fs.readdirSync(componentsDir).forEach(dir => {
    if (fs.statSync(path.join(componentsDir, dir)).isDirectory() && dir !== 'theme-chalk') {
      config.push(createConfig(`packages/${dir}/index.js`, `lib/${dir}.js`, { useVue: true }));
    }
  });
}

// B. 批量编译工具目录
const getAllJsFiles = (dirPath, fileList = []) => {
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllJsFiles(fullPath, fileList);
    } else if (file.endsWith('.js') && file !== 'popper.js') {
      fileList.push(fullPath);
    }
  });
  return fileList;
};

// 编译工具方法
TARGET_DIRS.forEach(dirName => {
  const targetDir = path.resolve(__dirname, `src/${dirName}`);
  if (fs.existsSync(targetDir)) {
    getAllJsFiles(targetDir).forEach(absolutePath => {
      const relativePath = path.relative(__dirname, absolutePath);
      config.push(createConfig(relativePath, relativePath.replace(/^src\//, 'lib/'), { extensions: ['.js'] }));
    });
  }
});

// C. 编译入口
config.push(createConfig('src/index.js', 'lib/index.js', {
  useVue: true,
  useAlias: true,
  external: (id) => id === 'vue' || /^vue-runtime-helpers\//.test(id) || id.includes('popper') || new RegExp(`^${PKG_NAME}(/|$)`).test(id)
}));

// D. 物理复制 popper.js
const sourcePopper = path.resolve(__dirname, 'src/utils/popper.js');
const targetPopper = path.resolve(__dirname, 'lib/utils/popper.js');
if (fs.existsSync(sourcePopper)) {
  fs.mkdirSync(path.dirname(targetPopper), { recursive: true });
  fs.copyFileSync(sourcePopper, targetPopper);
  console.log(`⚡ [Success] 打包配置完毕: ${PKG_NAME}`);
}

export default config;
