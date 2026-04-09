const actionLogMap = {
  CALCUAPP: "RDP打开计算器",
  SETTINGS: "RDP打开设置",
  EXPLORER: "RDP打开文件资源管理器",
  MSEDGE: "RDP打开Microsoft Edge",
  WNSTORE: "RDP打开Store",
  NOTEPAD: "RDP打开记事本",
  TERMINAL: "RDP打开终端",
  OPENTERM: "RDP打开终端",
  WHITEBOARD: "RDP打开Whiteboard",
  CAMERA: "RDP打开相机",
  OOBE: "RDP打开入门",
  TASKMANAGER: "RDP打开任务管理器",
  REGEDIT: "注册表行为",
  EDGELINK: "RDP打开Microsoft Edge",
  STARTOGG: "RDP打开开始菜单",
  STARTMENU: "RDP打开开始菜单",
  STARTSRC: "RDP打开搜索",
  SEARCHMENU: "RDP打开搜索",
  WIDGTOGG: "RDP打开小部件",
  WIDGETS: "RDP打开小部件",
  WALLSHUTDN: "RDP关机",
  WALLRESTART: "RDP重启",
  SHOWDSK: "RDP显示桌面",
  WALLNEXT: "RDP更换壁纸",
  DESKABOUT: "RDP关于",
  EXTERNAL: "RDP打开外部链接",
  BANDTOGG: "RDP打开快捷面板",
  PANETOGG: "RDP打开快速设置",
  CALNTOGG: "RDP打开日历",
};

export const sendActionLog = (actionType) => {
  if (window.__sendLog && actionType && actionLogMap[actionType]) {
    window.__sendLog(actionLogMap[actionType]);
  }
};
