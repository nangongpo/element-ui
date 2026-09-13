const mdContainer = require('markdown-it-container');

module.exports = md => {
  md.use(mdContainer, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/);
    },
    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : '';
        const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : '';
        return `<demo-block>
        ${description ? `<div>${md.render(description)}</div>` : ''}
        <!--element-demo: ${content}:element-demo-->
        `;
      }
      return '</demo-block>';
    }
  });

  const renderCustomBlock = (type, title) => ({
    validate(params) {
      return params.trim() === type;
    },
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        return `<div class="${type} custom-block"><p class="custom-block-title">${title}</p>`;
      }
      return '</div>';
    }
  });

  md.use(mdContainer, 'tip', renderCustomBlock('tip', 'TIP'));
  md.use(mdContainer, 'warning', renderCustomBlock('warning', 'WARNING'));
};
