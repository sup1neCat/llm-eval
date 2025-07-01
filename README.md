# 大模型安全检测平台前端

基于 Vue 3 + Vite 的大模型安全检测平台前端应用，支持任务管理、后门检测报告、数据集管理、排行榜等功能，界面现代美观，支持响应式设计。

## 技术栈
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material Icons](https://fonts.google.com/icons)
- [pnpm](https://pnpm.io/) 作为包管理工具

## 主要功能
- 首页、数据集、测试平台、排行榜、数据异变、历史记录、任务详情、后门报告等 8 大页面
- 任务状态、日志、指标卡片等通用组件
- 支持任务搜索、筛选、分页、状态展示
- 响应式布局与统一主题

## 安装与启动

### 环境要求
- Node.js >= 16.x
- pnpm >= 8.x

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```
访问 [http://localhost:5173/](http://localhost:5173/) 查看效果。

### 构建生产包
```bash
pnpm build
```

## 目录结构
```
llm-eval/
├── src/
│   ├── components/         # 通用组件与布局组件
│   ├── views/              # 主要页面
│   ├── router/             # 路由配置
│   ├── style.css           # 全局样式（含 Tailwind）
│   └── main.js             # 入口文件
├── public/                 # 公共资源
├── index.html              # HTML 模板
├── tailwind.config.js      # Tailwind 配置
├── postcss.config.js       # PostCSS 配置
├── package.json            # 项目依赖
└── README.md               # 项目说明
```

## 常见问题

### 1. 页面空白/样式无效/图标不显示？
- 请确保依赖已用 `pnpm install` 安装。
- Material Icons 字体已通过 `@material-design-icons/font` 自动引入。
- Tailwind CSS 已在 `src/style.css` 配置。
- 路由已在 `src/main.js` 正确 use。

### 2. 依赖冲突/安装失败？
- 推荐使用 pnpm 管理依赖，避免 npm/yarn 混用。
- 如遇依赖冲突，可尝试 `rm -rf node_modules pnpm-lock.yaml && pnpm install`。

## 贡献
欢迎提 issue 或 PR 改进本项目。

## 联系方式
如有问题或建议，请联系项目维护者。
