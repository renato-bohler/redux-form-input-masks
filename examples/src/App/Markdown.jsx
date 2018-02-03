import React from 'react';
import marked from 'marked';
import Prism from '../vendor/prism';

const prettify = markdown => {
  return markdown.replace(
    /```(?:javascript|js)([\s\S]+?)```/g,
    (match, code) =>
      `<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(
        code,
        Prism.languages.jsx,
      )}</code></pre>`,
  );
};

const renderer = new marked.Renderer();
renderer.heading = (text, level) => {
  const id = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id="${id}">${text} <a href="#${id}">#</a></h${level}>`;
};

const Markdown = ({ content }) => {
  Prism.highlightAll();
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: marked(prettify(content), { renderer }),
      }}
    />
  );
};

export default Markdown;
