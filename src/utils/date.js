import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

export const masks = {
  default: 'ddd MMM dd yyyy HH:mm:ss',
  shortDate: 'M/d/yy',
  mediumDate: 'MMM d, yyyy',
  longDate: 'MMMM d, yyyy',
  fullDate: 'dddd, MMMM d, yyyy',
  shortTime: 'HH:mm',
  mediumTime: 'HH:mm:ss',
  longTime: 'HH:mm:ss.SSS'
};

// 极其严格的 Token 转换映射（基于原 fecha 的 formatFlags/parseFlags 逻辑）
const tokenMap = {
  yyyy: 'YYYY',
  yy: 'YY',
  dddd: 'dddd',
  ddd: 'ddd',
  dd: 'DD', // fecha 的 dd 是每月几号(01-31) -> Day.js 的 DD
  d: 'D', // fecha 的 d 是每月几号(1-31) -> Day.js 的 D
  DD: '[0]d', // fecha 的 DD 是星期几(00-06) -> Day.js 本身不支持，用 [0]d 骚操作等价平替
  D: 'd' // fecha 的 D 是星期几(0-6) -> Day.js 的 d
};

/**
 * 核心转换器：将旧的 fecha 掩码转换为 Day.js 掩码
 */
function convertMask(mask) {
  if (!mask) return masks.default;
  const targetMask = masks[mask] || mask;

  // 匹配中括号包裹的字面量，或者需要转换的旧 Token
  // 注意这里的顺序：长 Token（yyyy）必须排在短 Token（yy）前面，避免被截断
  return targetMask.replace(/\[([^\]]+)\]|(yyyy|yy|dddd|ddd|dd|d|DD|D)/g, (match, literal, token) => {
    if (literal) return `[${literal}]`;
    return tokenMap[token] || token;
  });
}

function getLocale(i18nSettings) {
  if (!i18nSettings) return undefined;
  if (typeof i18nSettings === 'string') return i18nSettings;

  const localeId = `custom-${Math.random().toString(36).slice(2, 11)}`;
  dayjs.locale({
    name: localeId,
    weekdays: i18nSettings.dayNames,
    weekdaysShort: i18nSettings.dayNamesShort,
    months: i18nSettings.monthNames,
    monthsShort: i18nSettings.monthNamesShort,
    ordinal: i18nSettings.DoFn ? (n) => i18nSettings.DoFn(n) : undefined,
    meridiem: (hour, minute, isLower) => {
      if (!i18nSettings.amPm) return hour < 12 ? 'am' : 'pm';
      const ampm = hour < 12 ? i18nSettings.amPm[0] : i18nSettings.amPm[1];
      return isLower ? ampm.toLowerCase() : ampm.toUpperCase();
    }
  }, null, true);

  return localeId;
}

export function format(dateObj, mask, i18nSettings) {
  let d = dayjs(dateObj);
  if (!d.isValid()) throw new Error('Invalid Date in format');

  const locale = getLocale(i18nSettings);
  if (locale) d = d.locale(locale);

  return d.format(convertMask(mask));
}

export function parse(dateStr, mask, i18nSettings) {
  if (typeof mask !== 'string') throw new Error('Invalid format in parse');
  if (!dateStr || dateStr.length > 1000) return null;

  const convertedMask = convertMask(mask);
  const locale = getLocale(i18nSettings);

  // 针对含有 [0]d 的特殊 format 字符串，在 parse 时调整为可识别的 d
  const parseMask = convertedMask.replace(/\[0\]d/g, 'd');

  const d = dayjs(dateStr, parseMask, locale, true);
  return d.isValid() ? d.toDate() : null;
}

export const fecha = {
  format,
  parse,
}

export default fecha
