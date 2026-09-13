const fs = require('fs');
const path = require('path');

const DEMO_DIRECTIVE = /^:::demo\s+([^\s]+)(?:\s+([^\n]*))?\n:::/gm;
const DEMO_MARKER = 'element-demo-ref:';

function resolveDemoFile(resourcePath, rootContext, demoPath) {
  const roots = [
    rootContext,
    process.cwd(),
    path.resolve(path.dirname(resourcePath), '../..')
  ].filter(Boolean);
  const file = roots
    .map(root => path.resolve(root, 'examples/demos', `${demoPath}.vue`))
    .find(candidate => fs.existsSync(candidate));
  if (!file) {
    const error = new Error(`Cannot find demo "${demoPath}" referenced by ${resourcePath}`);
    error.file = resourcePath;
    throw error;
  }
  return file;
}

function prepareExternalDemos(source, resourcePath, rootContext) {
  const demos = Object.create(null);
  const content = source.replace(DEMO_DIRECTIVE, (match, demoPath, description) => {
    const file = resolveDemoFile(resourcePath, rootContext, demoPath);
    demos[demoPath] = {
      file,
      source: fs.readFileSync(file, 'utf8')
    };
    return `:::demo${description ? ` ${description}` : ''}\n\`\`\`html\n${DEMO_MARKER}${demoPath}\n\`\`\`\n:::`;
  });
  return { content, demos };
}

function getDemoMarker(value) {
  const marker = value.trim();
  return marker.indexOf(DEMO_MARKER) === 0 ? marker.slice(DEMO_MARKER.length).trim() : '';
}

module.exports = {
  DEMO_MARKER,
  prepareExternalDemos,
  getDemoMarker
};
