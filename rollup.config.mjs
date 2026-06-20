// @ts-nocheck
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const TARGET_DIRS = ['directives', 'locale', 'mixins', 'transitions', 'utils'];

// ==================== 1. 动态构建多入口对象 ====================
const inputs = {};

// A. 总入口
inputs['index'] = 'src/index.js';

// B. 组件入口 (例如: inputs['button'] = 'packages/button/index.js')
const componentsDir = path.resolve(__dirname, 'packages');
if (fs.existsSync(componentsDir)) {
  fs.readdirSync(componentsDir).forEach(dir => {
    if (fs.statSync(path.join(componentsDir, dir)).isDirectory() && dir !== 'theme-chalk') {
      inputs[dir] = `packages/${dir}/index.js`;
    }
  });
}

// C. 工具类/指令/国际化入口 (保留目录结构，例如: inputs['utils/dom'] = 'src/utils/dom.js')
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
      // 将 src/utils/dom.js 转换为键名 'utils/dom'
      const key = relativePath.replace(/^src\//, '').replace(/\.js$/, '');
      inputs[key] = relativePath;
    });
  }
});

// ==================== 2. 核心 Rollup 统一配置 ====================
export default {
  // 🎯 将所有组件和工具类打包任务一次性交给 Rollup
  input: inputs,
  
  output: {
    dir: 'lib',                  // 产物输出目录
    format: 'es',                // 真正的 ESM 格式
    exports: 'named',
    entryFileNames: '[name].js', // 保持原有文件名和目录结构
    chunkFileNames: 'shared/[name]-[hash].js' // 自动抽离的公共共享块存放地
  },
  
  // 🎯 真正的外部依赖只有第三方库，源码内部的相互引用绝不 external！
  external: [
    'vue',
    /^@babel\/runtime/
  ],

  // treeshake: {
  //   moduleSideEffects: (id) => {
  //     if (id.includes('lodash-es')) {
  //       // 看看吐出来的路径到底是什么，以及是不是引入了没必要的 lodash 内部文件
  //       // console.log('👉 Rollup 正在处理的 lodash 内部文件:', id);
  //       return false;
  //     }
      
  //     return true; 
  //   }
  // },
  
  plugins: [
    // 🎯 核心破局点：源码里经常有 import 'element-ui/src/xxx'
    // 我们用别名把它们拦截并映射回本地的绝对路径，这样 Rollup 就会知道它们是“自己人”，从而正确编译融合
    alias({
      entries: [
        { find: /^element-ui\/src\/(.*)/, replacement: path.resolve(__dirname, 'src/$1') },
        { find: /^element-ui\/packages\/(.*)/, replacement: path.resolve(__dirname, 'packages/$1') }
      ]
    }),
    
    resolve({ extensions: ['.js', '.vue'] }),
    
    vue({ 
      css: false, 
      compileTemplate: true, 
      runtimeComponentImports: true 
    }),
    
    babel.default({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      babelrc: false,
      configFile: false,
      extensions: ['.js', '.vue'],
      presets: [
        ['@babel/preset-env', { modules: false, targets: { chrome: '49' } }], // 对齐你的 Chrome 49 需求
        ['@vue/babel-preset-jsx']
      ],
      plugins: [
        ['@babel/plugin-transform-runtime', { useESModules: true }]
      ]
    }),
    
    commonjs(),

    terser({
      compress: {
        drop_console: true,   // 生产环境移除 console.log
        drop_debugger: true,  // 生产环境移除 debugger
        pure_funcs: ['console.log'] 
      },
      output: {
        comments: false       // 纯净产物：移除所有注释
      }
    })
  ]
};
