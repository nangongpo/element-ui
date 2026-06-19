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

// ==================== 1. 动态读取新包名，锁定源码旧包名 ====================
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const PKG_NAME = pkg.name;       // 🌟 动态获取的新包名 (如 "my-ui")
const OLD_NAME = 'element-ui';   // 🔒 源码中写死的旧包名

// ==================== 2. 基础配置与排除名单 ====================
// 动态构建外部依赖拦截规则
const externalDeps = [
  'vue', 
  new RegExp(`^${OLD_NAME}/lib/`), 
  /^vue-runtime-helpers\//, 
  /^lodash-es/
];

// 路径重定向：针对 Rollup 产物阶段可能残留的各种别名进行最终纠偏
const aliasPaths = (id) => {
  if (id.startsWith(`${OLD_NAME}/src/`)) return id.replace(`${OLD_NAME}/src/`, `${PKG_NAME}/lib/`);
  if (id.startsWith(`${OLD_NAME}/packages/`)) return id.replace(`${OLD_NAME}/packages/`, `${PKG_NAME}/lib/`);
  return id;
};

// 工厂方法：抽离公共插件组合
const createConfig = (input, outputFile, options = {}) => ({
  input,
  output: {
    file: outputFile,
    format: 'es',
    exports: 'named',
    paths: options.paths || aliasPaths
  },
  external: options.external || externalDeps,
  plugins: [
    // 🌟 动态别名替换：防止 Rollup 2 顺着入口解析相对路径时自作聪明加 ./
    options.useAlias && alias({
      entries: [{ find: /^\.\.\/packages\/([^/]+)\/index\.js$/, replacement: `${PKG_NAME}/lib/$1` }]
    }),
    // 🌟 核心绝杀：多维度文本清洗，把源码里的 element-ui 降维打击成新包名
    replace({
      preventAssignment: true,
      values: {
        // 先精确清洗：把 element-ui/packages/xxx 和 element-ui/src/xxx 统一洗成 my-ui/lib/xxx
        [`${OLD_NAME}/packages/`]: `${PKG_NAME}/lib/`,
        [`${OLD_NAME}/src/`]: `${PKG_NAME}/lib/`,
        [`${OLD_NAME}/lib/`]: `${PKG_NAME}/lib/`,
        // 再宽泛清洗：把源码里其他单独出现的 'element-ui' 字符串（如全局名称、挂载原型等）洗成新包名
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

// ==================== 3. 核心打包流水线驱动 ====================
const config = [];

// A. 编译 packages/* 组件文件
const componentsDir = path.resolve(__dirname, 'packages');
if (fs.existsSync(componentsDir)) {
  fs.readdirSync(componentsDir).forEach(dir => {
    if (fs.statSync(path.join(componentsDir, dir)).isDirectory() && dir !== 'theme-chalk') {
      config.push(createConfig(`packages/${dir}/index.js`, `lib/${dir}.js`, { useVue: true }));
    }
  });
}

// B. 批量递归编译 src/ 下的五大工具目录 (跳过 popper.js)
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

['directives', 'locale', 'mixins', 'transitions', 'utils'].forEach(dirName => {
  const targetDir = path.resolve(__dirname, `src/${dirName}`);
  if (fs.existsSync(targetDir)) {
    getAllJsFiles(targetDir).forEach(absolutePath => {
      const relativePath = path.relative(__dirname, absolutePath);
      config.push(createConfig(relativePath, relativePath.replace(/^src\//, 'lib/'), { extensions: ['.js'] }));
    });
  }
});

// C. 编译并格式化全量入口 (src/index.js)
config.push(createConfig('src/index.js', 'lib/index.js', {
  useVue: true,
  useAlias: true,
  paths: (id) => {
    if (id.startsWith(`${OLD_NAME}/src/`)) return id.replace(`${OLD_NAME}/src/`, `${PKG_NAME}/lib/`);
    return id;
  },
  // 外部依赖拦截：只要是以新包名开头的，或者是 vue、vue-runtime-helpers，都作为外部依赖隔离
  external: (id) => id === 'vue' || /^vue-runtime-helpers\//.test(id) || new RegExp(`^${PKG_NAME}(/|$)`).test(id)
}));

// ==================== 4. 物理流后置逻辑（免编译直接复制） ====================
const sourcePopper = path.resolve(__dirname, 'src/utils/popper.js');
const targetPopper = path.resolve(__dirname, 'lib/utils/popper.js');

if (fs.existsSync(sourcePopper)) {
  fs.mkdirSync(path.dirname(targetPopper), { recursive: true });
  fs.copyFileSync(sourcePopper, targetPopper);
  console.log(`⚡ [Success] 物理流转换闭环大功告成！当前包名: ${PKG_NAME}`);
}

export default config;
