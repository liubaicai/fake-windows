import { Bin } from "../utils/bin";
import fdata from "./dir.json";

const loadFileTree = () => {
  if (typeof window === "undefined") return fdata;

  var stored = localStorage.getItem("files");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {}
  }

  return fdata;
};

const persistFiles = (data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("files", JSON.stringify(data.toJSON()));
};

const getFallbackDir = (data) => {
  return data.special["%user%"] || data.special["%cdrive%"] || data.tree[0]?.id;
};

const defState = {
  cdir: "%user%",
  hist: [],
  hid: 0,
  view: 1,
  sort: "name",
};

defState.hist.push(defState.cdir);
defState.data = new Bin();
defState.data.parse(loadFileTree());

const fileReducer = (state = defState, action) => {
  var tmp = { ...state };
  var navHist = false;

  if (action.type === "FILEDIR") {
    tmp.cdir = action.payload;
  } else if (action.type === "FILEPATH") {
    var pathid = tmp.data.parsePath(action.payload);
    if (pathid) tmp.cdir = pathid;
  } else if (action.type === "FILEBACK") {
    var item = tmp.data.getId(tmp.cdir);
    if (item.host) {
      tmp.cdir = item.host.id;
    }
  } else if (action.type === "FILEVIEW") {
    tmp.view = action.payload;
  } else if (action.type === "FILESORT") {
    tmp.sort = action.payload || "name";
  } else if (action.type === "FILEPREV") {
    tmp.hid--;
    if (tmp.hid < 0) tmp.hid = 0;
    navHist = true;
  } else if (action.type === "FILENEXT") {
    tmp.hid++;
    if (tmp.hid > tmp.hist.length - 1) tmp.hid = tmp.hist.length - 1;
    navHist = true;
  } else if (action.type === "FILECREATE") {
    tmp.data.createItem(action.payload.parentId, action.payload.item);
    persistFiles(tmp.data);
  } else if (action.type === "FILERENAME") {
    tmp.data.renameItem(action.payload.id, action.payload.name);
    persistFiles(tmp.data);
  } else if (action.type === "FILEDELETE") {
    var item = tmp.data.getId(action.payload.id);
    if (item && item.host) {
      tmp.hist = tmp.hist.filter((id) => id !== item.id);
      if (tmp.cdir === item.id) {
        tmp.cdir = item.host.id;
      }

      tmp.data.removeItem(item.id);
      if (tmp.hist.length === 0) {
        tmp.hist.push(tmp.cdir);
      }
      if (tmp.hid > tmp.hist.length - 1) {
        tmp.hid = tmp.hist.length - 1;
      }

      persistFiles(tmp.data);
    }
  } else if (action.type === "FILEUPDATE") {
    tmp.data.updateItemData(action.payload.id, action.payload.data);
    persistFiles(tmp.data);
  }

  if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
    tmp.hist.splice(tmp.hid + 1);
    tmp.hist.push(tmp.cdir);
    tmp.hid = tmp.hist.length - 1;
  }

  tmp.cdir = tmp.hist[tmp.hid];
  if (tmp.cdir.includes("%")) {
    if (tmp.data.special[tmp.cdir] != null) {
      tmp.cdir = tmp.data.special[tmp.cdir];
      tmp[tmp.hid] = tmp.cdir;
    }
  }

  if (tmp.data.getId(tmp.cdir) == null) {
    tmp.cdir = getFallbackDir(tmp.data);
    tmp.hist = tmp.cdir ? [tmp.cdir] : [];
    tmp.hid = 0;
  }

  tmp.cpath = tmp.cdir ? tmp.data.getPath(tmp.cdir) : "";
  return tmp;
};

export default fileReducer;
