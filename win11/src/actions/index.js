import axios from "axios";
import store from "../reducers";
import { dfApps } from "../utils";
import { gene_name } from "../utils/apps";

import { sendActionLog } from "../utils/log";
export { sendActionLog };

export const showDialog = (payload) => {
  store.dispatch({ type: "DIALOG_SHOW", payload });
};

export const hideDialog = () => {
  store.dispatch({ type: "DIALOG_HIDE" });
};

export const showInfoDialog = (title, message, metaText = "") => {
  showDialog({
    kind: "info",
    title,
    message,
    metaText,
    confirmText: "关闭",
    cancelText: "",
  });
};

export const dispatchAction = (event) => {
  const action = {
    type: event.currentTarget.dataset.action,
    payload: event.currentTarget.dataset.payload,
  };

  if (action.type) {
    sendActionLog(action.type);
    store.dispatch(action);
  }
};

export const refresh = (pl, menu) => {
  if (menu.menus.desk[0].opts[4].check) {
    store.dispatch({ type: "DESKHIDE" });
    setTimeout(() => store.dispatch({ type: "DESKSHOW" }), 100);
  }
};

export const changeIconSize = (size, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[0].dot = false;
  tmpMenu.menus.desk[0].opts[1].dot = false;
  tmpMenu.menus.desk[0].opts[2].dot = false;
  var isize = 1;

  if (size == "large") {
    tmpMenu.menus.desk[0].opts[0].dot = true;
    isize = 1.5;
  } else if (size == "medium") {
    tmpMenu.menus.desk[0].opts[1].dot = true;
    isize = 1.2;
  } else {
    tmpMenu.menus.desk[0].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({ type: "DESKSIZE", payload: isize });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const deskHide = (payload, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[4].check ^= 1;

  store.dispatch({ type: "DESKTOGG" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeSort = (sort, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[1].opts[0].dot = false;
  tmpMenu.menus.desk[1].opts[1].dot = false;
  tmpMenu.menus.desk[1].opts[2].dot = false;
  if (sort == "name") {
    tmpMenu.menus.desk[1].opts[0].dot = true;
  } else if (sort == "size") {
    tmpMenu.menus.desk[1].opts[1].dot = true;
  } else {
    tmpMenu.menus.desk[1].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({ type: "DESKSORT", payload: sort });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeTaskAlign = (align, menu) => {
  var tmpMenu = { ...menu };
  if (tmpMenu.menus.task[0].opts[align == "left" ? 0 : 1].dot) return;

  tmpMenu.menus.task[0].opts[0].dot = false;
  tmpMenu.menus.task[0].opts[1].dot = false;

  if (align == "left") {
    tmpMenu.menus.task[0].opts[0].dot = true;
  } else {
    tmpMenu.menus.task[0].opts[1].dot = true;
  }

  store.dispatch({ type: "TASKTOG" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const performApp = (act, menu) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  if (act == "open") {
    if (data.type) {
      sendActionLog(data.type);
      store.dispatch(data);
    }
  } else if (act == "delshort") {
    if (data.type) {
      var apps = store.getState().apps;
      var app = Object.keys(apps).filter(
        (x) =>
          apps[x].action == data.type ||
          (apps[x].payload == data.payload && apps[x].payload != null),
      );

      app = apps[app];
      if (app) {
        store.dispatch({ type: "DESKREM", payload: app.name });
      }
    }
  }
};

export const delApp = (act, menu) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  if (act == "delete") {
    if (data.type) {
      var apps = store.getState().apps;
      var app = Object.keys(apps).filter((x) => apps[x].action == data.type);
      if (app) {
        app = apps[app];
        if (app.pwa == true) {
          store.dispatch({ type: app.action, payload: "close" });
          store.dispatch({ type: "DELAPP", payload: app.icon });

          var installed = localStorage.getItem("installed");
          if (!installed) installed = "[]";

          installed = JSON.parse(installed);
          installed = installed.filter((x) => x.icon != app.icon);
          localStorage.setItem("installed", JSON.stringify(installed));

          store.dispatch({ type: "DESKREM", payload: app.name });
        }
      }
    }
  }
};

export const installApp = (data) => {
  var app = { ...data, type: "app", pwa: true };

  var installed = localStorage.getItem("installed");
  if (!installed) installed = "[]";

  installed = JSON.parse(installed);
  installed.push(app);
  localStorage.setItem("installed", JSON.stringify(installed));

  var desk = localStorage.getItem("desktop");
  if (!desk) desk = dfApps.desktop;
  else desk = JSON.parse(desk);

  desk.push(app.name);
  localStorage.setItem("desktop", JSON.stringify(desk));

  app.action = gene_name();
  store.dispatch({ type: "ADDAPP", payload: app });
  store.dispatch({ type: "DESKADD", payload: app });
  store.dispatch({ type: "WNSTORE", payload: "mnmz" });
};

export const getTreeValue = (obj, path) => {
  if (path == null) return false;

  var tdir = { ...obj };
  path = path.split(".");
  for (var i = 0; i < path.length; i++) {
    tdir = tdir[path[i]];
  }

  return tdir;
};

export const changeTheme = () => {
  var thm = store.getState().setting.person.theme,
    thm = thm == "light" ? "dark" : "light";
  var icon = thm == "light" ? "sun" : "moon";
  if (window.__sendLog) window.__sendLog("切换主题");

  document.body.dataset.theme = thm;
  store.dispatch({ type: "STNGTHEME", payload: thm });
  store.dispatch({ type: "PANETHEM", payload: icon });
  store.dispatch({ type: "WALLSET", payload: thm == "light" ? 0 : 1 });
};

const loadWidget = async () => {
  var tmpWdgt = {
      ...store.getState().widpane,
    },
    date = new Date();

  // console.log('fetching ON THIS DAY');
  var wikiurl = "https://en.wikipedia.org/api/rest_v1/feed/onthisday/events";
  await axios
    .get(`${wikiurl}/${date.getMonth()}/${date.getDay()}`)
    .then((res) => res.data)
    .then((data) => {
      var event = data.events[Math.floor(Math.random() * data.events.length)];
      date.setYear(event.year);

      tmpWdgt.data.date = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      tmpWdgt.data.event = event;
    })
    .catch((error) => {});

  store.dispatch({
    type: "WIDGREST",
    payload: tmpWdgt,
  });
};

export const loadSettings = () => {
  var sett = localStorage.getItem("setting") || "{}";
  sett = JSON.parse(sett);

  if (sett.person == null) {
    sett = JSON.parse(JSON.stringify(store.getState().setting));
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      sett.person.theme = "dark";
    }
  }

  if (sett.person.theme != "light") changeTheme();

  store.dispatch({ type: "SETTLOAD", payload: sett });
  if (import.meta.env.MODE != "development") {
    loadWidget();
  }
};

const getFsParentId = (menu) => {
  const files = store.getState().files;

  if (menu?.opts == "desk") {
    return files.data.special["%desktop%"];
  }

  return menu?.dataset?.dir || files.cdir;
};

const getFsTargetItem = (menu) => {
  const targetId = menu?.dataset?.id;
  if (targetId == null) return null;

  return store.getState().files.data.getId(targetId);
};

const getFsContextItem = (menu) => {
  var item = getFsTargetItem(menu);
  if (item) return item;

  var parentId = getFsParentId(menu);
  if (parentId == null) return null;

  return store.getState().files.data.getId(parentId);
};

const isProtectedFsItem = (item) => {
  return item == null || item.host == null || item.info?.spid != null;
};

const makeUniqueName = (bin, parentId, rawName, excludeId = null) => {
  var name = rawName.trim();
  if (!bin.hasName(parentId, name, excludeId)) return name;

  var dotIndex = name.lastIndexOf(".");
  var hasExt = dotIndex > 0;
  var stem = hasExt ? name.slice(0, dotIndex) : name;
  var ext = hasExt ? name.slice(dotIndex) : "";
  var index = 2;
  var candidate = `${stem} (${index})${ext}`;

  while (bin.hasName(parentId, candidate, excludeId)) {
    index += 1;
    candidate = `${stem} (${index})${ext}`;
  }

  return candidate;
};

const normalizeFsName = (name, item) => {
  var nextName = (name || "").trim();
  if (nextName == "") return "";
  if (nextName.includes("\\") || nextName.includes("/")) return "";

  if (item?.type == "text" && !/\.[^.]+$/.test(nextName)) {
    nextName = `${nextName}.txt`;
  }

  return nextName;
};

const getFsPath = (item) => {
  if (item == null) return "";
  return store.getState().files.data.getPath(item.id);
};

const getFsTypeLabel = (item) => {
  if (item == null) return "";
  return item.type == "folder" ? "文件夹" : "文本文档";
};

const buildFsPropertyRows = (item) => {
  if (item == null) return [];

  var parentPath = item.host ? getFsPath(item.host) : "";
  var extra =
    item.type == "folder"
      ? `${item.data.length} 个项目`
      : `${(item.data || "").length} 个字符`;

  return [
    {
      label: "类型",
      value: getFsTypeLabel(item),
    },
    {
      label: "位置",
      value: parentPath || "此位置",
    },
    {
      label: "完整路径",
      value: getFsPath(item),
    },
    {
      label: item.type == "folder" ? "包含" : "内容",
      value: extra,
    },
  ];
};

const validateFsRename = (id, rawName) => {
  var item = store.getState().files.data.getId(id);
  if (item == null) {
    return { ok: false, error: "该项目已不存在。" };
  }

  if (isProtectedFsItem(item)) {
    return { ok: false, error: "系统目录暂不支持重命名。" };
  }

  var nextName = normalizeFsName(rawName, item);
  if (nextName == "") {
    return { ok: false, error: "名称无效，不能为空且不能包含斜杠。" };
  }

  nextName = makeUniqueName(
    store.getState().files.data,
    item.host.id,
    nextName,
    item.id,
  );

  return {
    ok: true,
    item,
    name: nextName,
  };
};

// mostly file explorer
export const handleFileOpen = (id) => {
  // handle double click open
  const item = store.getState().files.data.getId(id);
  if (item != null) {
    if (item.type == "folder") {
      store.dispatch({ type: "FILEDIR", payload: item.id });
      store.dispatch({ type: "EXPLORER", payload: "front" });
    } else if (item.type == "text") {
      store.dispatch({ type: "NOTEPADFILE", payload: item.id });
    }
  }
};

export const createFsItem = (kind, menu) => {
  const files = store.getState().files;
  const parentId = getFsParentId(menu);

  if (parentId == null) return;

  var item =
    kind == "text"
      ? {
          type: "text",
          name: "新建文本文档.txt",
          data: "",
        }
      : {
          type: "folder",
          name: "新建文件夹",
        };

  item.name = makeUniqueName(files.data, parentId, item.name);

  store.dispatch({
    type: "FILECREATE",
    payload: {
      parentId,
      item,
    },
  });

  if (kind == "text") {
    var created = store.getState().files.data.findItemByName(parentId, item.name);
    if (created) {
      store.dispatch({ type: "NOTEPADFILE", payload: created.id });
    }
  }
};

export const openFsItem = (_, menu) => {
  var item = getFsTargetItem(menu);
  if (item) {
    handleFileOpen(item.id);
  }
};

export const changeFileView = (view, menu) => {
  var nextView = Number(view);
  var tmpMenu = { ...menu };

  tmpMenu.menus.fsbg[0].opts[0].dot = nextView == 1;
  tmpMenu.menus.fsbg[0].opts[1].dot = nextView == 5;

  store.dispatch({ type: "FILEVIEW", payload: nextView });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeFileSort = (sort, menu) => {
  var tmpMenu = { ...menu };

  tmpMenu.menus.fsbg[1].opts[0].dot = sort == "name";
  tmpMenu.menus.fsbg[1].opts[1].dot = sort == "type";

  store.dispatch({ type: "FILESORT", payload: sort });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const refreshFsView = (_, menu) => {
  var parentId = getFsParentId(menu);
  if (parentId) {
    store.dispatch({ type: "FILEDIR", payload: parentId });
  }
};

export const openFsTerminal = (_, menu) => {
  var item = getFsContextItem(menu);
  if (item == null) return;

  var dirItem = item.type == "folder" ? item : item.host;
  if (dirItem == null) return;

  store.dispatch({ type: "OPENTERM", payload: getFsPath(dirItem) });
};

export const copyFsPath = async (_, menu) => {
  var item = getFsContextItem(menu);
  if (item == null) return;

  var path = getFsPath(item);

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(path);
      return;
    }
  } catch (error) {}

  showInfoDialog(
    "复制路径",
    "当前环境无法直接写入剪贴板，请手动复制以下路径。",
    path,
  );
};

export const showFsProperties = (_, menu) => {
  var item = getFsContextItem(menu);
  if (item == null) return;

  showDialog({
    kind: "properties",
    title: "属性",
    name: item.name,
    icon: item.info?.icon || (item.type == "folder" ? "folder" : "docs"),
    details: buildFsPropertyRows(item),
    confirmText: "关闭",
    cancelText: "",
  });
};

export const renameFsItem = (_, menu) => {
  var item = getFsTargetItem(menu);
  if (item == null) return;

  if (isProtectedFsItem(item)) {
    showInfoDialog("无法重命名", "系统目录暂不支持重命名。");
    return;
  }

  showDialog({
    kind: "rename",
    title: "重命名",
    itemId: item.id,
    initialValue: item.name,
    name: item.name,
    icon: item.info?.icon || (item.type == "folder" ? "folder" : "docs"),
    message: "输入新的项目名称",
    confirmText: "重命名",
    cancelText: "取消",
  });
};

export const submitRenameFsItem = (id, rawName) => {
  var result = validateFsRename(id, rawName);
  if (!result.ok) return result;

  store.dispatch({
    type: "FILERENAME",
    payload: {
      id,
      name: result.name,
    },
  });
  hideDialog();

  return result;
};

export const deleteFsItem = (_, menu) => {
  var item = getFsTargetItem(menu);
  if (item == null) return;

  if (isProtectedFsItem(item)) {
    showInfoDialog("无法删除", "系统目录暂不支持删除。");
    return;
  }

  showDialog({
    kind: "delete",
    title: "删除项目",
    itemId: item.id,
    name: item.name,
    icon: item.info?.icon || (item.type == "folder" ? "folder" : "docs"),
    message: `确定要删除“${item.name}”吗？`,
    metaText: "删除后将立即从当前虚拟文件系统中移除。",
    confirmText: "删除",
    cancelText: "取消",
  });
};

export const confirmDeleteFsItem = (id) => {
  var item = store.getState().files.data.getId(id);
  if (item == null) {
    hideDialog();
    return;
  }

  store.dispatch({
    type: "FILEDELETE",
    payload: {
      id,
    },
  });
  hideDialog();
};

export const flightMode = () => {
  store.dispatch({ type: "TOGGAIRPLNMD", payload: "" });
};