# VibeCoding - 前端视觉优化工具

一款纯前端的网页视觉质量分析工具，支持四大检测维度：色彩对比度、字体排版、间距一致性、可访问性。粘贴 HTML/CSS 代码即可获得评分报告与可操作的优化建议。

## 功能特性

- **色彩对比度检测** — 基于 WCAG 2.1 标准，检测文本与背景的对比度是否达标
- **字体排版分析** — 检查标题层级、字体种类数量、行高/字号比例、最小字号
- **间距一致性检查** — 分析 margin/padding 是否遵循统一的 4px 网格系统
- **可访问性审查** — 检查图片 alt 属性、链接文本语义、表单 label 关联、触摸目标尺寸

## 技术栈

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (状态管理)
- React Router (路由)
- Lucide React (图标)

## 快速开始

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
npm run preview
```

## 使用方式

1. 打开首页，点击「开始分析」
2. 在左侧代码编辑器中粘贴 HTML 和 CSS（或点击「加载示例」一键填入示例代码）
3. 右侧实时预览渲染效果
4. 点击「开始分析」按钮，即可跳转至报告页查看结果

## 项目结构

```
src/
├── engine/           # 分析引擎
│   ├── analyzer.ts   # 引擎入口
│   ├── parser.ts     # HTML/CSS 解析器
│   ├── scorer.ts     # 评分系统
│   └── rules/        # 检测规则
├── pages/            # 页面组件
├── components/ui/    # UI 组件库
├── store/            # 状态管理
└── types/            # TypeScript 类型
```

## License

MIT
