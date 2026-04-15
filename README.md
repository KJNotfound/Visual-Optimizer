# VibeCheck - 前端视觉优化工具

> VibeCoding 旗下工具 — 检查你的网页视觉氛围

一款纯前端的网页视觉质量分析工具，支持四大检测维度：色彩对比度、字体排版、间距一致性、可访问性。粘贴 HTML/CSS 代码即可获得评分报告与可操作的优化建议。

## 功能特性

- **色彩对比度检测** — 基于 WCAG 2.1 标准，检测文本与背景的对比度是否达标
- **字体排版分析** — 检查标题层级、字体种类数量、行高/字号比例、最小字号
- **间距一致性检查** — 分析 margin/padding 是否遵循统一的 4px 网格系统
- **可访问性审查** — 检查图片 alt 属性、链接文本语义、表单 label 关联、触摸目标尺寸

## 环境要求

| 工具 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 18.0+ | 22.x |
| npm | 9.0+ | 10.x |

可通过以下命令确认版本：

```bash
node -v
npm -v
```

如尚未安装 Node.js，前往 [https://nodejs.org](https://nodejs.org) 下载 LTS 版本，安装后 npm 会自动附带。

## 安装与运行

### 1. 克隆仓库

```bash
git clone https://github.com/KJNotfound/VibeCoding.git
cd VibeCoding
```

### 2. 安装依赖

```bash
npm install
```

此命令会根据 `package.json` 自动安装所有生产依赖和开发依赖（React、Vite、Tailwind CSS 等），安装完成后项目根目录会生成 `node_modules/` 文件夹。

### 3. 启动开发服务器

```bash
npm run dev
```

启动后终端会输出本地访问地址（默认 `http://localhost:5173`），在浏览器中打开即可使用。开发模式支持热模块替换（HMR），修改代码后浏览器会自动刷新。

### 4. 构建生产版本（可选）

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可部署到任意静态托管服务（Vercel、Netlify、GitHub Pages 等）。

### 5. 本地预览生产版本（可选）

```bash
npm run preview
```

在本地启动一个静态服务器来预览 `dist/` 中的构建产物，默认地址 `http://localhost:4173`。

### 6. 代码检查（可选）

```bash
npm run lint
```

使用 ESLint 检查代码规范。

## 使用方式

1. 打开首页，点击「开始分析」进入分析页面
2. 在左侧编辑器中粘贴你的 HTML 代码和 CSS 代码（也可点击右上角「加载示例」一键填入内置的示例代码）
3. 右侧会实时预览渲染效果
4. 点击底部「开始分析」按钮，自动跳转至报告页
5. 报告页展示总评分、四大维度分数、每个问题的详情与修复建议（CSS 修复代码可一键复制）

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19.x |
| 语言 | TypeScript | 6.x |
| 构建 | Vite | 8.x |
| 样式 | Tailwind CSS | 4.x |
| 状态管理 | Zustand | 5.x |
| 路由 | React Router | 7.x |
| 图标 | Lucide React | 1.x |

## 项目结构

```
src/
├── engine/              # 分析引擎
│   ├── analyzer.ts      # 引擎入口，串联解析→规则→评分
│   ├── parser.ts        # HTML/CSS 解析器（iframe 沙箱渲染）
│   ├── scorer.ts        # 加权评分系统
│   └── rules/           # 检测规则
│       ├── index.ts     # 规则注册表
│       ├── types.ts     # 规则接口定义
│       ├── color-contrast.ts       # 色彩对比度
│       ├── font-hierarchy.ts       # 字体层级
│       ├── spacing-consistency.ts  # 间距一致性
│       └── accessibility.ts        # 可访问性
├── pages/               # 页面组件
│   ├── HomePage.tsx     # 产品落地页
│   ├── AnalyzePage.tsx  # 代码输入 + 实时预览
│   └── ReportPage.tsx   # 分析报告展示
├── components/ui/       # UI 基础组件（shadcn/ui 风格）
├── store/               # Zustand 状态管理
├── types/               # 全局 TypeScript 类型定义
├── lib/                 # 工具函数
├── App.tsx              # 根组件 + 路由配置
├── main.tsx             # 应用入口
└── index.css            # 全局样式 + Tailwind 主题
```

## 常见问题

**Q: `npm install` 报权限错误？**
macOS/Linux 下不要使用 `sudo npm install`，建议通过 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本以避免权限问题。

**Q: 启动后端口被占用？**
可通过 `npx vite --port 3000` 指定其他端口，或在 `vite.config.ts` 中配置 `server.port`。

**Q: 分析引擎如何工作？**
引擎在浏览器端创建一个隐藏的 iframe 沙箱，将用户输入的 HTML/CSS 写入其中进行真实渲染，再通过 `getComputedStyle` 获取实际计算样式，最后逐条运行检测规则。整个过程完全在前端完成，不上传任何代码到服务器。

## License

MIT
