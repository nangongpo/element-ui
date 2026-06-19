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
        
        let isDir = false;
        try {
          if (fs.existsSync(absoluteTarget) && fs.statSync(absoluteTarget).isDirectory()) {
            isDir = true;
          }
        } catch (e) {}

        if (absoluteTarget.startsWith(srcDir)) {
          const relativeToSrc = path.relative(srcDir, absoluteTarget).replace(/\\/g, '/');
          const parts = relativeToSrc.split('/');
          
          if (TARGET_DIRS.includes(parts[0])) {
            if (isDir) {
              return { id: `${PKG_NAME}/lib/${relativeToSrc}/index.js`, external: true };
            } else {
              const cleanPath = relativeToSrc.replace(/\.(js|vue)$/, '');
              return { id: `${PKG_NAME}/lib/${cleanPath}.js`, external: true };
            }
          }
        }
      }
      return null;
    },
    // 自动修复 require 和 针对 Vite8 的 Node/SSR 全局 document 报错
    transform(code, id) {
      let transformedCode = code;
      let isChanged = false;

      if (transformedCode.includes("require('./popper") || transformedCode.includes('require("./popper')) {
        const popperImportPath = `${PKG_NAME}/lib/utils/popper.js`;
        transformedCode = `import _PopperLib from '${popperImportPath}';\n` + transformedCode;
        transformedCode = transformedCode.replace(/require\(['"]\.\/popper(\.js)?['"]\)/g, '_PopperLib');
        isChanged = true;
      }

      return isChanged ? { code: transformedCode, map: null } : null;
    }
  };
};

const externalDeps = [
  'vue', 
  new RegExp(`^${OLD_NAME}/lib/`), 
  new RegExp(`^${PKG_NAME}/lib/`), 
  /^vue-runtime-helpers\//, 
  /^lodash-es/,
  /^dayjs/
];

const aliasPaths = (id) => {
  let mappedId = id;

  // 【修正点 1】: 如果拦截到的是对 packages (组件) 的引用，无论原本后缀是什么，一律指向扁平化的 lib/组件名.js
  if (id.startsWith(`${OLD_NAME}/packages/`) || id.startsWith(`${PKG_NAME}/packages/`)) {
    const subPath = id.replace(`${OLD_NAME}/packages/`, '').replace(`${PKG_NAME}/packages/`, '');
    const componentName = subPath.split('/')[0].replace(/\.(js|vue)$/, '');
    return `${PKG_NAME}/lib/${componentName}.js`;
  }
  
  if (id.startsWith(`${OLD_NAME}/src/`)) mappedId = id.replace(`${OLD_NAME}/src/`, `${PKG_NAME}/lib/`);
  else if (id.startsWith(`${PKG_NAME}/src/`)) mappedId = id.replace(`${PKG_NAME}/src/`, `${PKG_NAME}/lib/`);
  
  // 【修正点 2】: 全局路径映射后缀兜底分流
  if (mappedId.startsWith(`${PKG_NAME}/lib/`) && !/\.(js|mjs|cjs|vue)$/.test(mappedId)) {
    const subPath = mappedId.substring(`${PKG_NAME}/lib/`.length);
    
    // 如果该子路径在本地 packages 目录中是一个文件夹（说明它是组件），产物是扁平的 .js 文件
    const possiblePkgPath = path.resolve(__dirname, 'packages', subPath);
    if (fs.existsSync(possiblePkgPath) && fs.statSync(possiblePkgPath).isDirectory()) {
      return `${mappedId}.js`; 
    }
    
    // 如果在本地 src 中是个文件夹（说明是工具类目录，如 locale），产物保留目录结构，追加 /index.js
    const possibleSrcPath = path.resolve(__dirname, 'src', subPath);
    if (fs.existsSync(possibleSrcPath) && fs.statSync(possibleSrcPath).isDirectory()) {
      return `${mappedId}/index.js`;
    }
    
    return `${mappedId}.js`;
  }
  
  return mappedId;
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
    if (id.startsWith(`${PKG_NAME}/lib/`)) return true;
    if (typeof options.external === 'function') return options.external(id);
    return externalDeps.some(dep => dep instanceof RegExp ? dep.test(id) : dep === id);
  },
  plugins: [
    elementUiEsmHelper(),
    alias({
      entries: [
        // 【修正点 3】: 修正本地 packages 相互引用时的别名拦截，直接指向扁平的 .js 文件
        { find: /^\.?\.\.?\/packages\/([^/]+)\/index\.js$/, replacement: `${PKG_NAME}/lib/$1.js` },
        { find: /^\.?\.\.?\/packages\/([^/]+)$/, replacement: `${PKG_NAME}/lib/$1.js` },
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
    } else if (file.endsWith('.js')) {
      fileList.push(fullPath);
    }
  });
  return fileList;
};

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
  external: (id) => id === 'vue' || /^vue-runtime-helpers\//.test(id) || new RegExp(`^${PKG_NAME}(/|$)`).test(id)
}));

export default config;
