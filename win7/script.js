(function () {
  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const startMenu = $("start-menu");
  const startBtn = $("start-btn");
  const desktop = $("desktop");
  const desktopIcons = $("desktop-icons");
  const selectionBox = $("selection-box");
  const powerPopup = $("power-popup");
  const taskbarTooltip = $("taskbar-tooltip");
  const toast = $("toast");
  const trayBalloon = $("tray-balloon");
  const snapPreview = $("snap-preview");
  const shutdownScreen = $("shutdown-screen");

  let zCounter = 300;
  let focusedWindowId = null;
  let iconContextTarget = null;
  let currentExplorerLocation = "computer";
  let currentExplorerQuery = "";
  let explorerSelectionId = null;
  let currentNotepadDoc = "untitled";
  let currentIePage = "home";
  let currentMediaId = "aero-dreams";
  let mediaPlaying = true;
  let mediaProgress = 18;
  let toastTimer = null;
  let tooltipTimer = null;
  let mediaTimer = null;
  let gadgetTimer = null;
  let trayBalloonTimer = null;
  let desktopDateSeed = 0;
  let explorerViewMode = "details";
  let explorerPreviewVisible = true;
  let lastExplorerItems = [];
  let lastExplorerData = null;

  let dragState = null;
  let resizeState = null;
  let selectionState = null;
  let taskmgrSelectionId = null;

  const snapThreshold = 18;

  const wins = {
    "explorer-win": { tb: "tb-explorer", pinned: true, title: "Windows 资源管理器" },
    "ie-win": { tb: "tb-ie", pinned: true, title: "Internet Explorer" },
    "media-win": { tb: "tb-media", pinned: true, title: "Windows Media Player" },
    "notepad-win": { tb: "tb-notepad", pinned: false, title: "记事本" },
    "terminal-win": { tb: "tb-terminal", pinned: false, title: "命令提示符" },
    "controlpanel-win": { tb: "tb-controlpanel", pinned: false, title: "控制面板" },
    "taskmgr-win": { tb: "tb-taskmgr", pinned: false, title: "Windows 任务管理器" },
    "personalization-win": { title: "个性化" },
    "display-win": { title: "屏幕分辨率" },
    "properties-win": { title: "属性" },
  };

  const themes = {
    default: {
      accentTop: "rgba(118, 192, 255, 0.88)",
      accentMid: "rgba(56, 126, 201, 0.88)",
      accentBottom: "rgba(11, 45, 114, 0.92)",
      startRight: "rgba(20, 69, 142, 0.78)",
      startBottom: "rgba(7, 33, 88, 0.9)",
      taskbarTop: "rgba(141, 208, 255, 0.84)",
      taskbarBottom: "rgba(6, 33, 92, 0.92)",
    },
    forest: {
      accentTop: "rgba(170, 228, 144, 0.88)",
      accentMid: "rgba(58, 140, 91, 0.88)",
      accentBottom: "rgba(17, 71, 63, 0.92)",
      startRight: "rgba(31, 104, 84, 0.8)",
      startBottom: "rgba(10, 59, 56, 0.94)",
      taskbarTop: "rgba(172, 230, 170, 0.84)",
      taskbarBottom: "rgba(13, 61, 70, 0.92)",
    },
    sunset: {
      accentTop: "rgba(255, 203, 143, 0.9)",
      accentMid: "rgba(214, 105, 73, 0.88)",
      accentBottom: "rgba(99, 33, 103, 0.92)",
      startRight: "rgba(118, 54, 116, 0.8)",
      startBottom: "rgba(72, 28, 80, 0.94)",
      taskbarTop: "rgba(255, 204, 147, 0.82)",
      taskbarBottom: "rgba(79, 28, 88, 0.92)",
    },
  };

  const notepadDocs = {
    untitled: {
      name: "无标题",
      content: "",
    },
    readme: {
      name: "README.txt",
      content:
        "欢迎使用 Windows 7 网页复刻。\n\n" +
        "当前可体验的内容:\n" +
        "- 开始菜单搜索、所有程序、电源菜单\n" +
        "- 桌面图标、右键菜单、新建文件夹和文本文档\n" +
        "- Windows 资源管理器、Internet Explorer、记事本\n" +
        "- 命令提示符、Windows Media Player、控制面板\n" +
        "- 任务管理器、个性化、屏幕分辨率、属性面板\n\n" +
        "该 win7 页面按照隔壁 win10 的组件化装配方式重新组织，\n便于继续扩展更多窗口和系统功能。",
    },
    note: {
      name: "桌面便笺.txt",
      content:
        "待办事项\n\n" +
        "1. 校准开始菜单的细节阴影\n" +
        "2. 给资源管理器增加更多目录示例\n" +
        "3. 后续可以补网络共享、回收站和库视图\n",
    },
  };

  const mediaLibrary = [
    {
      id: "aero-dreams",
      title: "Aero Dreams.mp3",
      subtitle: "Windows Sample Library",
      duration: "3:41",
      icon: "icons/mp3.png",
      type: "MP3 音频",
    },
    {
      id: "startup-chime",
      title: "Startup Chime.mp3",
      subtitle: "System Sounds",
      duration: "1:12",
      icon: "icons/mp3.png",
      type: "MP3 音频",
    },
    {
      id: "demo-reel",
      title: "Aero Tour.mp4",
      subtitle: "Windows Showcase",
      duration: "4:26",
      icon: "icons/mp4.png",
      type: "MP4 视频",
    },
    {
      id: "photo-disc",
      title: "Photo CD Collection",
      subtitle: "Removable Media",
      duration: "57 项",
      icon: "icons/cd.png",
      type: "媒体光盘",
    },
  ];

  const taskmgrProcesses = [
    { id: "explorer", name: "explorer.exe", status: "正在运行", cpu: 2, memory: 86 },
    { id: "dwm", name: "dwm.exe", status: "正在运行", cpu: 3, memory: 64 },
    { id: "iexplore", name: "iexplore.exe", status: "正在运行", cpu: 6, memory: 128 },
    { id: "notepad", name: "notepad.exe", status: "正在运行", cpu: 1, memory: 18 },
    { id: "cmd", name: "cmd.exe", status: "正在运行", cpu: 2, memory: 22 },
    { id: "wmp", name: "wmplayer.exe", status: "正在运行", cpu: 4, memory: 156 },
    { id: "sidebar", name: "sidebar.exe", status: "正在运行", cpu: 1, memory: 31 },
    { id: "control", name: "control.exe", status: "正在运行", cpu: 1, memory: 41 },
  ];

  const trayNotifications = [
    {
      id: "update-ready",
      type: "warning",
      title: "Windows Update",
      body: "有 2 个重要更新可供安装。",
      time: "今天 12:10",
    },
    {
      id: "backup-ok",
      type: "info",
      title: "备份和还原",
      body: "上一次备份已成功完成。",
      time: "今天 09:42",
    },
    {
      id: "security-center",
      type: "error",
      title: "操作中心",
      body: "请检查防火墙和病毒防护的建议项。",
      time: "今天 08:30",
    },
  ];

  const baseExplorerLocations = {
    computer: {
      title: "计算机",
      subtitle: "查看此计算机上的驱动器、设备和快速访问入口。",
      breadcrumb: [{ label: "计算机", location: "computer" }],
      defaultView: "details",
      items: [
        {
          id: "drive-c",
          group: "硬盘驱动器",
          name: "本地磁盘 (C:)",
          date: "2026/04/02 09:41",
          type: "本地磁盘",
          size: "86.2 GB 可用 / 118 GB",
          icon: "icons/drive.png",
          description: "Windows 与系统程序所在的位置。",
          open: { app: "explorer", location: "system" },
        },
        {
          id: "drive-d",
          group: "硬盘驱动器",
          name: "数据 (D:)",
          date: "2026/04/02 08:13",
          type: "本地磁盘",
          size: "201 GB 可用 / 256 GB",
          icon: "icons/drive.png",
          description: "存放文档、媒体库与项目文件。",
          open: { app: "explorer", location: "documents" },
        },
        {
          id: "libraries-shell",
          group: "其他",
          name: "库",
          date: "2026/04/02 10:22",
          type: "系统文件夹",
          size: "4 个库",
          icon: "icons/folder.png",
          description: "集中查看文档、图片、音乐和视频。",
          open: { app: "explorer", location: "libraries" },
        },
        {
          id: "cam",
          group: "具有可移动存储的设备",
          name: "USB 摄像头",
          date: "2026/04/02 10:08",
          type: "设备",
          size: "已连接",
          icon: "icons/camera.png",
          description: "高清 USB 摄像头，支持 1080p。",
          open: { app: "properties", name: "USB 摄像头", kind: "设备", icon: "icons/camera.png", location: "计算机", description: "高清 USB 摄像头，支持 1080p。" },
        },
        {
          id: "dvd",
          group: "具有可移动存储的设备",
          name: "DVD RW 驱动器 (E:)",
          date: "2026/04/01 18:02",
          type: "可移动存储",
          size: "就绪",
          icon: "icons/cd.png",
          description: "插入媒体后可在 Windows Media Player 中浏览。",
          open: { app: "media", media: "photo-disc" },
        },
      ],
    },
    system: {
      title: "本地磁盘 (C:)",
      subtitle: "Windows 和程序文件所在的位置。",
      breadcrumb: [
        { label: "计算机", location: "computer" },
        { label: "本地磁盘 (C:)", location: "system" },
      ],
      defaultView: "details",
      items: [
        {
          id: "windows-dir",
          group: "文件夹",
          name: "Windows",
          date: "2026/04/02 10:18",
          type: "文件夹",
          size: "",
          icon: "icons/folder.png",
          description: "包含系统文件和配置。",
          open: { app: "properties", name: "Windows", kind: "系统文件夹", icon: "icons/folder.png", location: "C:\\", description: "包含系统文件和配置。" },
        },
        {
          id: "users-dir",
          group: "文件夹",
          name: "Users",
          date: "2026/04/02 09:55",
          type: "文件夹",
          size: "",
          icon: "icons/folder.png",
          description: "用户目录和个人资料。",
          open: { app: "explorer", location: "documents" },
        },
        {
          id: "program-files",
          group: "文件夹",
          name: "Program Files",
          date: "2026/04/02 10:00",
          type: "文件夹",
          size: "",
          icon: "icons/folder.png",
          description: "安装程序与共享组件。",
          open: { app: "controlpanel" },
        },
        {
          id: "boot-log",
          group: "文件",
          name: "bootlog.txt",
          date: "2026/04/02 08:01",
          type: "文本文档",
          size: "3 KB",
          icon: "icons/txt.png",
          description: "系统启动日志的示例文本。",
          open: { app: "notepad", doc: "note" },
        },
      ],
    },
    libraries: {
      title: "库",
      subtitle: "按类型统一查看文档、图片、音乐和视频。",
      breadcrumb: [
        { label: "库", location: "libraries" },
      ],
      defaultView: "tiles",
      items: [
        {
          id: "libraries-documents",
          group: "库",
          name: "文档",
          date: "2026/04/02 10:32",
          type: "库",
          size: "4 个位置",
          icon: "icons/folder.png",
          description: "包括桌面、文档和项目目录中的工作文件。",
          open: { app: "explorer", location: "documents" },
        },
        {
          id: "libraries-pictures",
          group: "库",
          name: "图片",
          date: "2026/04/02 09:30",
          type: "库",
          size: "168 项",
          icon: "icons/jpg.png",
          description: "壁纸、屏幕截图和示例照片。",
          open: { app: "explorer", location: "pictures" },
        },
        {
          id: "libraries-music",
          group: "库",
          name: "音乐",
          date: "2026/04/02 09:12",
          type: "库",
          size: "42 项",
          icon: "icons/mp3.png",
          description: "Aero 示例音乐和系统音效。",
          open: { app: "explorer", location: "music" },
        },
        {
          id: "libraries-videos",
          group: "库",
          name: "视频",
          date: "2026/04/01 21:19",
          type: "库",
          size: "12 项",
          icon: "icons/mp4.png",
          description: "演示视频与录屏素材。",
          open: { app: "explorer", location: "videos" },
        },
      ],
    },
    documents: {
      title: "文档",
      subtitle: "最近处理过的工作文件和项目草稿。",
      breadcrumb: [
        { label: "库", location: "libraries" },
        { label: "文档", location: "documents" },
      ],
      defaultView: "details",
      items: [
        {
          id: "readme-doc",
          group: "今天",
          name: "README.txt",
          date: "2026/04/02 10:32",
          type: "文本文档",
          size: "4 KB",
          icon: "icons/txt.png",
          description: "当前 Win7 复刻的说明文档。",
          open: { app: "notepad", doc: "readme" },
        },
        {
          id: "note-doc",
          group: "今天",
          name: "桌面便笺.txt",
          date: "2026/04/02 10:08",
          type: "文本文档",
          size: "1 KB",
          icon: "icons/txt.png",
          description: "用于记录后续改进点的便笺。",
          open: { app: "notepad", doc: "note" },
        },
        {
          id: "ui-spec",
          group: "本周",
          name: "win7-mockup.html",
          date: "2026/04/02 09:48",
          type: "HTML 文档",
          size: "48 KB",
          icon: "icons/html.png",
          description: "Win7 页面结构草稿。",
          open: { app: "ie", page: "github" },
        },
        {
          id: "cover",
          group: "更早",
          name: "wallpaper-preview.jpg",
          date: "2026/04/01 23:22",
          type: "JPEG 图像",
          size: "1.2 MB",
          icon: "icons/jpg.png",
          description: "桌面背景的导出预览。",
          open: { app: "properties", name: "wallpaper-preview.jpg", kind: "JPEG 图像", icon: "icons/jpg.png", location: "文档", description: "桌面背景的导出预览。" },
        },
      ],
    },
    pictures: {
      title: "图片",
      subtitle: "示例照片和桌面截图。",
      breadcrumb: [
        { label: "库", location: "libraries" },
        { label: "图片", location: "pictures" },
      ],
      defaultView: "tiles",
      items: [
        {
          id: "bg",
          group: "图片库",
          name: "Desktop Wallpaper.jpg",
          date: "2026/04/02 09:30",
          type: "JPEG 图像",
          size: "1.4 MB",
          icon: "icons/jpg.png",
          description: "当前桌面背景的高分辨率版本。",
          open: { app: "personalization" },
        },
        {
          id: "photo",
          group: "图片库",
          name: "Windows Photo.jpg",
          date: "2026/04/01 20:48",
          type: "JPEG 图像",
          size: "786 KB",
          icon: "icons/jpg.png",
          description: "Aero 桌面截图示例。",
          open: { app: "properties", name: "Windows Photo.jpg", kind: "JPEG 图像", icon: "icons/jpg.png", location: "图片", description: "Aero 桌面截图示例。" },
        },
        {
          id: "camera-roll",
          group: "图片库",
          name: "Sample Camera Roll.jpg",
          date: "2026/04/01 18:14",
          type: "JPEG 图像",
          size: "932 KB",
          icon: "icons/jpg.png",
          description: "USB 摄像头采集的示例照片。",
          open: { app: "properties", name: "Sample Camera Roll.jpg", kind: "JPEG 图像", icon: "icons/jpg.png", location: "图片", description: "USB 摄像头采集的示例照片。" },
        },
      ],
    },
    music: {
      title: "音乐",
      subtitle: "示例音频和媒体资源。",
      breadcrumb: [
        { label: "库", location: "libraries" },
        { label: "音乐", location: "music" },
      ],
      defaultView: "tiles",
      items: [
        {
          id: "dreams",
          group: "音乐库",
          name: "Aero Dreams.mp3",
          date: "2026/04/02 09:12",
          type: "MP3 音频",
          size: "8.4 MB",
          icon: "icons/mp3.png",
          description: "用于演示播放器界面的主歌曲。",
          open: { app: "media", media: "aero-dreams" },
        },
        {
          id: "chime",
          group: "音乐库",
          name: "Startup Chime.mp3",
          date: "2026/04/01 22:04",
          type: "MP3 音频",
          size: "2.1 MB",
          icon: "icons/mp3.png",
          description: "Windows 启动音效采样。",
          open: { app: "media", media: "startup-chime" },
        },
        {
          id: "tour-audio",
          group: "音乐库",
          name: "Guided Tour.wav",
          date: "2026/04/01 21:44",
          type: "WAV 音频",
          size: "15 MB",
          icon: "icons/mp3.png",
          description: "用于演示辅助功能与导览说明。",
          open: { app: "media", media: "startup-chime" },
        },
      ],
    },
    videos: {
      title: "视频",
      subtitle: "示例视频、宣传片和录制素材。",
      breadcrumb: [
        { label: "库", location: "libraries" },
        { label: "视频", location: "videos" },
      ],
      defaultView: "tiles",
      items: [
        {
          id: "tour",
          group: "视频库",
          name: "Aero Tour.mp4",
          date: "2026/04/01 21:19",
          type: "MP4 视频",
          size: "58 MB",
          icon: "icons/mp4.png",
          description: "Windows 7 Aero 功能导览。",
          open: { app: "media", media: "demo-reel" },
        },
        {
          id: "walkthrough",
          group: "视频库",
          name: "Control Panel Walkthrough.mp4",
          date: "2026/03/31 17:06",
          type: "MP4 视频",
          size: "74 MB",
          icon: "icons/mp4.png",
          description: "控制面板各类别的使用录屏。",
          open: { app: "media", media: "demo-reel" },
        },
      ],
    },
    "recycle-bin": {
      title: "回收站",
      subtitle: "保存你最近删除的文件和快捷方式。",
      breadcrumb: [
        { label: "桌面", location: "desktop" },
        { label: "回收站", location: "recycle-bin" },
      ],
      defaultView: "tiles",
      items: [
        {
          id: "deleted-shortcut",
          group: "已删除项目",
          name: "旧版浏览器.lnk",
          date: "2026/04/01 18:22",
          type: "快捷方式",
          size: "1 KB",
          icon: "icons/shortcut.png",
          description: "旧的浏览器快捷方式，已移至回收站。",
          open: { app: "properties", name: "旧版浏览器.lnk", kind: "快捷方式", icon: "icons/shortcut.png", location: "回收站", description: "旧的浏览器快捷方式，已移至回收站。" },
        },
        {
          id: "deleted-note",
          group: "已删除项目",
          name: "temp-notes.txt",
          date: "2026/04/01 16:04",
          type: "文本文档",
          size: "2 KB",
          icon: "icons/txt.png",
          description: "临时笔记文件的历史版本。",
          open: { app: "notepad", doc: "note" },
        },
        {
          id: "deleted-shot",
          group: "已删除项目",
          name: "old-wallpaper.jpg",
          date: "2026/03/31 22:13",
          type: "JPEG 图像",
          size: "920 KB",
          icon: "icons/jpg.png",
          description: "上一版桌面壁纸。",
          open: { app: "properties", name: "old-wallpaper.jpg", kind: "JPEG 图像", icon: "icons/jpg.png", location: "回收站", description: "上一版桌面壁纸。" },
        },
      ],
    },
    network: {
      title: "网络",
      subtitle: "发现本地网络中的设备和共享位置。",
      breadcrumb: [
        { label: "计算机", location: "computer" },
        { label: "网络", location: "network" },
      ],
      defaultView: "details",
      items: [
        {
          id: "desktop-host",
          group: "计算机",
          name: "DESKTOP-BC",
          date: "2026/04/02 10:26",
          type: "计算机",
          size: "在线",
          icon: "icons/my-computer.png",
          description: "当前工作站，已启用文件共享。",
          open: { app: "properties", name: "DESKTOP-BC", kind: "网络计算机", icon: "icons/my-computer.png", location: "网络", description: "当前工作站，已启用文件共享。" },
        },
        {
          id: "nas",
          group: "计算机",
          name: "MEDIA-NAS",
          date: "2026/04/02 10:10",
          type: "存储设备",
          size: "已连接",
          icon: "icons/drive.png",
          description: "家庭媒体服务器。",
          open: { app: "properties", name: "MEDIA-NAS", kind: "网络存储", icon: "icons/drive.png", location: "网络", description: "家庭媒体服务器。" },
        },
        {
          id: "printer",
          group: "媒体设备",
          name: "Office Printer",
          date: "2026/04/02 09:54",
          type: "打印机",
          size: "共享",
          icon: "icons/display.png",
          description: "网络中的共享打印设备。",
          open: { app: "display" },
        },
      ],
    },
  };

  function initialize() {
    stampDesktopIcons();
    promoteTaskbarTitles();
    applyTheme("default");
    updateClock();
    setInterval(updateClock, 1000 * 20);
    renderCalendar();
    renderActionCenter();
    updateResolutionLabel();
    updateIconSize("medium");
    buildMediaVisualizer();
    buildGadgetMeter();
    renderMediaLibrary();
    setCurrentMedia(currentMediaId);
    renderTaskManager();
    renderExplorer(currentExplorerLocation, "", false);
    renderIePage(currentIePage);
    loadNotepadDoc("readme");
    ensureTerminalBanner();
    bindStaticEvents();
    startMediaTicker();
    startGadgetTicker();
    setTimeout(() => {
      showToast("Windows 7", "桌面已准备就绪。可以打开开始菜单或双击桌面图标继续操作。");
      showTrayBalloon("warning", "操作中心", "有 2 条重要消息需要你查看。单击旗标图标可打开操作中心。`".replace("`", ""));
    }, 600);
  }

  function bindStaticEvents() {
    startBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleStartMenu();
    });

    $("start-all-programs").addEventListener("click", () => {
      startMenu.classList.toggle("show-all-programs");
      syncAllProgramsLabel();
      updateStartProgramVisibility();
    });

    $("start-search").addEventListener("input", updateStartProgramVisibility);
    $("start-search").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const firstVisible = $$(".start-program", startMenu).find((item) => item.style.display !== "none");
        if (firstVisible) {
          event.preventDefault();
          openFromElement(firstVisible);
        }
      }
    });

    startMenu.addEventListener("click", (event) => {
      const button = event.target.closest(".start-program,.start-link");
      if (!button) {
        return;
      }
      event.stopPropagation();
      openFromElement(button);
    });

    $("shutdown-main").addEventListener("click", (event) => {
      event.stopPropagation();
      simulatePowerAction("shutdown");
    });

    $("shutdown-arrow").addEventListener("click", (event) => {
      event.stopPropagation();
      togglePopup(powerPopup, event.currentTarget, { alignRight: true });
    });

    $$(".power-item", powerPopup).forEach((item) => {
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        simulatePowerAction(item.dataset.power);
      });
    });

    desktop.addEventListener("click", (event) => {
      if (!event.target.closest(".desktop-icon")) {
        clearDesktopSelection();
      }
      hideContextMenus();
      hideTrayPopups();
    });

    desktop.addEventListener("contextmenu", (event) => {
      if (event.target.closest(".desktop-icon") || event.target.closest(".window")) {
        return;
      }
      event.preventDefault();
      closeStartMenu();
      hideTrayPopups();
      showContextMenu($("desktop-ctx"), event.clientX, event.clientY);
    });

    desktopIcons.addEventListener("click", (event) => {
      const icon = event.target.closest(".desktop-icon");
      if (!icon) {
        return;
      }
      event.stopPropagation();
      selectDesktopIcon(icon, false);
    });

    desktopIcons.addEventListener("dblclick", (event) => {
      const icon = event.target.closest(".desktop-icon");
      if (!icon) {
        return;
      }
      event.stopPropagation();
      selectDesktopIcon(icon, false);
      openFromElement(icon);
    });

    desktopIcons.addEventListener("contextmenu", (event) => {
      const icon = event.target.closest(".desktop-icon");
      if (!icon) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      iconContextTarget = icon;
      selectDesktopIcon(icon, false);
      closeStartMenu();
      hideTrayPopups();
      showContextMenu($("icon-ctx"), event.clientX, event.clientY);
    });

    $("ctx-refresh").addEventListener("click", () => {
      hideContextMenus();
      showToast("桌面", "已刷新桌面。所有图标均保持最新状态。");
      renderExplorer(currentExplorerLocation, currentExplorerQuery);
    });

    $("ctx-personalize").addEventListener("click", () => {
      hideContextMenus();
      openTarget("personalization");
    });

    $("ctx-display").addEventListener("click", () => {
      hideContextMenus();
      openTarget("display");
    });

    $("ctx-gadgets").addEventListener("click", () => {
      hideContextMenus();
      showTrayBalloon("info", "桌面小工具", "桌面小工具已经固定在右侧边栏。单击时钟或 CPU 仪表可以打开对应的系统面板。`".replace("`", ""));
    });

    $("ctx-new-folder").addEventListener("click", () => {
      hideContextMenus();
      addDesktopIcon({
        label: nextDesktopName("新建文件夹"),
        icon: "icons/folder.png",
        kind: "文件夹",
        open: "explorer",
        location: "desktop",
      });
      showToast("桌面", "已创建新的文件夹。双击可在资源管理器中查看桌面目录。");
    });

    $("ctx-new-text").addEventListener("click", () => {
      const label = nextDesktopName("新建文本文档.txt");
      const docId = `doc-${Date.now()}`;
      notepadDocs[docId] = {
        name: label,
        content: "",
      };
      hideContextMenus();
      addDesktopIcon({
        label,
        icon: "icons/txt.png",
        kind: "文本文档",
        open: "notepad",
        doc: docId,
      });
      showToast("桌面", "已创建新的文本文档。双击即可编辑内容。");
    });

    $$("[data-action='icon-size']", $("desktop-ctx")).forEach((item) => {
      item.addEventListener("click", () => {
        updateIconSize(item.dataset.size);
      });
    });

    $("icon-ctx-open").addEventListener("click", () => {
      if (iconContextTarget) {
        openFromElement(iconContextTarget);
      }
      hideContextMenus();
    });

    $("icon-ctx-delete").addEventListener("click", () => {
      if (iconContextTarget) {
        const removedName = iconContextTarget.dataset.name;
        iconContextTarget.remove();
        iconContextTarget = null;
        renderExplorer(currentExplorerLocation, currentExplorerQuery);
        showToast("桌面", `${removedName} 已从桌面移除。`);
      }
      hideContextMenus();
    });

    $("icon-ctx-properties").addEventListener("click", () => {
      if (iconContextTarget) {
        showPropertiesFromElement(iconContextTarget, "桌面");
      }
      hideContextMenus();
    });

    $("taskbar-show-desktop").addEventListener("click", () => {
      hideContextMenus();
      showDesktop();
    });

    $("taskbar-open-taskmgr").addEventListener("click", () => {
      hideContextMenus();
      openTarget("taskmgr");
    });

    $("taskbar").addEventListener("contextmenu", (event) => {
      event.preventDefault();
      closeStartMenu();
      hideTrayPopups();
      showContextMenu($("taskbar-ctx"), event.clientX, event.clientY);
    });

    $$(".taskbar-app").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        hideContextMenus();
        hideTrayPopups();
        const winId = button.dataset.winid;
        if (winId && $(winId).classList.contains("show")) {
          if (focusedWindowId === winId) {
            minimizeWindow(winId);
          } else {
            focusWindow(winId);
          }
          return;
        }
        if (winId && button.classList.contains("open-window")) {
          $(winId).classList.add("show");
          focusWindow(winId);
          syncTaskbarButton(winId);
          return;
        }
        openFromElement(button);
      });
    });

    $("hidden-icons-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      togglePopup($("hidden-icons-popup"), event.currentTarget);
    });

    $("battery-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      togglePopup($("battery-popup"), event.currentTarget, { alignRight: true });
    });

    $("network-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      togglePopup($("network-popup"), event.currentTarget, { alignRight: true });
    });

    $("volume-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      togglePopup($("volume-popup"), event.currentTarget, { alignRight: true });
    });

    $("action-center-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      renderActionCenter();
      togglePopup($("action-center-popup"), event.currentTarget, { alignRight: true });
    });

    $("clock-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      renderCalendar();
      togglePopup($("calendar-popup"), event.currentTarget, { alignRight: true });
    });

    $("show-desktop-strip").addEventListener("click", (event) => {
      event.stopPropagation();
      showDesktop();
    });

    $("volume-range").addEventListener("input", (event) => {
      $("volume-value").textContent = event.target.value;
    });

    $("volume-range").addEventListener("change", (event) => {
      pushTrayNotification("info", "音量已调整", `当前扬声器音量为 ${event.target.value}%。`, { balloon: true });
    });

    $$(".network-entry button", $("network-popup")).forEach((button) => {
      button.addEventListener("click", () => {
        showToast("网络", `${button.textContent} 操作仅作演示。`);
        pushTrayNotification("info", "网络状态", `${button.textContent} 操作已发送到网络中心。`, { balloon: true });
      });
    });

    $$(".popup-link-button", document).forEach((button) => {
      button.addEventListener("click", () => {
        if (button.id === "action-center-open") {
          openTarget("controlpanel");
          hideTrayPopups();
          return;
        }
        showToast("系统", `${button.textContent} 暂未实现完整向导，当前提供演示入口。`);
      });
    });

    $$(".gadget", $("desktop")).forEach((gadget) => {
      gadget.addEventListener("click", () => {
        if (gadget.dataset.gadget === "taskmgr") {
          openTarget("taskmgr");
          return;
        }
        renderCalendar();
        togglePopup($("calendar-popup"), $("clock-btn"), { alignRight: true });
      });
    });

    $$(".window").forEach((windowElement) => {
      windowElement.addEventListener("mousedown", () => focusWindow(windowElement.id));
    });

    $$(".window-titlebar").forEach((bar) => {
      bar.addEventListener("mousedown", beginWindowDrag);
      bar.addEventListener("dblclick", (event) => {
        if (event.target.closest(".win-control")) {
          return;
        }
        const windowElement = bar.closest(".window");
        if (!windowElement || !windowElement.querySelector(".maximize-btn")) {
          return;
        }
        toggleMaximize(windowElement.id);
      });
    });

    $$(".resize-handle").forEach((handle) => {
      handle.addEventListener("mousedown", beginWindowResize);
    });

    $$(".minimize-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        minimizeWindow(button.dataset.window);
      });
    });

    $$(".maximize-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleMaximize(button.dataset.window);
      });
    });

    $$(".close-btn, .close-dialog").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        closeWindow(button.dataset.window);
      });
    });

    $("explorer-search").addEventListener("input", (event) => {
      currentExplorerQuery = event.target.value.trim().toLowerCase();
      renderExplorer(currentExplorerLocation, currentExplorerQuery, true);
    });

    $$(".view-mode-btn", $("explorer-win")).forEach((button) => {
      button.addEventListener("click", () => {
        explorerViewMode = button.dataset.view;
        renderExplorer(currentExplorerLocation, currentExplorerQuery, true);
      });
    });

    $("explorer-preview-toggle").addEventListener("click", () => {
      explorerPreviewVisible = !explorerPreviewVisible;
      $("explorer-preview-pane").classList.toggle("show", explorerPreviewVisible);
      $("explorer-preview-toggle").classList.toggle("muted", !explorerPreviewVisible);
      renderExplorer(currentExplorerLocation, currentExplorerQuery, true);
    });

    $("explorer-new-folder-btn").addEventListener("click", () => {
      if (currentExplorerLocation === "desktop") {
        $("ctx-new-folder").click();
        return;
      }
      createExplorerFolder(currentExplorerLocation);
    });

    $("explorer-breadcrumbs").addEventListener("click", (event) => {
      const crumb = event.target.closest("[data-location]");
      if (!crumb) {
        return;
      }
      renderExplorer(crumb.dataset.location, "");
    });

    $$(".sidebar-link", $("explorer-win")).forEach((button) => {
      button.addEventListener("click", () => renderExplorer(button.dataset.location, ""));
    });

    $("explorer-list").addEventListener("click", (event) => {
      const row = event.target.closest(".explorer-item");
      if (!row) {
        return;
      }
      selectExplorerItem(row.dataset.itemId);
    });

    $("explorer-list").addEventListener("dblclick", (event) => {
      const row = event.target.closest(".explorer-item");
      if (!row) {
        return;
      }
      const payload = JSON.parse(decodeURIComponent(row.dataset.payload));
      openTarget(payload.app, payload);
    });

    $("ie-home-btn").addEventListener("click", () => renderIePage("home"));
    $("ie-refresh-btn").addEventListener("click", () => renderIePage(currentIePage));
    $("ie-go-btn").addEventListener("click", () => navigateIeAddress());
    $$(".ie-command[data-page], .ie-favorite-link[data-page]", $("ie-win")).forEach((button) => {
      button.addEventListener("click", () => renderIePage(button.dataset.page));
    });
    $("ie-address-bar").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        navigateIeAddress();
      }
    });
    $("ie-content").addEventListener("click", (event) => {
      const pageLink = event.target.closest("[data-ie-page]");
      if (pageLink) {
        renderIePage(pageLink.dataset.iePage);
        return;
      }
      const target = event.target.closest("[data-open]");
      if (!target) {
        return;
      }
      openFromElement(target);
    });

    const notepadText = $("notepad-text");
    ["input", "click", "keyup"].forEach((type) => {
      notepadText.addEventListener(type, () => {
        updateNotepadStatus();
        if (notepadDocs[currentNotepadDoc]) {
          notepadDocs[currentNotepadDoc].content = notepadText.value;
        }
      });
    });

    $$(".stub-action").forEach((item) => {
      item.addEventListener("click", () => {
        showToast("提示", `${item.textContent} 菜单暂未展开，当前界面以复刻视觉和核心交互为主。`);
      });
    });

    $("terminal-input").addEventListener("keydown", onTerminalKeyDown);

    $("media-playlist").addEventListener("click", (event) => {
      const item = event.target.closest(".media-item");
      if (!item) {
        return;
      }
      setCurrentMedia(item.dataset.mediaId);
    });

    $("media-play-toggle").addEventListener("click", () => {
      mediaPlaying = !mediaPlaying;
      $("media-play-toggle").textContent = mediaPlaying ? "暂停" : "播放";
    });

    $("media-prev").addEventListener("click", () => moveMediaCursor(-1));
    $("media-next").addEventListener("click", () => moveMediaCursor(1));

    $("controlpanel-win").addEventListener("click", (event) => {
      const target = event.target.closest("[data-open]");
      if (!target) {
        return;
      }
      openFromElement(target);
    });

    $$(".theme-card", $("personalization-win")).forEach((card) => {
      card.addEventListener("click", () => {
        applyTheme(card.dataset.theme);
        showToast("个性化", `已应用主题: ${card.textContent.trim()}。`);
        pushTrayNotification("info", "个性化", `主题已切换为 ${card.textContent.trim()}。`, { balloon: true });
      });
    });

    $("resolution-range").addEventListener("input", updateResolutionLabel);
    $("display-apply").addEventListener("click", () => {
      showToast("显示设置", `已应用分辨率 ${$("resolution-label").textContent}。`);
      pushTrayNotification("warning", "显示设置", `分辨率已调整为 ${$("resolution-label").textContent}。`, { balloon: true });
    });

    $("taskmgr-list").addEventListener("click", (event) => {
      const row = event.target.closest(".taskmgr-row");
      if (!row) {
        return;
      }
      taskmgrSelectionId = row.dataset.id;
      renderTaskManager();
    });

    $("taskmgr-end-btn").addEventListener("click", () => {
      if (!taskmgrSelectionId) {
        showToast("任务管理器", "请先选择一个任务。`".replace("`", ""));
        return;
      }
      const index = taskmgrProcesses.findIndex((process) => process.id === taskmgrSelectionId);
      if (index !== -1) {
        const [process] = taskmgrProcesses.splice(index, 1);
        showToast("任务管理器", `${process.name} 已结束。`);
        taskmgrSelectionId = null;
        renderTaskManager();
      }
    });

    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("mouseup", endPointerAction);

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".ctx-menu")) {
        hideContextMenus();
      }
      if (!event.target.closest(".tray-popup") && !event.target.closest("#tray-area")) {
        hideTrayPopups();
      }
      if (!event.target.closest("#start-menu") && !event.target.closest("#start-btn") && !event.target.closest("#power-popup")) {
        closeStartMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideContextMenus();
        hideTrayPopups();
        closeStartMenu();
      }
      if (event.key === "Meta" || (event.ctrlKey && event.key === "Escape")) {
        event.preventDefault();
        toggleStartMenu();
      }
      if (event.altKey && event.key === "F4" && focusedWindowId) {
        event.preventDefault();
        closeWindow(focusedWindowId);
      }
    });

    window.addEventListener("resize", () => {
      hideContextMenus();
      hideTrayPopups();
      hideTooltip();
    });
  }

  function stampDesktopIcons() {
    $$(".desktop-icon", desktopIcons).forEach((icon) => {
      if (!icon.dataset.created) {
        desktopDateSeed += 1;
        icon.dataset.created = formatDate(new Date(Date.now() - desktopDateSeed * 600000));
      }
    });
  }

  function promoteTaskbarTitles() {
    $$("#taskbar [title]").forEach((element) => {
      element.dataset.title = element.getAttribute("title") || "";
      element.removeAttribute("title");
      element.addEventListener("mouseenter", () => scheduleTooltip(element));
      element.addEventListener("mouseleave", hideTooltip);
    });
  }

  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    $("clock-time").textContent = `${hh}:${mm}`;
    $("clock-date").textContent = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  }

  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
  }

  function toggleStartMenu() {
    const willOpen = !startMenu.classList.contains("show");
    hideContextMenus();
    hideTrayPopups();
    hideTooltip();
    if (!willOpen) {
      closeStartMenu();
      return;
    }
    startMenu.classList.add("show");
    startBtn.classList.add("active");
    startMenu.classList.remove("show-all-programs");
    syncAllProgramsLabel();
    $("start-search").value = "";
    updateStartProgramVisibility();
    setTimeout(() => $("start-search").focus(), 60);
  }

  function closeStartMenu() {
    startMenu.classList.remove("show", "show-all-programs");
    startBtn.classList.remove("active");
    $("start-search").value = "";
    syncAllProgramsLabel();
    updateStartProgramVisibility();
    powerPopup.classList.remove("show");
  }

  function syncAllProgramsLabel() {
    const toggle = $("start-all-programs");
    const showAll = startMenu.classList.contains("show-all-programs");
    toggle.children[0].textContent = showAll ? "返回" : "所有程序";
    toggle.children[1].textContent = showAll ? "◀" : "▶";
  }

  function updateStartProgramVisibility() {
    const query = $("start-search").value.trim().toLowerCase();
    const showAll = startMenu.classList.contains("show-all-programs");
    let visibleCount = 0;

    $$(".start-program", startMenu).forEach((item) => {
      const matches = !query || item.textContent.toLowerCase().includes(query);
      const allowed = showAll || !item.classList.contains("all-programs-only") || Boolean(query);
      const visible = matches && allowed;
      item.style.display = visible ? "flex" : "none";
      item.classList.toggle("search-hit", Boolean(query) && visible);
      if (visible) {
        visibleCount += 1;
      }
    });

    $("start-search-empty").style.display = visibleCount ? "none" : "block";
  }

  function hideContextMenus() {
    $$(".ctx-menu").forEach((menu) => menu.classList.remove("show"));
  }

  function hideTrayPopups() {
    $$(".tray-popup").forEach((popup) => popup.classList.remove("show"));
  }

  function showContextMenu(menu, clientX, clientY) {
    hideContextMenus();
    menu.classList.add("show");
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    menu.classList.remove("show");
    const maxX = Math.max(8, window.innerWidth - menuWidth - 8);
    const maxY = Math.max(8, window.innerHeight - menuHeight - 8);
    menu.style.left = `${Math.min(clientX, maxX)}px`;
    menu.style.top = `${Math.min(clientY, maxY)}px`;
    menu.classList.add("show");
  }

  function togglePopup(popup, anchor, options = {}) {
    const shouldShow = !popup.classList.contains("show");
    hideTrayPopups();
    hideContextMenus();
    if (!shouldShow) {
      return;
    }
    positionPopup(popup, anchor, options);
    popup.classList.add("show");
  }

  function positionPopup(popup, anchor, options = {}) {
    const rect = anchor.getBoundingClientRect();
    const alignRight = options.alignRight !== false;
    popup.style.top = "";
    popup.style.bottom = `${window.innerHeight - rect.top + 6}px`;
    if (alignRight) {
      popup.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
      popup.style.left = "auto";
    } else {
      popup.style.left = `${Math.max(8, rect.left)}px`;
      popup.style.right = "auto";
    }
  }

  function selectDesktopIcon(icon, additive) {
    if (!additive) {
      clearDesktopSelection();
    }
    icon.classList.add("selected");
  }

  function clearDesktopSelection() {
    $$(".desktop-icon.selected", desktopIcons).forEach((icon) => icon.classList.remove("selected"));
  }

  function updateIconSize(size) {
    desktopIcons.classList.remove("icon-large", "icon-medium", "icon-small");
    desktopIcons.classList.add(`icon-${size}`);
    $$("[data-action='icon-size']", $("desktop-ctx")).forEach((item) => {
      item.classList.toggle("checked", item.dataset.size === size);
    });
    hideContextMenus();
  }

  function addDesktopIcon(config) {
    const icon = document.createElement("button");
    icon.className = "desktop-icon";
    icon.dataset.name = config.label;
    icon.dataset.kind = config.kind;
    icon.dataset.icon = config.icon;
    icon.dataset.created = formatDate(new Date());
    if (config.open) {
      icon.dataset.open = config.open;
    }
    if (config.location) {
      icon.dataset.location = config.location;
    }
    if (config.doc) {
      icon.dataset.doc = config.doc;
    }
    if (config.page) {
      icon.dataset.page = config.page;
    }
    if (config.media) {
      icon.dataset.media = config.media;
    }
    icon.innerHTML =
      `<span class="desktop-icon-image"><img src="${config.icon}" alt="${config.label}"></span>` +
      `<span class="desktop-icon-label">${config.label}</span>`;
    desktopIcons.appendChild(icon);
    selectDesktopIcon(icon, false);
    renderExplorer(currentExplorerLocation, currentExplorerQuery);
  }

  function nextDesktopName(baseName) {
    const existingNames = new Set($$(".desktop-icon", desktopIcons).map((icon) => icon.dataset.name));
    if (!existingNames.has(baseName)) {
      return baseName;
    }
    let index = 2;
    let candidate = `${baseName} (${index})`;
    while (existingNames.has(candidate)) {
      index += 1;
      candidate = `${baseName} (${index})`;
    }
    return candidate;
  }

  function nextExplorerFolderName(location, baseName) {
    const existingNames = new Set(getExplorerLocationData(location).items.map((item) => item.name));
    if (!existingNames.has(baseName)) {
      return baseName;
    }
    let index = 2;
    let candidate = `${baseName} (${index})`;
    while (existingNames.has(candidate)) {
      index += 1;
      candidate = `${baseName} (${index})`;
    }
    return candidate;
  }

  function createExplorerFolder(location) {
    const data = baseExplorerLocations[location];
    if (!data || !Array.isArray(data.items)) {
      return;
    }
    if (["computer", "network", "recycle-bin"].includes(location)) {
      showToast("资源管理器", `无法在 ${data.title} 中创建新文件夹。`);
      return;
    }
    const name = nextExplorerFolderName(location, "新建文件夹");
    const groupFallbacks = {
      system: "文件夹",
      libraries: "库",
      documents: "今天",
      pictures: "图片库",
      music: "音乐库",
      videos: "视频库",
      desktop: "文件夹",
    };
    const item = {
      id: `${location}-folder-${Date.now()}`,
      group: groupFallbacks[location] || "项目",
      name,
      date: formatDate(new Date()),
      type: "文件夹",
      size: "",
      icon: "icons/folder.png",
      description: `在 ${baseExplorerLocations[location].title} 中新建的文件夹。`,
      open: {
        app: "properties",
        name,
        kind: "文件夹",
        icon: "icons/folder.png",
        location: baseExplorerLocations[location].title,
        description: `在 ${baseExplorerLocations[location].title} 中新建的文件夹。`,
      },
    };
    baseExplorerLocations[location].items.unshift(item);
    explorerSelectionId = item.id;
    renderExplorer(location, currentExplorerQuery, true);
    showToast("资源管理器", `已在 ${baseExplorerLocations[location].title} 中创建 ${name}。`);
    pushTrayNotification("info", "资源管理器", `已在 ${baseExplorerLocations[location].title} 中创建 ${name}。`, { balloon: false });
  }

  function openFromElement(element) {
    const data = element.dataset;
    openTarget(data.open || data.app, {
      location: data.location,
      page: data.page,
      doc: data.doc,
      media: data.media,
      name: data.name,
      kind: data.kind,
      icon: data.icon,
      created: data.created,
      description: data.description,
      view: data.view,
    });
  }

  function openTarget(target, options = {}) {
    hideContextMenus();
    hideTrayPopups();
    closeStartMenu();

    switch (target) {
      case "explorer":
        renderExplorer(options.location || "computer", "");
        openWindow("explorer-win");
        break;
      case "ie":
        renderIePage(options.page || "home");
        openWindow("ie-win");
        break;
      case "notepad":
        loadNotepadDoc(options.doc || "untitled");
        openWindow("notepad-win");
        break;
      case "terminal":
        openWindow("terminal-win");
        ensureTerminalBanner();
        setTimeout(() => $("terminal-input").focus(), 50);
        break;
      case "media":
        setCurrentMedia(options.media || currentMediaId);
        openWindow("media-win");
        break;
      case "controlpanel":
        openWindow("controlpanel-win");
        break;
      case "taskmgr":
        openWindow("taskmgr-win");
        renderTaskManager();
        break;
      case "personalization":
        openWindow("personalization-win");
        break;
      case "display":
        openWindow("display-win");
        break;
      case "properties":
        updateProperties(options);
        openWindow("properties-win");
        break;
      default:
        if (options.name || options.kind) {
          updateProperties(options);
          openWindow("properties-win");
        }
        break;
    }
  }

  function openWindow(id) {
    const windowElement = $(id);
    if (!windowElement) {
      return;
    }
    windowElement.classList.add("show");
    focusWindow(id);
    syncTaskbarButton(id, true);
    if (id === "terminal-win") {
      setTimeout(() => $("terminal-input").focus(), 50);
    }
  }

  function restoreFocusedWindow() {
    const topWindow = $$(".window.show").sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0))[0];
    if (topWindow) {
      focusWindow(topWindow.id);
      return;
    }
    focusedWindowId = null;
    $$(".window").forEach((item) => item.classList.remove("focused"));
    Object.keys(wins).forEach((windowId) => syncTaskbarButton(windowId));
  }

  function closeWindow(id) {
    const windowElement = $(id);
    if (!windowElement) {
      return;
    }
    windowElement.classList.remove("show", "maximized", "focused");
    syncTaskbarButton(id, false, true);
    if (focusedWindowId === id) {
      restoreFocusedWindow();
    }
    syncMaximizeIcon(id);
  }

  function minimizeWindow(id) {
    const windowElement = $(id);
    if (!windowElement) {
      return;
    }
    windowElement.classList.remove("show", "focused");
    syncTaskbarButton(id, false, false);
    if (focusedWindowId === id) {
      restoreFocusedWindow();
    }
  }

  function focusWindow(id) {
    const windowElement = $(id);
    if (!windowElement) {
      return;
    }
    zCounter += 1;
    windowElement.style.zIndex = String(zCounter);
    $$(".window").forEach((item) => item.classList.toggle("focused", item.id === id));
    focusedWindowId = id;
    Object.keys(wins).forEach((windowId) => syncTaskbarButton(windowId));
  }

  function syncTaskbarButton(id, markOpen, forceHide) {
    const info = wins[id];
    if (!info || !info.tb) {
      return;
    }
    const button = $(info.tb);
    const windowElement = $(id);
    const isVisible = windowElement.classList.contains("show");

    if (markOpen === true) {
      button.classList.add("open-window");
      button.classList.remove("hidden");
    }
    if (forceHide) {
      button.classList.remove("open-window", "active-window");
      if (!info.pinned) {
        button.classList.add("hidden");
      }
      return;
    }

    if (isVisible) {
      button.classList.add("open-window");
      button.classList.remove("hidden");
    }
    button.classList.toggle("active-window", focusedWindowId === id && isVisible);
  }

  function toggleMaximize(id) {
    const windowElement = $(id);
    if (!windowElement) {
      return;
    }
    windowElement.classList.toggle("maximized");
    syncMaximizeIcon(id);
    focusWindow(id);
  }

  function syncMaximizeIcon(id) {
    const windowElement = $(id);
    const button = windowElement ? windowElement.querySelector(".maximize-btn img") : null;
    if (!windowElement || !button) {
      return;
    }
    button.src = windowElement.classList.contains("maximized") ? "icons/unmaximize.png" : "icons/maximize.png";
  }

  function showDesktop() {
    hideContextMenus();
    hideTrayPopups();
    closeStartMenu();
    $$(".window.show").forEach((windowElement) => minimizeWindow(windowElement.id));
  }

  function getSnapRegion(clientX, clientY) {
    const workArea = getDesktopWorkArea();
    if (clientY <= snapThreshold) {
      return "maximize";
    }
    if (clientX <= snapThreshold) {
      return "left";
    }
    if (clientX >= workArea.right - snapThreshold) {
      return "right";
    }
    return null;
  }

  function getSnapBounds(region) {
    const workArea = getDesktopWorkArea();
    const halfWidth = Math.round(workArea.right / 2);
    if (region === "maximize") {
      return {
        left: 0,
        top: 0,
        width: workArea.right,
        height: workArea.bottom,
      };
    }
    if (region === "left") {
      return {
        left: 0,
        top: 0,
        width: halfWidth,
        height: workArea.bottom,
      };
    }
    if (region === "right") {
      return {
        left: halfWidth,
        top: 0,
        width: workArea.right - halfWidth,
        height: workArea.bottom,
      };
    }
    return null;
  }

  function hideSnapPreview() {
    if (!snapPreview) {
      return;
    }
    snapPreview.classList.remove("show", "snap-maximize");
  }

  function showSnapPreview(region) {
    if (!snapPreview) {
      return;
    }
    const bounds = getSnapBounds(region);
    if (!bounds) {
      hideSnapPreview();
      return;
    }
    snapPreview.style.left = `${bounds.left}px`;
    snapPreview.style.top = `${bounds.top}px`;
    snapPreview.style.width = `${bounds.width}px`;
    snapPreview.style.height = `${bounds.height}px`;
    snapPreview.classList.toggle("snap-maximize", region === "maximize");
    snapPreview.classList.add("show");
  }

  function applySnap(windowElement, region) {
    if (!windowElement || !region) {
      return;
    }
    if (region === "maximize") {
      windowElement.classList.add("maximized");
      syncMaximizeIcon(windowElement.id);
      focusWindow(windowElement.id);
      return;
    }
    const bounds = getSnapBounds(region);
    if (!bounds) {
      return;
    }
    windowElement.classList.remove("maximized");
    windowElement.style.left = `${bounds.left}px`;
    windowElement.style.top = `${bounds.top}px`;
    windowElement.style.width = `${bounds.width}px`;
    windowElement.style.height = `${bounds.height}px`;
    syncMaximizeIcon(windowElement.id);
    focusWindow(windowElement.id);
  }

  function beginWindowDrag(event) {
    if (event.button !== 0 || event.target.closest(".win-control")) {
      return;
    }
    const windowElement = event.currentTarget.closest(".window");
    if (!windowElement) {
      return;
    }
    focusWindow(windowElement.id);
    const titlebarHeight = event.currentTarget.getBoundingClientRect().height || 31;
    let offsetX = event.clientX - windowElement.offsetLeft;
    let offsetY = event.clientY - windowElement.offsetTop;

    if (windowElement.classList.contains("maximized")) {
      const workArea = getDesktopWorkArea();
      const restoreWidth = Number.parseFloat(windowElement.style.width) || Math.min(980, Math.round(workArea.right * 0.78));
      const restoreHeight = Number.parseFloat(windowElement.style.height) || Math.min(640, Math.round(workArea.bottom * 0.78));
      const ratio = event.clientX / Math.max(1, windowElement.offsetWidth);
      const left = Math.min(Math.max(0, event.clientX - restoreWidth * ratio), Math.max(0, workArea.right - restoreWidth));
      const top = Math.min(Math.max(0, event.clientY - Math.min(titlebarHeight, 18)), Math.max(0, workArea.bottom - restoreHeight));

      windowElement.classList.remove("maximized");
      windowElement.style.width = `${restoreWidth}px`;
      windowElement.style.height = `${restoreHeight}px`;
      windowElement.style.left = `${left}px`;
      windowElement.style.top = `${top}px`;
      syncMaximizeIcon(windowElement.id);

      offsetX = event.clientX - left;
      offsetY = event.clientY - top;
    }

    dragState = {
      windowElement,
      offsetX,
      offsetY,
      snapRegion: null,
    };
    hideSnapPreview();
    event.preventDefault();
  }

  function beginWindowResize(event) {
    const windowElement = event.currentTarget.closest(".window");
    if (!windowElement || windowElement.classList.contains("maximized")) {
      return;
    }
    focusWindow(windowElement.id);
    resizeState = {
      windowElement,
      dir: event.currentTarget.dataset.dir,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: windowElement.offsetLeft,
      startTop: windowElement.offsetTop,
      startWidth: windowElement.offsetWidth,
      startHeight: windowElement.offsetHeight,
      minWidth: Number(windowElement.dataset.minWidth || 460),
      minHeight: Number(windowElement.dataset.minHeight || 280),
    };
    event.preventDefault();
    event.stopPropagation();
  }

  function getDesktopWorkArea() {
    const taskbarHeight = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--taskbar-height"), 10) || 40;
    return {
      right: window.innerWidth,
      bottom: window.innerHeight - taskbarHeight,
    };
  }

  function onPointerMove(event) {
    if (dragState) {
      const workArea = getDesktopWorkArea();
      const maxLeft = Math.max(0, workArea.right - dragState.windowElement.offsetWidth);
      const maxTop = Math.max(0, workArea.bottom - dragState.windowElement.offsetHeight);
      dragState.windowElement.style.left = `${Math.min(Math.max(0, event.clientX - dragState.offsetX), maxLeft)}px`;
      dragState.windowElement.style.top = `${Math.min(Math.max(0, event.clientY - dragState.offsetY), maxTop)}px`;
      dragState.snapRegion = getSnapRegion(event.clientX, event.clientY);
      showSnapPreview(dragState.snapRegion);
    }

    if (resizeState) {
      const workArea = getDesktopWorkArea();
      const dx = event.clientX - resizeState.startX;
      const dy = event.clientY - resizeState.startY;
      let width = resizeState.startWidth;
      let height = resizeState.startHeight;
      let left = resizeState.startLeft;
      let top = resizeState.startTop;

      if (resizeState.dir.includes("e")) {
        width = Math.max(resizeState.minWidth, resizeState.startWidth + dx);
      }
      if (resizeState.dir.includes("s")) {
        height = Math.max(resizeState.minHeight, resizeState.startHeight + dy);
      }
      if (resizeState.dir.includes("w")) {
        width = Math.max(resizeState.minWidth, resizeState.startWidth - dx);
        left = resizeState.startLeft + (resizeState.startWidth - width);
      }
      if (resizeState.dir.includes("n")) {
        height = Math.max(resizeState.minHeight, resizeState.startHeight - dy);
        top = resizeState.startTop + (resizeState.startHeight - height);
      }

      left = Math.min(Math.max(0, left), Math.max(0, workArea.right - width));
      top = Math.min(Math.max(0, top), Math.max(0, workArea.bottom - height));
      width = Math.min(width, workArea.right - left);
      height = Math.min(height, workArea.bottom - top);

      resizeState.windowElement.style.width = `${width}px`;
      resizeState.windowElement.style.height = `${height}px`;
      resizeState.windowElement.style.left = `${left}px`;
      resizeState.windowElement.style.top = `${top}px`;
    }

    if (selectionState) {
      updateSelectionBox(event.clientX, event.clientY);
    }
  }

  function endPointerAction() {
    const activeDrag = dragState;
    dragState = null;
    resizeState = null;
    hideSnapPreview();
    if (activeDrag?.snapRegion) {
      applySnap(activeDrag.windowElement, activeDrag.snapRegion);
    }
    if (selectionState) {
      selectionBox.style.display = "none";
      selectionState = null;
    }
  }

  desktop.addEventListener("mousedown", (event) => {
    if (
      event.button !== 0 ||
      event.target.closest(".desktop-icon") ||
      event.target.closest("#gadget-bar") ||
      event.target.closest(".window") ||
      event.target.closest("#taskbar") ||
      event.target.closest("#start-menu") ||
      event.target.closest(".ctx-menu") ||
      event.target.closest(".tray-popup") ||
      event.target.closest("#tray-balloon") ||
      event.target.closest("#toast")
    ) {
      return;
    }
    hideContextMenus();
    hideTrayPopups();
    closeStartMenu();
    clearDesktopSelection();
    selectionState = {
      startX: event.clientX,
      startY: event.clientY,
    };
    selectionBox.style.display = "block";
    updateSelectionBox(event.clientX, event.clientY);
  });

  function updateSelectionBox(currentX, currentY) {
    if (!selectionState) {
      return;
    }
    const left = Math.min(selectionState.startX, currentX);
    const top = Math.min(selectionState.startY, currentY);
    const width = Math.abs(currentX - selectionState.startX);
    const height = Math.abs(currentY - selectionState.startY);
    selectionBox.style.left = `${left}px`;
    selectionBox.style.top = `${top}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
    const boxRect = { left, top, right: left + width, bottom: top + height };
    $$(".desktop-icon", desktopIcons).forEach((icon) => {
      const rect = icon.getBoundingClientRect();
      const intersects = !(rect.right < boxRect.left || rect.left > boxRect.right || rect.bottom < boxRect.top || rect.top > boxRect.bottom);
      icon.classList.toggle("selected", intersects);
    });
  }

  function getDesktopExplorerItems() {
    return $$(".desktop-icon", desktopIcons).map((icon) => ({
      id: icon.dataset.name,
      group: icon.dataset.kind?.includes("系统") ? "系统位置" : icon.dataset.kind?.includes("文本文档") ? "文件" : "快捷方式和程序",
      name: icon.dataset.name,
      date: icon.dataset.created || formatDate(new Date()),
      type: icon.dataset.kind || "项目",
      size: "",
      icon: icon.dataset.icon || "icons/unknown.png",
      description: `${icon.dataset.name} 位于桌面，可双击打开。`,
      open: {
        app: icon.dataset.open,
        location: icon.dataset.location,
        page: icon.dataset.page,
        doc: icon.dataset.doc,
        media: icon.dataset.media,
        name: icon.dataset.name,
        kind: icon.dataset.kind,
        icon: icon.dataset.icon,
      },
    }));
  }

  function getExplorerLocationData(location) {
    if (location === "desktop") {
      return {
        title: "桌面",
        subtitle: "存放在桌面上的快捷方式、文件和系统位置。",
        breadcrumb: [
          { label: "计算机", location: "computer" },
          { label: "桌面", location: "desktop" },
        ],
        defaultView: "details",
        items: getDesktopExplorerItems(),
      };
    }
    return baseExplorerLocations[location] || baseExplorerLocations.computer;
  }

  function groupExplorerItems(items) {
    const groups = new Map();
    items.forEach((item) => {
      const key = item.group || "项目";
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(item);
    });
    return Array.from(groups.entries());
  }

  function renderExplorerPreview(data, item) {
    const card = $("explorer-preview-card");
    if (!item) {
      const groups = groupExplorerItems(lastExplorerItems).map(([group, groupedItems]) => `<li>${group}: ${groupedItems.length} 个项目</li>`).join("");
      card.innerHTML =
        `<img src="icons/folder.png" alt="${data.title}">` +
        `<h3>${data.title}</h3>` +
        `<p>${data.subtitle}</p>` +
        `<ul>${groups || "<li>当前文件夹为空。</li>"}</ul>`;
      return;
    }
    card.innerHTML =
      `<img src="${item.icon}" alt="${item.name}">` +
      `<h3>${item.name}</h3>` +
      `<p>${item.type}</p>` +
      `<p>${item.description || "该项目可从资源管理器中打开。"}</p>` +
      `<ul>` +
      `<li>修改日期: ${item.date}</li>` +
      `<li>类型: ${item.type}</li>` +
      `<li>大小: ${item.size || "-"}</li>` +
      `</ul>`;
  }

  function renderExplorer(location, query = "", preserveView = false) {
    currentExplorerLocation = location;
    currentExplorerQuery = query;
    const data = getExplorerLocationData(location);
    if (!preserveView) {
      explorerViewMode = data.defaultView || "details";
    }
    const items = data.items.filter((item) => !query || item.name.toLowerCase().includes(query));
    lastExplorerItems = items;
    lastExplorerData = data;

    const hasSelectedItem = items.some((item) => item.id === explorerSelectionId);
    if (!hasSelectedItem) {
      explorerSelectionId = null;
    }

    $("explorer-window-title").textContent = data.title;
    $("explorer-location-title").textContent = data.title;
    $("explorer-location-subtitle").textContent = data.subtitle;
    $("explorer-summary").textContent = `${items.length} 个项目`;
    $("explorer-search").placeholder = `搜索 ${data.title}`;
    $("explorer-search").value = query;
    $("explorer-breadcrumbs").innerHTML = data.breadcrumb
      .map((crumb, index) => {
        const separator = index === 0 ? "" : '<span class="crumb-sep">›</span>';
        return `${separator}<button class="crumb" data-location="${crumb.location}">${crumb.label}</button>`;
      })
      .join("");

    $$(".sidebar-link", $("explorer-win")).forEach((button) => {
      button.classList.toggle("active", button.dataset.location === location);
    });

    const explorerSurface = $("explorer-win").querySelector(".explorer-surface");
    $("explorer-preview-pane").classList.toggle("show", explorerPreviewVisible);
    if (explorerSurface) {
      explorerSurface.style.gridTemplateColumns = explorerPreviewVisible ? "minmax(0, 1fr) 230px" : "minmax(0, 1fr)";
    }
    $("explorer-preview-toggle").classList.toggle("muted", !explorerPreviewVisible);
    $$(".view-mode-btn", $("explorer-win")).forEach((button) => {
      button.classList.toggle("active", button.dataset.view === explorerViewMode);
    });
    $("explorer-table-header").style.display = explorerViewMode === "details" ? "grid" : "none";
    $("explorer-list").className = `explorer-table${explorerViewMode === "tiles" ? " tiles-view" : ""}`;

    if (!items.length) {
      $("explorer-list").innerHTML =
        '<div class="explorer-group"><div class="explorer-group-title">搜索结果</div><div class="explorer-group-body"><div class="explorer-item"><span class="file-name"><img src="icons/unknown.png" alt="空"><span>没有与当前搜索匹配的项目。</span></span><span></span><span></span><span></span></div></div></div>';
    } else {
      const groups = groupExplorerItems(items);
      $("explorer-list").innerHTML = groups
        .map(([groupName, groupItems]) => {
          if (explorerViewMode === "tiles") {
            return (
              `<section class="explorer-group">` +
              `<div class="explorer-group-title">${groupName}</div>` +
              `<div class="explorer-tiles-group">` +
              groupItems
                .map((item) => {
                  const payload = encodeURIComponent(JSON.stringify(item.open));
                  return (
                    `<button class="explorer-tile${item.id === explorerSelectionId ? " selected" : ""}" data-item-id="${item.id}" data-payload="${payload}">` +
                    `<span class="explorer-tile-thumb"><img src="${item.icon}" alt="${item.name}"></span>` +
                    `<span class="explorer-tile-label">${item.name}</span>` +
                    `<span class="explorer-tile-meta"><span>${item.type}</span><span>${item.size || item.date}</span></span>` +
                    `</button>`
                  );
                })
                .join("") +
              `</div>` +
              `</section>`
            );
          }
          return (
            `<section class="explorer-group">` +
            `<div class="explorer-group-title">${groupName}</div>` +
            `<div class="explorer-group-body">` +
            groupItems
              .map((item) => {
                const payload = encodeURIComponent(JSON.stringify(item.open));
                return (
                  `<button class="explorer-item${item.id === explorerSelectionId ? " selected" : ""}" data-item-id="${item.id}" data-payload="${payload}">` +
                  `<span class="file-name"><img src="${item.icon}" alt="${item.name}"><span>${item.name}</span></span>` +
                  `<span>${item.date}</span>` +
                  `<span>${item.type}</span>` +
                  `<span>${item.size}</span>` +
                  `</button>`
                );
              })
              .join("") +
            `</div>` +
            `</section>`
          );
        })
        .join("");
    }

    $("explorer-status-left").textContent = items.length ? `已选择 ${hasSelectedItem ? 1 : 0} 个项目` : "此文件夹为空";
    $("explorer-status-right").textContent = explorerViewMode === "tiles" ? "大图标" : "详细信息";
    renderExplorerPreview(data, items.find((item) => item.id === explorerSelectionId));
  }

  function selectExplorerItem(itemId) {
    explorerSelectionId = itemId;
    $$(".explorer-item, .explorer-tile", $("explorer-list")).forEach((row) => {
      row.classList.toggle("selected", row.dataset.itemId === itemId);
    });
    $("explorer-status-left").textContent = `已选择 1 个项目`;
    renderExplorerPreview(lastExplorerData, lastExplorerItems.find((item) => item.id === itemId));
  }

  function renderIePage(pageId) {
    currentIePage = pageId;
    const pages = buildIePages();
    const page = pages[pageId] || pages.home;
    $("ie-window-title").textContent = `${page.title} - Windows Internet Explorer`;
    $("ie-address-bar").value = page.address;
    $("ie-tab-label").textContent = page.title;
    $("ie-status-text").textContent = page.status;
    $("ie-content").innerHTML = page.html;
    $$(".ie-command[data-page], .ie-favorite-link[data-page]", $("ie-win")).forEach((button) => {
      button.classList.toggle("active", button.dataset.page === pageId);
    });
  }

  function buildIePages() {
    return {
      home: {
        title: "Windows 7 起始页",
        address: "http://go.microsoft.com/fwlink/?LinkId=69157",
        status: "完成",
        html:
          '<div class="ie-page hero-home">' +
          '<section class="ie-hero"><h2>欢迎使用 Windows 7</h2><p>Internet Explorer 现在提供了收藏夹栏、命令栏、状态栏和更接近原版的启动页布局。你可以继续浏览系统演示、控制面板入口和常用位置。</p><div class="ie-chip-row"><span class="ie-chip">Aero Glass</span><span class="ie-chip">收藏夹栏</span><span class="ie-chip">命令栏</span><span class="ie-chip">系统导航</span></div></section>' +
          '<section class="portal-grid">' +
          '<button class="portal-card" data-open="explorer" data-location="libraries"><h3>浏览库</h3><p>快速查看文档、图片、音乐和视频库。</p></button>' +
          '<button class="portal-card" data-open="controlpanel"><h3>控制面板</h3><p>打开类别视图并调整计算机设置。</p></button>' +
          '<button class="portal-card" data-ie-page="favorites"><h3>收藏夹中心</h3><p>查看已固定的站点和常用系统页面。</p></button>' +
          '<button class="portal-card" data-ie-page="downloads"><h3>下载管理</h3><p>查看最近保存到系统中的安装包和更新。</p></button>' +
          '</section>' +
          '<section class="portal-grid">' +
          '<button class="portal-card" data-open="media" data-media="demo-reel"><h3>播放演示视频</h3><p>通过 Windows Media Player 打开 Aero Tour 演示片段。</p></button>' +
          '<button class="portal-card" data-open="taskmgr"><h3>查看系统状态</h3><p>用任务管理器检查当前进程和资源占用。</p></button>' +
          '<button class="portal-card" data-ie-page="github"><h3>仓库信息</h3><p>查看当前 fake-windows 项目的 Win7 页面进展。</p></button>' +
          '<button class="portal-card" data-ie-page="help"><h3>帮助和支持</h3><p>打开系统帮助页，查看主要操作说明。</p></button>' +
          '</section>' +
          '</div>',
      },
      github: {
        title: "GitHub",
        address: "https://github.com/",
        status: "正在浏览 https://github.com/",
        html:
          '<div class="ie-page">' +
          '<section class="ie-hero"><h2>GitHub 项目预览</h2><p>当前仓库以 Win10 为已有实现基础，Win7 页面已经补齐组件化骨架、Aero 视觉、桌面小工具、托盘气泡、资源管理器双视图以及更贴近原版的 IE 和控制面板结构。</p><div class="repo-stats"><div class="repo-stat"><strong>10+</strong><span>系统窗口</span></div><div class="repo-stat"><strong>6</strong><span>托盘与系统弹层</span></div><div class="repo-stat"><strong>3</strong><span>桌面小工具</span></div></div></section>' +
          '<section class="favorite-grid">' +
          '<button class="favorite-card" data-open="explorer" data-location="desktop"><h3>桌面联动</h3><p>资源管理器可以直接浏览桌面、库和回收站。</p></button>' +
          '<button class="favorite-card" data-open="controlpanel"><h3>经典控制面板</h3><p>支持类别入口、侧栏任务和更像原版的导航结构。</p></button>' +
          '<button class="favorite-card" data-ie-page="downloads"><h3>后续扩展建议</h3><p>可以继续增加任务栏缩略图、回收站操作和更多系统向导。</p></button>' +
          '</section>' +
          '</div>',
      },
      favorites: {
        title: "收藏夹中心",
        address: "about:favorites",
        status: "完成",
        html:
          '<div class="ie-page">' +
          '<section class="favorite-grid">' +
          '<button class="favorite-card" data-ie-page="home"><h3>Windows 起始页</h3><p>返回系统起始页并查看推荐入口。</p></button>' +
          '<button class="favorite-card" data-open="explorer" data-location="libraries"><h3>库</h3><p>浏览文档、图片、音乐和视频。</p></button>' +
          '<button class="favorite-card" data-open="controlpanel"><h3>控制面板</h3><p>打开分类视图和常用任务。</p></button>' +
          '<button class="favorite-card" data-ie-page="github"><h3>GitHub</h3><p>查看 fake-windows 的 Win7 页面说明。</p></button>' +
          '</section>' +
          '</div>',
      },
      downloads: {
        title: "下载",
        address: "about:downloads",
        status: "完成",
        html:
          '<div class="ie-page">' +
          '<section class="download-list">' +
          '<div class="download-item"><div><strong>IE9-Windows7-x64.exe</strong><span>已下载到 下载 文件夹</span><small>今天 10:18 · 19.8 MB</small></div><button class="dialog-button secondary" data-open="properties" data-name="IE9-Windows7-x64.exe" data-kind="安装程序" data-icon="icons/html.png">属性</button></div>' +
          '<div class="download-item"><div><strong>Platform Update KB2670838</strong><span>等待安装</span><small>今天 09:55 · 41.2 MB</small></div><button class="dialog-button secondary" data-open="ie" data-page="help">说明</button></div>' +
          '<div class="download-item"><div><strong>Windows Gadget Pack.msi</strong><span>上周下载</span><small>2026/03/28 · 8.2 MB</small></div><button class="dialog-button secondary" data-open="controlpanel">打开</button></div>' +
          '</section>' +
          '</div>',
      },
      help: {
        title: "帮助和支持",
        address: "res://windows/help",
        status: "完成",
        html:
          '<div class="ie-page">' +
          '<section class="support-grid">' +
          '<div class="support-card"><h3>如何打开程序？</h3><p>双击桌面图标，或使用开始菜单和任务栏图标打开应用程序。</p></div>' +
          '<div class="support-card"><h3>如何浏览库？</h3><p>在资源管理器左侧选择“库”，或从桌面的“库”图标进入。</p></div>' +
          '<div class="support-card"><h3>如何更改外观？</h3><p>右键桌面选择个性化，或在控制面板中打开外观和个性化。</p></div>' +
          '<div class="support-card"><h3>如何管理任务？</h3><p>右键任务栏并启动任务管理器，查看当前运行中的进程。</p></div>' +
          '<div class="support-card"><h3>如何查看托盘消息？</h3><p>单击任务栏右下角的旗标图标打开操作中心，或等待系统气泡提示。</p></div>' +
          '<div class="support-card"><h3>如何返回桌面？</h3><p>点击任务栏最右侧的细条，或在任务栏右键菜单中选择显示桌面。</p></div>' +
          '</section></div>',
      },
    };
  }

  function navigateIeAddress() {
    const value = $("ie-address-bar").value.trim().toLowerCase();
    if (!value || value.includes("windows") || value.includes("go.microsoft")) {
      renderIePage("home");
      return;
    }
    if (value.includes("favorites")) {
      renderIePage("favorites");
      return;
    }
    if (value.includes("downloads")) {
      renderIePage("downloads");
      return;
    }
    if (value.includes("github")) {
      renderIePage("github");
      return;
    }
    if (value.includes("help") || value.includes("res://")) {
      renderIePage("help");
      return;
    }
    renderIePage("home");
    showToast("Internet Explorer", `未找到 ${value}，已返回起始页。`);
  }

  function loadNotepadDoc(docId) {
    currentNotepadDoc = docId;
    if (!notepadDocs[docId]) {
      notepadDocs[docId] = {
        name: docId,
        content: "",
      };
    }
    const doc = notepadDocs[docId];
    $("notepad-title").textContent = `${doc.name} - 记事本`;
    $("notepad-text").value = doc.content;
    updateNotepadStatus();
  }

  function updateNotepadStatus() {
    const textarea = $("notepad-text");
    const cursor = textarea.selectionStart;
    const lines = textarea.value.slice(0, cursor).split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    $("notepad-status").textContent = `第 ${line} 行，第 ${column} 列`;
  }

  function ensureTerminalBanner() {
    const output = $("terminal-output");
    if (output.textContent.trim()) {
      return;
    }
    output.textContent =
      "Microsoft Windows [版本 6.1.7601]\n" +
      "版权所有 (c) 2009 Microsoft Corporation。保留所有权利。\n\n" +
      "键入 help 查看可用命令。\n\n";
  }

  function onTerminalKeyDown(event) {
    const input = event.currentTarget;
    input.history = input.history || [];
    input.historyIndex = input.historyIndex ?? -1;

    if (event.key === "Enter") {
      event.preventDefault();
      const command = input.value.trim();
      executeTerminalCommand(command);
      if (command) {
        input.history.unshift(command);
      }
      input.historyIndex = -1;
      input.value = "";
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (input.historyIndex < input.history.length - 1) {
        input.historyIndex += 1;
        input.value = input.history[input.historyIndex];
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (input.historyIndex > 0) {
        input.historyIndex -= 1;
        input.value = input.history[input.historyIndex];
      } else {
        input.historyIndex = -1;
        input.value = "";
      }
    }
  }

  function appendTerminalLine(text = "") {
    const output = $("terminal-output");
    output.textContent += `${text}\n`;
    output.scrollTop = output.scrollHeight;
  }

  function executeTerminalCommand(command) {
    ensureTerminalBanner();
    appendTerminalLine(`C:\\Users\\baicai>${command}`);
    const lower = command.toLowerCase();
    if (!command) {
      appendTerminalLine("");
      return;
    }
    if (lower === "cls" || lower === "clear") {
      $("terminal-output").textContent = "";
      return;
    }
    if (lower === "help") {
      appendTerminalLine("支持的命令: help, dir, cls, date, time, ver, echo, start, control, taskmgr, winver, exit, systeminfo");
      appendTerminalLine("");
      return;
    }
    if (lower === "dir" || lower === "ls") {
      appendTerminalLine(" 驱动器 C 中的卷是 System");
      appendTerminalLine(" C:\\Users\\baicai 的目录");
      appendTerminalLine("2026/04/02  10:31    <DIR>          Desktop");
      appendTerminalLine("2026/04/02  10:05    <DIR>          Documents");
      appendTerminalLine("2026/04/02  09:59    <DIR>          Music");
      appendTerminalLine("2026/04/02  09:52    <DIR>          Pictures");
      appendTerminalLine("2026/04/02  10:32             4,096 README.txt");
      appendTerminalLine("");
      return;
    }
    if (lower === "date") {
      appendTerminalLine(new Date().toLocaleDateString("zh-CN"));
      appendTerminalLine("");
      return;
    }
    if (lower === "time") {
      appendTerminalLine(new Date().toLocaleTimeString("zh-CN"));
      appendTerminalLine("");
      return;
    }
    if (lower === "ver") {
      appendTerminalLine("Microsoft Windows [版本 6.1.7601]");
      appendTerminalLine("");
      return;
    }
    if (lower.startsWith("echo ")) {
      appendTerminalLine(command.slice(5));
      appendTerminalLine("");
      return;
    }
    if (lower === "control") {
      openTarget("controlpanel");
      appendTerminalLine("正在打开控制面板...");
      appendTerminalLine("");
      return;
    }
    if (lower === "taskmgr") {
      openTarget("taskmgr");
      appendTerminalLine("正在打开 Windows 任务管理器...");
      appendTerminalLine("");
      return;
    }
    if (lower === "winver") {
      openTarget("properties", {
        title: "关于 Windows",
        name: "Windows 7 Professional",
        kind: "操作系统",
        icon: "icons/info.png",
        location: "C:\\Windows",
        description: "版本 6.1 (Build 7601: Service Pack 1)。此界面仅作为静态演示。",
      });
      appendTerminalLine("正在打开版本信息...");
      appendTerminalLine("");
      return;
    }
    if (lower === "systeminfo") {
      appendTerminalLine("主机名:           DESKTOP-BC");
      appendTerminalLine("OS 名称:          Microsoft Windows 7 Professional");
      appendTerminalLine("OS 版本:          6.1.7601 Service Pack 1 Build 7601");
      appendTerminalLine("系统制造商:        GitHub Copilot Lab");
      appendTerminalLine("系统类型:          x64-based PC");
      appendTerminalLine("物理内存总量:      8,192 MB");
      appendTerminalLine("");
      return;
    }
    if (lower.startsWith("start")) {
      if (lower.includes("ie") || lower.includes("explore")) {
        openTarget("ie", { page: "home" });
        appendTerminalLine("正在启动 Internet Explorer...");
      } else if (lower.includes("github")) {
        openTarget("ie", { page: "github" });
        appendTerminalLine("正在打开 GitHub...");
      } else if (lower.includes("notepad")) {
        openTarget("notepad", { doc: "untitled" });
        appendTerminalLine("正在启动记事本...");
      } else if (lower.includes("explorer")) {
        openTarget("explorer", { location: "computer" });
        appendTerminalLine("正在启动 Windows 资源管理器...");
      } else {
        appendTerminalLine(`未找到要启动的目标: ${command}`);
      }
      appendTerminalLine("");
      return;
    }
    if (lower === "exit") {
      closeWindow("terminal-win");
      return;
    }
    appendTerminalLine(`${command} 不是内部或外部命令，也不是可运行的程序或批处理文件。`);
    appendTerminalLine("");
  }

  function buildMediaVisualizer() {
    $("media-visualizer").innerHTML = new Array(22).fill(0).map(() => "<span></span>").join("");
  }

  function renderMediaLibrary() {
    $("media-playlist").innerHTML = mediaLibrary
      .map((item) => {
        return (
          `<button class="media-item${item.id === currentMediaId ? " active" : ""}" data-media-id="${item.id}">` +
          `<img src="${item.icon}" alt="${item.title}">` +
          `<span class="media-item-title"><strong>${item.title}</strong><span>${item.subtitle}</span></span>` +
          `<span>${item.duration}</span>` +
          `</button>`
        );
      })
      .join("");
  }

  function setCurrentMedia(mediaId) {
    currentMediaId = mediaId;
    const current = mediaLibrary.find((item) => item.id === mediaId) || mediaLibrary[0];
    $("media-now-title").textContent = current.title;
    $("media-now-meta").textContent = `${current.subtitle} · ${current.type}`;
    mediaProgress = 18;
    $("media-progress").style.width = `${mediaProgress}%`;
    renderMediaLibrary();
  }

  function moveMediaCursor(direction) {
    const currentIndex = mediaLibrary.findIndex((item) => item.id === currentMediaId);
    const nextIndex = (currentIndex + direction + mediaLibrary.length) % mediaLibrary.length;
    setCurrentMedia(mediaLibrary[nextIndex].id);
  }

  function startMediaTicker() {
    if (mediaTimer) {
      clearInterval(mediaTimer);
    }
    mediaTimer = setInterval(() => {
      if (!mediaPlaying) {
        return;
      }
      mediaProgress += 1.7;
      if (mediaProgress >= 100) {
        moveMediaCursor(1);
      } else {
        $("media-progress").style.width = `${mediaProgress}%`;
      }
    }, 900);
  }

  function renderTaskManager() {
    taskmgrProcesses.forEach((process) => {
      process.cpu = Math.max(0, process.cpu + Math.round(Math.random() * 4 - 2));
      process.memory = Math.max(12, process.memory + Math.round(Math.random() * 12 - 6));
    });
    const cpuUsage = Math.min(98, taskmgrProcesses.reduce((sum, process) => sum + process.cpu, 0));
    const memoryUsage = Math.min(94, Math.round(taskmgrProcesses.reduce((sum, process) => sum + process.memory, 0) / 12));
    $("taskmgr-cpu").textContent = `${cpuUsage}%`;
    $("taskmgr-memory").textContent = `${memoryUsage}%`;
    $("taskmgr-process-count").textContent = String(taskmgrProcesses.length);
    $("taskmgr-list").innerHTML = taskmgrProcesses
      .map((process) => {
        return (
          `<button class="taskmgr-row${process.id === taskmgrSelectionId ? " selected" : ""}" data-id="${process.id}">` +
          `<span>${process.name}</span>` +
          `<span>${process.status}</span>` +
          `<span>${process.cpu}%</span>` +
          `<span>${process.memory} MB</span>` +
          `</button>`
        );
      })
      .join("");
    updateGadgetMeter();
  }

  function applyTheme(themeName) {
    const theme = themes[themeName] || themes.default;
    const root = document.documentElement;
    root.style.setProperty("--accent-top", theme.accentTop);
    root.style.setProperty("--accent-mid", theme.accentMid);
    root.style.setProperty("--accent-bottom", theme.accentBottom);
    root.style.setProperty("--start-right", theme.startRight);
    root.style.setProperty("--start-bottom", theme.startBottom);
    root.style.setProperty("--taskbar-top", theme.taskbarTop);
    root.style.setProperty("--taskbar-bottom", theme.taskbarBottom);
    $$(".theme-card", $("personalization-win")).forEach((card) => {
      card.classList.toggle("active", card.dataset.theme === themeName);
    });
  }

  function updateResolutionLabel() {
    const resolutions = ["1024 × 768", "1280 × 720", "1366 × 768", "1600 × 900", "1920 × 1080"];
    $("resolution-label").textContent = resolutions[Number($("resolution-range").value)];
  }

  const defaultSystemProperties = {
    editionName: "Windows 7 旗舰版",
    servicePack: "Service Pack 1",
    processor: "Intel(R) Core(TM) i5-4570 CPU @ 3.20GHz 3.20 GHz",
    memory: "4.00 GB",
    systemType: "64 位操作系统",
    penTouch: "没有可用于此显示器的笔或触控输入",
    rating: "4.9",
    computerName: "DESKTOP-BC",
    fullComputerName: "DESKTOP-BC",
    workgroup: "WORKGROUP",
    activationState: "Windows 已激活",
    productId: "产品 ID: 00426-OEM-8992662-00497",
  };

  function applyPropertiesWindowMode(view) {
    const propertiesWin = $("properties-win");
    const isSystemView = view === "system";
    const bounds = isSystemView
      ? { width: 930, height: 580, left: 154, top: 78, minWidth: 760, minHeight: 460 }
      : { width: 500, height: 320, left: 430, top: 180, minWidth: 440, minHeight: 280 };

    propertiesWin.dataset.view = view;
    propertiesWin.classList.toggle("system-mode", isSystemView);
    propertiesWin.classList.toggle("general-mode", !isSystemView);
    propertiesWin.classList.remove("maximized");
    propertiesWin.dataset.minWidth = String(bounds.minWidth);
    propertiesWin.dataset.minHeight = String(bounds.minHeight);
    propertiesWin.style.width = `${bounds.width}px`;
    propertiesWin.style.height = `${bounds.height}px`;
    propertiesWin.style.left = `${bounds.left}px`;
    propertiesWin.style.top = `${bounds.top}px`;
    syncMaximizeIcon("properties-win");
  }

  function updateGenericProperties(info) {
    const icon = info.icon || "icons/info.png";
    const location = info.location || "桌面";
    const name = info.name || "项目";

    $("properties-title").textContent = info.title || "属性";
    $("properties-icon").src = icon;
    $("properties-preview").src = icon;
    $("properties-name").textContent = name;
    $("properties-kind").textContent = info.kind || "文件";
    $("properties-location").textContent = location;
    $("properties-created").textContent = info.created || formatDate(new Date());
    $("properties-description").textContent = info.description || `${name} 位于 ${location}。`;
  }

  function updateSystemProperties(info) {
    const systemInfo = { ...defaultSystemProperties, ...info };

    $("properties-title").textContent = "系统";
    $("properties-icon").src = "icons/background-capplet.png";
    $("system-edition-name").textContent = systemInfo.editionName;
    $("system-service-pack").textContent = systemInfo.servicePack;
    $("system-processor").textContent = systemInfo.processor;
    $("system-memory").textContent = systemInfo.memory;
    $("system-type").textContent = systemInfo.systemType;
    $("system-pen-touch").textContent = systemInfo.penTouch;
    $("system-rating-score").textContent = systemInfo.rating;
    $("system-computer-name").textContent = systemInfo.computerName;
    $("system-full-name").textContent = systemInfo.fullComputerName;
    $("system-computer-desc").textContent = systemInfo.computerDesc || "";
    $("system-workgroup").textContent = systemInfo.workgroup;
    $("system-activation-state").textContent = systemInfo.activationState;
    $("system-product-id").textContent = systemInfo.productId;
  }

  function updateProperties(info = {}) {
    const view = info.view === "system" ? "system" : "general";

    applyPropertiesWindowMode(view);
    if (view === "system") {
      updateSystemProperties(info);
      return;
    }
    updateGenericProperties(info);
  }

  function showPropertiesFromElement(element, location) {
    const isComputerTarget = element.dataset.name === "计算机" && (element.dataset.location === "computer" || location === "桌面");

    if (isComputerTarget) {
      openTarget("properties", { view: "system" });
      return;
    }

    openTarget("properties", {
      name: element.dataset.name,
      kind: element.dataset.kind,
      icon: element.dataset.icon,
      location,
      created: element.dataset.created,
      description: `${element.dataset.name} 位于 ${location}，可通过双击打开。`,
    });
  }

  function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    const weekNames = ["日", "一", "二", "三", "四", "五", "六"];
    const firstDay = new Date(year, month, 1).getDay();
    const currentDays = new Date(year, month + 1, 0).getDate();
    const previousDays = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i += 1) {
      cells.push(`<span class="other">${previousDays - firstDay + i + 1}</span>`);
    }
    for (let day = 1; day <= currentDays; day += 1) {
      cells.push(`<span class="${day === today ? "today" : ""}">${day}</span>`);
    }
    while (cells.length < 42) {
      cells.push(`<span class="other">${cells.length - currentDays - firstDay + 1}</span>`);
    }
    $("calendar-popup").innerHTML =
      `<div class="calendar-head"><strong>${year} 年 ${monthNames[month]}</strong><span>${now.toLocaleDateString("zh-CN", { weekday: "long" })}</span></div>` +
      `<div class="calendar-grid">${weekNames.map((name) => `<span class="weekday">${name}</span>`).join("")}${cells.join("")}</div>`;
  }

  function getNotificationIcon(type) {
    if (type === "warning") {
      return "icons/warning.png";
    }
    if (type === "error") {
      return "icons/error.png";
    }
    return "icons/info.png";
  }

  function renderActionCenter() {
    const importantCount = trayNotifications.filter((item) => item.type !== "info").length;
    const badge = $("action-center-count");
    $("action-center-state").textContent = importantCount
      ? `${importantCount} 条重要消息`
      : trayNotifications.length
        ? `${trayNotifications.length} 条消息`
        : "未检测到需要关注的消息";
    badge.textContent = importantCount > 9 ? "9+" : String(importantCount || "");
    badge.style.display = importantCount ? "grid" : "none";
    $("action-center-list").innerHTML = trayNotifications.length
      ? trayNotifications
          .map((item) => {
            return (
              `<div class="action-center-item">` +
              `<img src="${getNotificationIcon(item.type)}" alt="${item.title}">` +
              `<div><strong>${item.title}</strong><span>${item.body}</span><small>${item.time}</small></div>` +
              `</div>`
            );
          })
          .join("")
      : `<div class="action-center-item"><img src="icons/info.png" alt="无消息"><div><strong>没有新消息</strong><span>当前系统状态良好。</span><small>${formatDate(new Date())}</small></div></div>`;
  }

  function showTrayBalloon(type, title, body) {
    $("tray-balloon-icon").src = getNotificationIcon(type);
    $("tray-balloon-icon").alt = title;
    $("tray-balloon-title").textContent = title;
    $("tray-balloon-body").textContent = body;
    trayBalloon.classList.add("show");
    clearTimeout(trayBalloonTimer);
    trayBalloonTimer = setTimeout(() => {
      trayBalloon.classList.remove("show");
    }, 5200);
  }

  function pushTrayNotification(type, title, body, options = {}) {
    trayNotifications.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      type,
      title,
      body,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    });
    if (trayNotifications.length > 6) {
      trayNotifications.length = 6;
    }
    renderActionCenter();
    if (options.balloon) {
      showTrayBalloon(type, title, body);
    }
  }

  function updateGadgetClock() {
    const now = new Date();
    const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    const weekNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    $("gadget-clock-text").textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    $("gadget-calendar-month").textContent = monthNames[now.getMonth()];
    $("gadget-calendar-day").textContent = String(now.getDate()).padStart(2, "0");
    $("gadget-calendar-week").textContent = weekNames[now.getDay()];
    $("gadget-hour-hand").style.transform = `translateX(-50%) rotate(${hours * 30 + minutes * 0.5}deg)`;
    $("gadget-minute-hand").style.transform = `translateX(-50%) rotate(${minutes * 6}deg)`;
    $("gadget-second-hand").style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
  }

  function updateGadgetMeter() {
    const bars = $$("span", $("gadget-meter-bars"));
    if (!bars.length) {
      return;
    }
    const cpuUsage = Math.min(96, Math.max(8, taskmgrProcesses.reduce((sum, process) => sum + process.cpu, 0)));
    const memoryUsage = Math.min(94, Math.max(18, Math.round(taskmgrProcesses.reduce((sum, process) => sum + process.memory, 0) / 12)));
    $("gadget-cpu-label").textContent = `CPU ${cpuUsage}%`;
    $("gadget-ram-label").textContent = `RAM ${memoryUsage}%`;
    bars.forEach((bar, index) => {
      const wave = ((index * 9 + Date.now() / 120) % 100) / 100;
      const height = Math.max(18, Math.min(100, cpuUsage * 0.72 + wave * 28));
      bar.style.height = `${height}%`;
      bar.style.opacity = `${0.42 + (index / bars.length) * 0.48}`;
    });
  }

  function buildGadgetMeter() {
    $("gadget-meter-bars").innerHTML = new Array(14).fill(0).map(() => "<span></span>").join("");
    updateGadgetClock();
    updateGadgetMeter();
  }

  function startGadgetTicker() {
    if (gadgetTimer) {
      clearInterval(gadgetTimer);
    }
    updateGadgetClock();
    updateGadgetMeter();
    gadgetTimer = setInterval(() => {
      updateGadgetClock();
      updateGadgetMeter();
    }, 1000);
  }

  function simulatePowerAction(action) {
    const messages = {
      sleep: "正在让计算机进入睡眠状态...",
      restart: "正在重新启动 Windows...",
      shutdown: "正在关闭 Windows...",
      lock: "正在锁定计算机...",
    };
    hideTrayPopups();
    closeStartMenu();
    $("shutdown-text").textContent = messages[action] || "正在处理...";
    shutdownScreen.classList.add("show");
    setTimeout(() => {
      shutdownScreen.classList.remove("show");
      showToast("系统", "该电源操作为演示模式，桌面已恢复。`".replace("`", ""));
    }, 1400);
  }

  function scheduleTooltip(element) {
    hideTooltip();
    const text = element.dataset.title;
    if (!text) {
      return;
    }
    tooltipTimer = setTimeout(() => {
      const rect = element.getBoundingClientRect();
      taskbarTooltip.textContent = text;
      taskbarTooltip.style.left = `${rect.left + rect.width / 2}px`;
      taskbarTooltip.style.top = `${rect.top - 34}px`;
      taskbarTooltip.style.transform = "translateX(-50%)";
      taskbarTooltip.classList.add("show");
    }, 320);
  }

  function hideTooltip() {
    clearTimeout(tooltipTimer);
    taskbarTooltip.classList.remove("show");
  }

  function showToast(title, body) {
    $("toast-title").textContent = title;
    $("toast-body").textContent = body;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
  }

  initialize();
})();