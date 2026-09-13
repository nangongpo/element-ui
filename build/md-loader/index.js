const {
  stripScript,
  stripTemplate,
  genInlineComponentText
} = require('./util');
const md = require('./config');
const {
  DEMO_MARKER,
  prepareExternalDemos,
  getDemoMarker
} = require('./demo-resolver');
const path = require('path');

module.exports = function(source) {
  const callback = this.async ? this.async() : null;
  const resourcePath = this.resourcePath || 'markdown';
  const rootContext = this.rootContext || process.cwd();
  const prepared = prepareExternalDemos(source, resourcePath, rootContext);
  if (this.addDependency) {
    Object.keys(prepared.demos).forEach(demoPath => {
      this.addDependency(prepared.demos[demoPath].file);
    });
  }
  // Keep the marker conversion in the loader pipeline as well as the
  // markdown-it rule. This makes the result deterministic for cached or
  // otherwise customized markdown-it instances used by the dev server.
  let content = md.render(prepared.content).replace(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)/g, heading => heading.replace(/\^\(([^)]+)\)/g, (match, value) => {
    const label = value.trim();
    return label ? `<span class="vp-tag ml-1 ${label}">${label}</span>` : match;
  }));
  // The marker is present both in the generated demo comment and in the
  // highlighted source. Replace it only inside code blocks so the comment
  // remains available for component resolution below.
  content = content.replace(/(<code class="html">)([\s\S]*?)(<\/code>)/g, (match, open, code, close) => {
    const source = code.replace(new RegExp(`${DEMO_MARKER}([^\\n]+)`, 'g'), (marker, demoPath) => {
      const demo = prepared.demos[demoPath.trim()];
      return demo ? md.utils.escapeHtml(demo.source) : marker;
    });
    return `${open}${source}${close}`;
  });

  const startTag = '<!--element-demo:';
  const startTagLen = startTag.length;
  const endTag = ':element-demo-->';
  const endTagLen = endTag.length;

  let componenetsString = '';
  let id = 0; // demo 的 id
  let output = []; // 输出的内容
  let start = 0; // 字符串开始位置
  const imports = [];

  let commentStart = content.indexOf(startTag);
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  while (commentStart !== -1 && commentEnd !== -1) {
    let beforeDemo = content.slice(start, commentStart);

    const commentContent = content.slice(commentStart + startTagLen, commentEnd);
    const externalPath = getDemoMarker(commentContent);
    const demoComponentName = `elementDemo${id}`;
    const demoComponentTag = `element-demo${id}`;
    const demoComponentVariable = demoComponentName;
    if (externalPath) {
      const demo = prepared.demos[externalPath];
      const relative = path.relative(path.dirname(resourcePath), demo.file).replace(/\\/g, '/');
      const importPath = relative.indexOf('.') === 0 ? relative : `./${relative}`;
      imports.push(`import ${demoComponentVariable} from ${JSON.stringify(importPath)};`);
    } else {
      const html = stripTemplate(commentContent);
      const script = stripScript(commentContent);
      const demoComponentContent = genInlineComponentText(html, script);
      // Inline demos keep the legacy generated component as a compatibility
      // path while new demos use a normal Vue SFC import.
      output.push(beforeDemo);
      output.push(`<template slot="source"><${demoComponentTag} /></template>`);
      componenetsString += `${demoComponentName}: ${demoComponentContent},`;
      id++;
      start = commentEnd + endTagLen;
      commentStart = content.indexOf(startTag, start);
      commentEnd = content.indexOf(endTag, commentStart + startTagLen);
      continue;
    }
    output.push(beforeDemo);
    output.push(`<template slot="source"><${demoComponentTag} /></template>`);
    componenetsString += `${demoComponentName}: ${demoComponentVariable},`;

    // 重新计算下一次的位置
    id++;
    start = commentEnd + endTagLen;
    commentStart = content.indexOf(startTag, start);
    commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  }

  let pageScript = '';
  if (componenetsString) {
    pageScript = `<script>
      ${imports.join('\n')}
      export default {
        name: 'component-doc',
        components: {
          ${componenetsString}
        }
      }
    </script>`;
  } else if (/^<script(?:\s[^>]*)?>/.test(content)) { // 硬编码，有待改善
    start = content.indexOf('</script>') + '</script>'.length;
    pageScript = content.slice(0, start);
  }

  output.push(content.slice(start));
  const result = `
    <template>
      <section class="content element-doc">
        ${output.join('')}
      </section>
    </template>
    ${pageScript}
  `;
  if (callback) return callback(null, result);
  return result;
};
