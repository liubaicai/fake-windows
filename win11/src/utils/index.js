import icons from "./apps";

const removedApps = new Set([
  "Buy me a coffee",
  "Spotify",
  "Github",
  "Unescape",
]);

const sanitizeList = (key, fallback) => {
  const stored = localStorage.getItem(key);
  const parsed = stored ? JSON.parse(stored) : fallback;

  return parsed.filter((name) => !removedApps.has(name));
};

var { taskbar, desktop, pinned, recent } = {
  taskbar: sanitizeList("taskbar", [
    "设置",
    "文件资源管理器",
    "Microsoft Edge",
    "Store",
  ]),
  desktop: sanitizeList("desktop", [
    "此电脑",
    "回收站",
    "文件资源管理器",
    "Store",
    "Microsoft Edge",
  ]),
  pinned: sanitizeList("pinned", [
    "Microsoft Edge",
    "入门",
    "任务管理器",
    "邮件",
    "设置",
    "Store",
    "记事本",
    "Whiteboard",
    "计算器",
    "文件资源管理器",
    "终端",
    "相机",
  ]),
  recent: sanitizeList("recent", [
    "邮件",
    "终端",
    "文件资源管理器",
    "Edge",
  ]),
};

export const taskApps = icons.filter((x) => taskbar.includes(x.name));

export const desktopApps = icons
  .filter((x) => desktop.includes(x.name))
  .sort((a, b) => {
    return desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1;
  });

export const pinnedApps = icons
  .filter((x) => pinned.includes(x.name))
  .sort((a, b) => {
    return pinned.indexOf(a.name) > pinned.indexOf(b.name) ? 1 : -1;
  });

export const recentApps = icons
  .filter((x) => recent.includes(x.name))
  .sort((a, b) => {
    return recent.indexOf(a.name) > recent.indexOf(b.name) ? 1 : -1;
  });

export const allApps = icons.filter((app) => {
  return app.type === "app";
});

export const dfApps = {
  taskbar,
  desktop,
  pinned,
  recent,
};
