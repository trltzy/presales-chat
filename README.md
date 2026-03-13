# presales-chat

自动驾驶售前 AI 助手 — 基于 Claude 的 Web 对话应用，帮助售前团队快速、准确地回答客户的技术问题。

## 功能特点

- 🚗 **产品规格查询** — PIX Moving 底盘参数、传感器、算力平台
- 🔌 **集成接口参考** — CAN 2.0B 规格、ROS2 Topic 列表、集成周期
- 🗺️ **场景可行性评估** — ODD 边界、天气条件、特殊场景
- ⚡ **流式回复** — 实时输出，响应迅速
- 🔒 **升级机制** — 商务/安全认证/定制需求自动触发升级话术

## 技术栈

- **前端**: Next.js 15 + React 19 + Tailwind CSS
- **AI**: Anthropic Claude Opus 4 (`@anthropic-ai/sdk`)
- **渲染**: `react-markdown` 支持 Markdown 表格/代码块

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 Anthropic API Key：

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

## 部署

支持部署到任何支持 Node.js 的平台（Vercel、Railway、Docker 等）。

### Vercel 一键部署

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 添加环境变量 `ANTHROPIC_API_KEY`
4. 部署完成

## 项目结构

```
src/
├── app/
│   ├── api/chat/route.ts   # Claude 流式 API 路由
│   ├── page.tsx            # 主聊天界面
│   ├── layout.tsx          # 应用布局
│   └── globals.css         # 全局样式（含 prose-chat Markdown 渲染）
└── lib/
    └── knowledge-base.ts   # 系统提示词 + 知识库
```

## 知识库更新

编辑 `src/lib/knowledge-base.ts` 中的 `SYSTEM_PROMPT` 即可更新知识库内容，包括：

- 支持的底盘型号和规格
- CAN / ROS2 接口参数
- ODD 场景覆盖范围
- 升级规则和联系人

## 相关资源

- [autonomous-driving-presales](https://github.com/trltzy/autonomous-driving-presales) — Claude Skill 版本（用于 Claude Code / Claude Desktop）
