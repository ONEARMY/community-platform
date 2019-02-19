declare var tinymce;
const hasImageClass = (node) => {
  const className = node.attr('class');
  return className && /\bimage\b/.test(className);
};

const toggleContentEditableState = (state) => {
  return (nodes) => {
    let i = nodes.length;
    let node;

    const toggleContentEditable = (n) => {
      n.attr('contenteditable', state ? 'true' : null);
    };

    while (i--) {
      node = nodes[i];

      if (hasImageClass(node)) {
        node.attr('contenteditable', state ? 'false' : null);
        tinymce.Tools.each(node.getAll('figcaption'), toggleContentEditable);
      }
    }
  };
};

const setup = (editor) => {
  editor.on('preInit', () => {
    editor.parser.addNodeFilter('figure', toggleContentEditableState(true));
    editor.serializer.addNodeFilter('figure', toggleContentEditableState(false));
  });
};

export default {
  setup
};