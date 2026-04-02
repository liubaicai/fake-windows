# fake-windows

一个使用原生 HTML、CSS、JavaScript 实现的 Windows 桌面模拟项目。页面通过组件化 HTML 片段动态装配，不依赖构建工具或第三方框架，适合用于界面还原、交互练习和静态演示。

目前包含两个版本：

| 目录 | 版本 | 状态 |
|------|------|------|
| `win10/` | Windows 10 | 功能完整 |
| `win7/` | Windows 7 | 功能完整 |

## 项目特点

- 原生前端实现，无需安装依赖。
- 采用组件拆分方式组织页面结构，入口清晰，便于继续扩展应用窗口。
- Win10 还原常见界面元素，包括桌面、任务栏、开始菜单、搜索面板、通知中心等。
- Win7 1:1 复刻经典 Aero Glass 视觉风格，包含开始菜单、系统属性、资源管理器等。
- 支持基础窗口管理交互，包括打开、关闭、最小化、最大化、聚焦、拖拽与缩放。

---

## Windows 10 (`win10/`)

### 已实现内容

**桌面与系统界面**

- 桌面壁纸与桌面图标
- 开始菜单
- 搜索面板
- 任务栏与系统托盘
- 日历、音量、网络弹窗
- 通知中心
- 任务视图
- 桌面、图标、任务栏右键菜单

**窗口与应用**

- 文件资源管理器
- Microsoft Edge 窗口
- 记事本
- Windows PowerShell 模拟终端
- 任务管理器
- 设置
- 控制面板

**交互能力**

- 双击桌面图标打开窗口
- 点击任务栏图标切换或恢复窗口
- 标题栏拖拽窗口
- 标题栏双击最大化/还原
- 八向窗口缩放
- 桌面空白区域框选
- `Esc` 关闭面板类浮层
- `Meta` 键呼出开始菜单

**模拟终端支持命令**：`cls` / `clear` / `date` / `Get-Date` / `echo` / `help` / `dir` / `ls` / `Get-ChildItem` / `whoami` / `hostname` / `ipconfig` / `systeminfo`

---

## Windows 7 (`win7/`)

### 已实现内容

**桌面与系统界面**

- Aero Glass 风格桌面与壁纸
- 桌面图标（计算机、回收站、库、文档、网络等）
- 桌面小工具（时钟、日历、CPU 仪表）
- 任务栏 Aero Glass 效果，含系统托盘与时间
- Pin 图标区（资源管理器、IE、DVD）
- 桌面右键菜单、图标右键菜单
- 任务栏右键菜单

**开始菜单**

- Aero Glass 外观，左右双栏布局
- 左栏：常用程序列表 + 所有程序 + 搜索框
- 右栏：深海军蓝配色，用户头像、文档/图片/音乐/游戏/计算机/控制面板等链接
- 关机按钮行含关机/重启等扩展菜单

**窗口与应用**

- 文件资源管理器（Aero Glass 标题栏、地址栏面包屑、左侧导航树、内容区、预览窗格、详细信息栏）
- IE 浏览器窗口
- 记事本
- Windows 任务管理器（进程/性能/联网/用户四个选项卡）
- 控制面板
- 命令提示符（模拟终端，支持多条命令）
- 系统属性窗口（计算机右键 → 属性，1:1 复刻 Win7 系统页）

**系统属性窗口**

- 顶部面包屑导航（控制面板 › 系统和安全 › 系统）
- 侧边栏：控制面板主页 / 设备管理器 / 远程设置 / 系统保护 / 高级系统设置，以及"另请参阅"区（操作中心 / Windows Update / 性能信息和工具）
- Windows 版本：版本名称 + 授权文字 + Service Pack，右侧显示 Win7 徽标
- 系统区：WEI 分级（蓝色徽章 + Windows 体验指数链接）、处理器、内存、系统类型、笔和触摸
- 计算机名、域和工作组设置：计算机名、完整计算机名、计算机描述、工作组，附"更改设置"按钮
- Windows 激活状态与产品 ID

**交互能力**

- 双击桌面图标打开对应窗口
- 计算机图标右键菜单含"属性"入口
- 标题栏拖拽、最大化/还原、最小化、关闭
- 八向窗口缩放
- Aero Snap（拖至屏幕边缘半屏/最大化）
- 任务栏缩略图预览
- 开始菜单键盘快捷键

---

## 快速开始

项目为纯静态页面，**不能直接双击 `index.html` 运行**（`fetch` 组件加载在 `file://` 下被浏览器拦截）。请使用本地 HTTP 服务。

### 方式 1：Python

```powershell
# 从项目根目录启动（同时覆盖 win10 和 win7）
python -m http.server 8080
```

访问：
- Win10：`http://localhost:8080/win10/`
- Win7：`http://localhost:8080/win7/`

### 方式 2：VS Code Live Server

在 VS Code 中对 `win10/index.html` 或 `win7/index.html` 启动 Live Server 即可。

---

## 目录结构

```text
fake-windows/
├─ README.md
├─ win10/
│  ├─ index.html
│  ├─ component-loader.js
│  ├─ script.js
│  ├─ style.css
│  ├─ components/
│  │  ├─ desktop.html
│  │  ├─ taskbar.html
│  │  ├─ start-menu.html
│  │  ├─ search-panel.html
│  │  ├─ explorer.html
│  │  ├─ notepad.html
│  │  ├─ terminal.html
│  │  ├─ taskmgr.html
│  │  ├─ settings.html
│  │  ├─ edge.html
│  │  ├─ controlpanel.html
│  │  ├─ action-center.html
│  │  ├─ context-menus.html
│  │  ├─ popups.html
│  │  └─ overlays.html
│  └─ icons/
└─ win7/
   ├─ index.html
   ├─ component-loader.js
   ├─ script.js
   ├─ style.css
   ├─ components/
   │  ├─ desktop.html
   │  ├─ taskbar.html
   │  ├─ start-menu.html
   │  ├─ explorer.html
   │  ├─ dialogs.html
   │  ├─ context-menus.html
   │  └─ overlays.html
   └─ icons/
```

## 核心文件说明

每个版本的文件职责相同：

- `index.html`：页面入口，通过 `data-component` 占位符声明需要装配的界面组件。
- `component-loader.js`：负责加载组件 HTML，并在全部组件就绪后再挂载主逻辑脚本。
- `script.js`：核心交互逻辑，包含窗口管理、菜单/弹层控制、右键路由、系统属性填充等行为。
- `style.css`：整体视觉样式，包含窗口、桌面、任务栏、开始菜单、系统属性等所有界面布局。
- `components/`：拆分后的各个界面片段，方便按模块维护。

## 适合做什么

- Windows UI 临摹与前端练习
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