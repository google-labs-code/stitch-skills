const unitlessProperties = new Set([
  'animationIterationCount', 'aspectRatio', 'borderImageOutset',
  'borderImageSlice', 'borderImageWidth', 'boxFlex', 'boxFlexGroup',
  'boxOrdinalGroup', 'columnCount', 'columns', 'flex', 'flexGrow',
  'flexPositive', 'flexShrink', 'flexNegative', 'flexOrder', 'gridArea',
  'gridRow', 'gridRowEnd', 'gridRowSpan', 'gridRowStart', 'gridColumn',
  'gridColumnEnd', 'gridColumnSpan', 'gridColumnStart', 'fontWeight',
  'lineClamp', 'lineHeight', 'opacity', 'order', 'orphans', 'scale',
  'tabSize', 'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity',
  'stopOpacity', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit',
  'strokeOpacity', 'strokeWidth', 'MozAnimationIterationCount', 'MozBoxFlex',
  'MozBoxFlexGroup', 'MozLineClamp', 'msAnimationIterationCount', 'msFlex',
  'msZoom', 'msFlexGrow', 'msFlexNegative', 'msFlexOrder', 'msFlexPositive',
  'msFlexShrink', 'msGridColumn', 'msGridColumnSpan', 'msGridRow',
  'msGridRowSpan', 'WebkitAnimationIterationCount', 'WebkitBoxFlex',
  'WebKitBoxFlexGroup', 'WebkitBoxOrdinalGroup', 'WebkitColumnCount',
  'WebkitColumns', 'WebkitFlex', 'WebkitFlexGrow', 'WebkitFlexPositive',
  'WebkitFlexShrink', 'WebkitLineClamp',
]);

export function escapeHtmlText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function decodeHtmlAttribute(value: string): string {
  return value.replace(/&(amp|quot|lt|gt);/g, (entity) => {
    switch (entity) {
      case '&amp;': return '&';
      case '&quot;': return '"';
      case '&lt;': return '<';
      default: return '>';
    }
  });
}

export function escapeRawText(tagName: string, value: string): string {
  const pattern = tagName === 'style' ? /(<\/|<)(s)(tyle)/gi : /(<\/|<)(s)(cript)/gi;
  return value.replace(pattern, (_, prefix: string, s: string, suffix: string) => {
    const escaped = tagName === 'style'
      ? (s === 's' ? '\\73 ' : '\\53 ')
      : (s === 's' ? '\\u0073' : '\\u0053');
    return prefix + escaped + suffix;
  });
}

export function formatStyleValue(name: string, value: string | number): string {
  if (typeof value !== 'number' || value === 0 || name.startsWith('--') || unitlessProperties.has(name)) {
    return String(value);
  }
  return `${value}px`;
}
