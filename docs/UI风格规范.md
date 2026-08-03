# md2page UI 风格规范

供其他 AI 或开发者参考，生成风格一致的前端界面。

## 整体风格

- 清爽、克制、留白充足，类似 GitHub 文档 + Vue 官网的混合气质
- 亮色为主，绿色主色调，CSS 变量命名兼容未来暗色模式扩展
- 圆角柔和（6-8px），阴影极轻，边框用半透明主色
- 字体使用系统原生字体栈，代码用等宽字体
- 交互反馈轻量：hover 变色/变背景，无夸张动画

## CSS 变量

```css
:root {
  /* 主色 */
  --color-primary: #42b883;
  --color-primary-hover: #359d6e;
  --color-primary-bg: rgba(66, 184, 131, 0.1);
  --color-link: #2e8b65;

  /* 文字 */
  --color-text: #1a1e1b;
  --color-text-secondary: #505856;
  --color-text-muted: #6b7570;

  /* 背景 */
  --color-bg: #ffffff;
  --color-bg-secondary: #f7f8f7;
  --color-bg-tertiary: #eef0ee;

  /* 边框 */
  --color-border: rgba(66, 184, 131, 0.25);
  --color-border-light: rgba(66, 184, 131, 0.15);

  /* 语义色 */
  --color-error-text: #cf222e;
  --color-error-bg: #ffebe9;
  --color-success-text: #1a7f37;
  --color-success-bg: #dafbe1;
  --color-warning-text: #9a6700;
  --color-warning-bg: #fff8c5;
  --color-info-text: #0969da;
  --color-info-bg: #ddf4ff;

  /* 过渡 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Z-index 层级 */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-sidebar: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-tooltip: 600;
  --z-toast: 700;
}
```

## 色彩体系

```
主色（绿）:       #42b883
主色悬停:         #359d6e
主色背景:         rgba(66, 184, 131, 0.1)
链接色:           #2e8b65（白底对比度 ≥ 4.5:1）

文字主色:         #1a1e1b
文字次要:         #505856
文字辅助:         #6b7570（白底对比度 ≥ 4.5:1）

背景主色:         #ffffff
背景次要:         #f7f8f7
背景三级:         #eef0ee

边框:             rgba(66, 184, 131, 0.25)
边框浅:           rgba(66, 184, 131, 0.15)

错误文字:         #cf222e
错误背景:         #ffebe9
成功文字:         #1a7f37
成功背景:         #dafbe1
警告文字:         #9a6700
警告背景:         #fff8c5
信息文字:         #0969da
信息背景:         #ddf4ff
```

> 注意：主色 `#42b883` 在白底上对比度不足 4.5:1，仅用于装饰性元素（背景、边框、图标）。
> 承载可读文字的场景（链接、标签）使用加深色 `#2e8b65`。

## 字体

```css
/* 正文 */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
font-size: 15px;
line-height: 1.65;

/* 侧边栏/辅助信息 */
font-size: 13px;
line-height: 1.5;

/* 代码 */
font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
font-size: 13px;
line-height: 1.45;
```

> 正文 15px + 行高 1.65 兼顾中文阅读舒适度和信息密度。

## 布局特征

- 三栏布局：左侧导航树 + 中间内容区 + 右侧文档大纲
- 内容区正文最大宽度 780px，水平居中，保证每行 65-75 字符的最佳阅读宽度
- 侧边栏默认宽度 260px，可拖拽调整（min: 200px, max: 380px）
- 面板之间用 1px 边框分隔，不用阴影
- 移动端自动切换为抽屉式导航

## 组件风格

### 按钮

- 主按钮：绿色背景 + 白色文字，圆角 var(--radius-sm)
- 次要按钮：透明背景 + 边框，hover 时边框变绿
- 图标按钮：22-32px 正方形，无边框，hover 加浅灰背景
- 禁用态：opacity 0.4，cursor: not-allowed
- focus 态：`outline: 2px solid var(--color-primary); outline-offset: 2px`

### 输入框

- 1px 边框，圆角 var(--radius-md)
- focus 时边框变绿 + 外发光 `box-shadow: 0 0 0 3px rgba(66,184,131,0.15)`
- placeholder 用辅助色

### 代码块

- 浅灰背景 #f7f9f8，绿色半透明边框
- 顶部 header 栏显示语言标签 + 操作按钮（复制、换行切换）
- header 背景 #eef1ef，字号 12px
- 代码区带行号，行号列右侧有 1px 分隔线
- 高亮主题：GitHub Light 风格

### 表格

- 1px 边框，表头背景 #f2f5f3，加粗
- 偶数行无背景色，hover 行加浅色 #f7f9f8
- 宽表格容器 `overflow-x: auto`，移动端可横向滚动
- 支持全屏查看弹窗

### 引用块

- 左侧 3px 绿色竖线
- 浅绿背景 rgba(66,184,131,0.03)
- 右侧圆角 var(--radius-md)

### 提示框（Admonition）

- 四种类型：info / success / warning / error
- 左侧 3px 对应语义色竖线
- 背景使用对应语义色的浅色背景
- 标题行使用对应语义色文字 + 图标

### 导航项

- 左侧树形结构，缩进层级
- 选中态：浅绿背景 + 左侧 3px 绿色边框 + 绿色文字
- hover：浅灰背景
- focus：同按钮 focus 态，outline 可见
- 文件夹可折叠，带 chevron 图标

### 弹窗/浮层

- 白色背景，1px 边框，圆角 var(--radius-xl)
- 阴影 `0 4px 16px rgba(0,0,0,0.1)`
- 遮罩 rgba(0,0,0,0.4)
- 出入动画：opacity + translateY，duration var(--transition-normal)

## 间距规律

- 组件内部 padding：8-16px
- 元素间距：4-12px
- 段落间距：14px
- 标题上方间距：20-28px
- 页面边距：20-32px

## 交互细节

- 所有 hover/focus 过渡：transition var(--transition-fast)
- 按钮点击无 scale 变化，仅颜色变化
- 展开/折叠动画：max-height + opacity，duration var(--transition-normal)
- 复制成功反馈：绿色文字 + 浅绿背景，1.5s 后消失
- 工具提示（tooltip）：深色背景 #1f2328，白色文字，11px，圆角 var(--radius-sm)

### 滚动条

```css
/* WebKit */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: #c1c5c3; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #a0a5a2; }

/* Firefox */
scrollbar-width: thin;
scrollbar-color: #c1c5c3 transparent;
```

### 键盘可访问性

- 所有可交互元素必须有可见的 focus 态
- focus 样式：`outline: 2px solid var(--color-primary); outline-offset: 2px`
- Tab 顺序遵循视觉阅读顺序
- 弹窗打开时 focus 陷阱，关闭后恢复焦点

## 图标

- 使用 Lucide 图标库
- 图标尺寸：14-20px，与文字对齐
- 颜色跟随文字层级（主色/次要/辅助）

## 响应式断点

```
桌面端：> 1200px（三栏完整显示）
平板端：768-1200px（隐藏右侧大纲）
移动端：< 768px（抽屉导航 + 浮动按钮）
```

## Z-index 层级

```
下拉菜单:     100
吸顶元素:     200
侧边栏:       300
弹窗遮罩:     400
弹窗:         500
Tooltip:      600
Toast 通知:   700
```

## 代码高亮配色（GitHub Light）

```
关键字:     #d73a49
函数名:     #6f42c1
数字/属性:  #005cc5
字符串:     #032f62
内置对象:   #e36209
注释:       #6a737d
标签名:     #22863a
```
