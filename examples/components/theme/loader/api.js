import { themeConfig, themeCss } from './local-theme-data';

const ORIGINAL_THEME = '#409EFF';
const ORIGINAL_THEME_LIGHT = [
  '#53a8ff',
  '#66b1ff',
  '#79bbff',
  '#8cc5ff',
  '#a0cfff',
  '#b3d8ff',
  '#c6e2ff',
  '#d9ecff',
  '#ecf5ff'
];
const ORIGINAL_THEME_DARK = '#3a8ee6';

const defaults = {};
themeConfig.forEach(group => {
  group.config.forEach(config => {
    defaults[config.key] = config.value;
  });
});

const variableRegexp = /\$--[A-Za-z0-9-]+/g;

const normalizeColor = color => {
  if (!color || color.charAt(0) !== '#') return color;
  if (color.length === 4) {
    return '#' + color.charAt(1) + color.charAt(1) +
      color.charAt(2) + color.charAt(2) +
      color.charAt(3) + color.charAt(3);
  }
  return color;
};

const mix = (color, tint) => {
  color = normalizeColor(color).replace('#', '');
  const red = parseInt(color.slice(0, 2), 16);
  const green = parseInt(color.slice(2, 4), 16);
  const blue = parseInt(color.slice(4, 6), 16);
  const rgb = [red, green, blue].map(channel => {
    return Math.round(channel + (255 - channel) * tint).toString(16);
  });
  return '#' + rgb.map(value => value.length === 1 ? '0' + value : value).join('');
};

const shade = (color, shade) => {
  color = normalizeColor(color).replace('#', '');
  const red = parseInt(color.slice(0, 2), 16);
  const green = parseInt(color.slice(2, 4), 16);
  const blue = parseInt(color.slice(4, 6), 16);
  const rgb = [red, green, blue].map(channel => {
    return Math.round(channel * (1 - shade)).toString(16);
  });
  return '#' + rgb.map(value => value.length === 1 ? '0' + value : value).join('');
};

const replaceAll = (source, oldValue, newValue) => {
  if (!oldValue || !newValue || oldValue === newValue) return source;
  return source.split(oldValue).join(newValue)
    .split(oldValue.toLowerCase()).join(newValue)
    .split(oldValue.toUpperCase()).join(newValue);
};

const resolveValue = (value, values, stack) => {
  stack = stack || [];
  if (typeof value !== 'string') return value;
  return value.replace(variableRegexp, variable => {
    if (stack.indexOf(variable) > -1) return variable;
    const nextValue = values[variable] || defaults[variable];
    if (!nextValue) return variable;
    return resolveValue(nextValue, values, stack.concat(variable));
  });
};

const buildCss = data => {
  const global = data && data.global || {};
  const local = data && data.local || {};
  const config = Object.assign({}, global, local);
  const values = Object.assign({}, defaults, config);
  let css = themeCss;

  Object.keys(config).forEach(key => {
    const oldValue = resolveValue(defaults[key], defaults);
    const newValue = resolveValue(config[key], values);
    if (!oldValue || !newValue || oldValue.indexOf('$--') > -1 || newValue.indexOf('$--') > -1) return;
    css = replaceAll(css, oldValue, newValue);
  });

  const primary = global['$--color-primary'];
  if (primary && normalizeColor(primary) !== ORIGINAL_THEME) {
    css = replaceAll(css, ORIGINAL_THEME, primary);
    ORIGINAL_THEME_LIGHT.forEach((color, index) => {
      css = replaceAll(css, color, mix(primary, (index + 1) / 10));
    });
    css = replaceAll(css, ORIGINAL_THEME_DARK, shade(primary, 0.1));
  }

  return css;
};

const downloadCss = css => {
  const blob = new Blob([css], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'element-theme.css';
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
};

export const getVars = () => {
  return window.Promise.resolve(JSON.parse(JSON.stringify(themeConfig)));
};

export const updateVars = (data, cb) => {
  const css = buildCss(data || {});
  if (data && data.download) {
    downloadCss(css);
  }
  if (cb) cb({});
  return window.Promise.resolve(css);
};
