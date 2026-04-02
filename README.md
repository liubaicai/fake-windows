# fake-windows

一个使用原生 HTML、CSS、JavaScript 实现的 Windows 10 桌面模拟项目。页面通过组件化 HTML 片段动态装配，不依赖构建工具或第三方框架，适合用于界面还原、交互练习和静态演示。

当前可运行内容位于 `win10/` 目录。

## 项目特点

- 原生前端实现，无需安装依赖。
- 采用组件拆分方式组织页面结构，入口清晰，便于继续扩展应用窗口。
- 还原 Windows 10 常见界面元素，包括桌面、任务栏、开始菜单、搜索面板、通知中心等。
- 支持基础窗口管理交互，包括打开、关闭、最小化、最大化、聚焦、拖拽与缩放。
- 内置模拟应用窗口，包括文件资源管理器、记事本、PowerShell、任务管理器、设置、控制面板、Edge。

## 已实现内容

### 桌面与系统界面

- 桌面壁纸与桌面图标
- 开始菜单
- 搜索面板
- 任务栏与系统托盘
- 日历、音量、网络弹窗
- 通知中心
- 任务视图
- 桌面、图标、任务栏右键菜单

### 窗口与应用

- 文件资源管理器
- Microsoft Edge 窗口
- 记事本
- Windows PowerShell 模拟终端
- 任务管理器
- 设置
- 控制面板

### 交互能力

- 双击桌面图标打开窗口
- 点击任务栏图标切换或恢复窗口
- 标题栏拖拽窗口
- 标题栏双击最大化/还原
- 八向窗口缩放
- 桌面空白区域框选
- `Esc` 关闭面板类浮层
- `Meta` 键呼出开始菜单

### 模拟终端支持命令

- `cls`
- `clear`
- `date`
- `Get-Date`
- `echo`
- `help`
- `dir`
- `ls`
- `Get-ChildItem`
- `whoami`
- `hostname`
- `ipconfig`
- `systeminfo`

## 快速开始

这个项目是纯静态页面，但不能直接双击 `index.html` 运行。

原因是 [win10/component-loader.js](win10/component-loader.js) 会通过 `fetch` 动态加载 [win10/components](win10/components) 下的 HTML 片段，浏览器在 `file://` 场景下通常会拦截这类请求。请使用本地 HTTP 服务启动。

### 方式 1：使用 Python

```powershell
cd win10
python -m http.server 8080
```

然后在浏览器打开：

```text
http://localhost:8080
```

### 方式 2：使用 VS Code Live Server

直接在 VS Code 中打开 [win10/index.html](win10/index.html)，通过 Live Server 启动即可。

## 目录结构

```text
fake-windows/
├─ README.md
└─ win10/
   ├─ index.html
   ├─ component-loader.js
   ├─ script.js
   ├─ style.css
   ├─ desktop.jpg
   ├─ components/
   │  ├─ desktop.html
   │  ├─ taskbar.html
   │  ├─ start-menu.html
   │  ├─ search-panel.html
   │  ├─ explorer.html
   │  ├─ notepad.html
   │  ├─ terminal.html
   │  ├─ taskmgr.html
   │  ├─ settings.html
   │  ├─ edge.html
   │  ├─ controlpanel.html
   │  ├─ action-center.html
   │  ├─ context-menus.html
   │  ├─ popups.html
   │  └─ overlays.html
   └─ icons/
```

## 核心文件说明

- [win10/index.html](win10/index.html)：页面入口，通过 `data-component` 占位符声明需要装配的界面组件。
- [win10/component-loader.js](win10/component-loader.js)：负责加载组件 HTML，并在全部组件就绪后再挂载主逻辑脚本。
- [win10/script.js](win10/script.js)：核心交互逻辑，包含窗口管理、菜单/弹层控制、终端模拟、设置页切换等行为。
- [win10/style.css](win10/style.css)：整体视觉样式与窗口、桌面、任务栏等界面布局。
- [win10/components](win10/components)：拆分后的各个界面片段，方便按模块维护。

## 适合做什么

- Windows 10 UI 临摹与前端练习
- 原生 JavaScript 交互示例
- 静态展示型作品集或教学 Demo
- 扩展更多“系统应用”窗口的实验底座

## 已知限制

- 这是前端模拟项目，不包含真实系统能力，也没有后端数据持久化。
- 部分应用内容以静态展示和交互还原为主，并非完整功能实现。
- 当前没有构建、测试或打包流程，适合直接作为静态资源运行。

## 后续扩展建议

- 为开始菜单和搜索结果补齐更多可打开的应用。
- 给资源管理器、Edge、设置页增加更细化的状态切换。
- 为终端加入更多模拟命令或简单文件系统状态。
- 补充截图、演示 GIF 或在线预览地址。