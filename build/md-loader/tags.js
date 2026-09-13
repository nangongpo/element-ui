// Convert documentation markers such as `^(beta)` into the same inline tag
// used by the Element Plus documentation site.
module.exports = md => {
  md.inline.ruler.before('text', 'doc-tag', (state, silent) => {
    const marker = '^(';
    if (state.src.slice(state.pos, state.pos + marker.length) !== marker) return false;

    const end = state.src.indexOf(')', state.pos + marker.length);
    if (end === -1) return false;

    const value = state.src.slice(state.pos + marker.length, end).trim();
    if (!value) return false;
    if (!silent) {
      const token = state.push('html_inline', '', 0);
      token.content = `<span class="vp-tag ml-1 ${value}">${value}</span>`;
    }
    state.pos = end + 1;
    return true;
  });
};
