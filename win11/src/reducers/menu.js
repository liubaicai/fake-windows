const defState = {
  hide: true,
  top: 80,
  left: 360,
  opts: "desk",
  attr: null,
  dataset: null,
  data: {
    desk: {
      width: "310px",
      secwid: "200px",
    },
    task: {
      width: "220px",
      secwid: "120px",
      ispace: false, // show the space for icons in menu
    },
    app: {
      width: "310px",
      secwid: "200px",
    },
    fsbg: {
      width: "260px",
      secwid: "190px",
    },
    fsitem: {
      width: "250px",
      secwid: "180px",
    },
  },
  menus: {
    desk: [
      {
        name: "查看",
        icon: "view",
        type: "svg",
        opts: [
          {
            name: "大图标",
            action: "changeIconSize",
            payload: "large",
          },
          {
            name: "中等图标",
            action: "changeIconSize",
            payload: "medium",
          },
          {
            name: "小图标",
            action: "changeIconSize",
            payload: "small",
            dot: true,
          },
          {
            type: "hr",
          },
          {
            name: "显示桌面图标",
            action: "deskHide",
            check: true,
          },
        ],
      },
      {
        name: "排列方式",
        icon: "sort",
        type: "svg",
        opts: [
          {
            name: "名称",
            action: "changeSort",
            payload: "name",
          },
          {
            name: "大小",
            action: "changeSort",
            payload: "size",
          },
          {
            name: "修改日期",
            action: "changeSort",
            payload: "date",
          },
        ],
      },
      {
        name: "刷新",
        action: "refresh",
        type: "svg",
        icon: "refresh",
      },
      {
        type: "hr",
      },
      {
        name: "新建",
        icon: "New",
        type: "svg",
        opts: [
          {
            name: "文件夹",
            action: "createFsItem",
            payload: "folder",
          },
          {
            name: "快捷方式",
            dsb: true,
          },
          {
            name: "文本文档",
            action: "createFsItem",
            payload: "text",
          },
          {
            name: "ZIP 压缩文件",
            dsb: true,
          },
        ],
      },
      {
        type: "hr",
      },
      {
        name: "显示设置",
        icon: "display",
        type: "svg",
        action: "SETTINGS",
        payload: "full",
      },
      {
        name: "个性化",
        icon: "personalize",
        type: "svg",
        action: "SETTINGS",
        payload: "full",
      },
      {
        type: "hr",
      },
      {
        name: "下一个桌面背景",
        action: "WALLNEXT",
      },
      {
        name: "在终端中打开",
        icon: "terminal",
        action: "OPENTERM",
        payload: "C:\\Users\\Zhangwei\\Desktop",
      },
      {
        name: "关于",
        action: "DESKABOUT",
        icon: "win/info",
        payload: true,
      },
    ],
    task: [
      {
        name: "排列图标",
        opts: [
          {
            name: "居左",
            action: "changeTaskAlign",
            payload: "left",
          },
          {
            name: "居中",
            action: "changeTaskAlign",
            payload: "center",
            dot: true,
          },
        ],
      },
      {
        type: "hr",
      },
      {
        name: "搜索",
        opts: [
          {
            name: "显示",
            action: "TASKSRCH",
            payload: true,
          },
          {
            name: "隐藏",
            action: "TASKSRCH",
            payload: false,
          },
        ],
      },
      {
        name: "小部件",
        opts: [
          {
            name: "显示",
            action: "TASKWIDG",
            payload: true,
          },
          {
            name: "隐藏",
            action: "TASKWIDG",
            payload: false,
          },
        ],
      },
      {
        type: "hr",
      },
      {
        name: "显示桌面",
        action: "SHOWDSK",
      },
    ],
    app: [
      {
        name: "打开",
        action: "performApp",
        payload: "open",
      },
      {
        name: "以管理员身份运行",
        action: "performApp",
        payload: "open",
        icon: "win/shield",
      },
      {
        name: "打开文件所在的位置",
        dsb: true,
      },
      {
        name: "从开始菜单取消固定",
        dsb: true,
      },
      {
        name: "压缩为 ZIP 文件",
        dsb: true,
      },
      {
        name: "复制文件地址",
        dsb: true,
      },
      {
        name: "属性",
        dsb: true,
      },
      {
        type: "hr",
      },
      {
        name: "删除快捷方式",
        action: "performApp",
        payload: "delshort",
      },
      {
        name: "删除",
        action: "delApp",
        payload: "delete",
      },
    ],
    fsbg: [
      {
        name: "查看",
        icon: "ui/view",
        opts: [
          {
            name: "大图标",
            action: "changeFileView",
            payload: "1",
            dot: true,
          },
          {
            name: "列表",
            action: "changeFileView",
            payload: "5",
          },
        ],
      },
      {
        name: "排序方式",
        icon: "ui/sort",
        opts: [
          {
            name: "名称",
            action: "changeFileSort",
            payload: "name",
            dot: true,
          },
          {
            name: "类型",
            action: "changeFileSort",
            payload: "type",
          },
        ],
      },
      {
        name: "分组依据",
        icon: "ui/more",
        opts: [
          {
            name: "无",
            dsb: true,
          },
          {
            name: "名称",
            dsb: true,
          },
          {
            name: "类型",
            dsb: true,
          },
        ],
      },
      {
        type: "hr",
      },
      {
        name: "粘贴",
        icon: "ui/paste",
        dsb: true,
      },
      {
        name: "粘贴快捷方式",
        icon: "ui/link",
        dsb: true,
      },
      {
        type: "hr",
      },
      {
        name: "刷新",
        icon: "ui/refresh",
        action: "refreshFsView",
      },
      {
        type: "hr",
      },
      {
        name: "新建",
        icon: "ui/new",
        opts: [
          {
            name: "文件夹",
            action: "createFsItem",
            payload: "folder",
          },
          {
            name: "文本文档",
            action: "createFsItem",
            payload: "text",
          },
          {
            name: "快捷方式",
            dsb: true,
          },
          {
            name: "ZIP 压缩文件",
            dsb: true,
          },
        ],
      },
      {
        type: "hr",
      },
      {
        name: "在终端中打开",
        type: "fa",
        icon: "faTerminal",
        action: "openFsTerminal",
      },
      {
        name: "属性",
        icon: "win/info",
        action: "showFsProperties",
      },
    ],
    fsitem: [
      {
        name: "打开",
        action: "openFsItem",
        type: "fa",
        icon: "faArrowUpRightFromSquare",
        iwidth: 15,
      },
      {
        name: "在终端中打开",
        action: "openFsTerminal",
        type: "fa",
        icon: "faTerminal",
      },
      {
        type: "hr",
      },
      {
        name: "剪切",
        icon: "ui/cut",
        dsb: true,
      },
      {
        name: "复制",
        icon: "ui/copy",
        dsb: true,
      },
      {
        name: "复制为路径",
        icon: "ui/copy",
        action: "copyFsPath",
      },
      {
        type: "hr",
      },
      {
        name: "重命名",
        action: "renameFsItem",
        icon: "ui/rename",
      },
      {
        name: "删除",
        action: "deleteFsItem",
        type: "fa",
        icon: "faTrashCan",
        iwidth: 15,
      },
      {
        type: "hr",
      },
      {
        name: "属性",
        action: "showFsProperties",
        icon: "win/info",
      },
    ],
  },
};

const menusReducer = (state = defState, action) => {
  var tmpState = {
    ...state,
  };
  if (action.type == "MENUHIDE") {
    tmpState.hide = true;
  } else if (action.type == "MENUSHOW") {
    tmpState.hide = false;
    tmpState.top = (action.payload && action.payload.top) || 272;
    tmpState.left = (action.payload && action.payload.left) || 430;
    tmpState.opts = (action.payload && action.payload.menu) || "desk";
    tmpState.attr = action.payload && action.payload.attr;
    tmpState.dataset = action.payload && action.payload.dataset;
  } else if (action.type == "MENUCHNG") {
    tmpState = {
      ...action.payload,
    };
  }

  return tmpState;
};

export default menusReducer;
