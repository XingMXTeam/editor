import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { ComponentSuggestion } from './components/ComponentSuggestion';
import { parseTree, findNodeAtLocation } from 'jsonc-parser';
import './App.css';

function App() {
  const editorRef = useRef(null);

  useEffect(() => {
    // 注意： 要先定义新的语言，然后再创建编辑器实例
    const languageId = 'dada';
    monaco.languages.register({ id: languageId });

    const monacoEditor = monaco.editor.create(editorRef.current, {
      value: '{"dadaConfig": {"componentMap": {}}}',
      language: languageId,
      theme: 'vs-dark',
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      automaticLayout: true, // 自动布局
    });

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      monacoEditor.layout();
    });
    const componentSuggestion = new ComponentSuggestion({});

    // 监听编辑器内容变化
    // monacoEditor.onDidChangeModelContent((event) => {
    //   const value = monacoEditor.getValue();
    //   componentSuggestion.changeContent(value, event, monacoEditor);
    // });

    // 注册自动补全提供者
    monaco.languages.registerCompletionItemProvider(languageId, {
      provideCompletionItems: (model, position) => {
        // const lineContent = model.getLineContent(position.lineNumber);
        // // 检查是否在 componentMap 中
        // if (!lineContent.includes('componentMap')) {
        //   return { suggestions: [] };
        // }

        const text = model.getValue();

        // 使用 jsonc-parser 解析文本
        const rootNode = parseTree(text);
        if (!rootNode) return { suggestions: [] };

        // 查找 "dadaConfig.componentMap" 节点
        const componentMapNode = findNodeAtLocation(rootNode, ['dadaConfig', 'componentMap']);

        // 如果未找到或者 componentMapNode 不是一个对象，直接返回空建议
        if (!componentMapNode || componentMapNode.type !== 'object') {
          return { suggestions: [] };
        }

        // 获取光标行列信息
        const { lineNumber, column } = position;

        // 获取 componentMap 的范围
        const { offset, length } = componentMapNode;
        const componentMapStart = model.getPositionAt(offset);
        const componentMapEnd = model.getPositionAt(offset + length);

        const isInComponentMap =
          (lineNumber > componentMapStart.lineNumber ||
            (lineNumber === componentMapStart.lineNumber && column >= componentMapStart.column)) &&
          (lineNumber < componentMapEnd.lineNumber ||
            (lineNumber === componentMapEnd.lineNumber && column <= componentMapEnd.column));

        if (isInComponentMap) {
          // 获取类型建议
          const typeSuggestions = componentSuggestion.getTypeSuggestion();
          return {
            suggestions: typeSuggestions.map((item) => ({
              label: item.label,
              insertText: item.insertText,
              kind: monaco.languages.CompletionItemKind.Property,
            })),
          };
        }

        return { suggestions: [] };
      },
    });

    return () => {
      monacoEditor.dispose();
      window.removeEventListener('resize', () => {
        monacoEditor.layout();
      });
    };
  }, []);

  return (
    <>
      <div id="container" ref={editorRef} style={{ width: '800px', height: '500px' }} />
    </>
  );
}

export default App;
