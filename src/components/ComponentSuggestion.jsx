

export class ComponentSuggestion {
  suggestions = [];

  constructor() {
  
  }

  getTypeSuggestion() {
    // 返回建议列表
    return [
      {
        label: 'Button',
        insertText: '"Button": {\n  "type": "Button",\n  "props": {\n    \n  }\n}',
      },
      {
        label: 'Input',
        insertText: '"Input": {\n  "type": "Input",\n  "props": {\n    \n  }\n}',
      },
      {
        label: 'Select',
        insertText: '"Select": {\n  "type": "Select",\n  "props": {\n    \n  }\n}',
      },
      // 可以添加更多组件建议
    ];
  }
}
