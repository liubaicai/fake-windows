export class Item {
  constructor({ type, name, info, data, host }) {
    this.type = type || "folder";
    this.name = name;
    this.info = { ...(info || {}) };
    this.info.icon =
      this.info.icon || (this.type === "text" ? "docs" : this.type);
    this.data = this.type === "folder" ? data || [] : data ?? "";
    this.host = host;
    this.id = this.gene();
  }

  gene() {
    return Math.random().toString(36).substring(2, 10).toLowerCase();
  }

  getId() {
    return this.id;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }
}

export class Bin {
  constructor() {
    this.tree = [];
    this.lookup = {};
    this.special = {};
  }

  setSpecial(spid, id) {
    this.special[spid] = id;
  }

  setId(id, item) {
    this.lookup[id] = item;
  }

  getId(id) {
    return this.lookup[id];
  }

  getPath(id) {
    var cpath = "";
    var curr = this.getId(id);

    while (curr) {
      cpath = curr.name + "\\" + cpath;
      curr = curr.host;
    }

    return cpath
      .split("\\")
      .filter((part) => part !== "")
      .join("\\");
  }

  parsePath(cpath) {
    if (cpath.includes("%")) {
      return this.special[cpath.trim()];
    }

    cpath = cpath
      .split("\\")
      .filter((x) => x !== "")
      .map((x) => x.trim().toLowerCase());
    if (cpath.length === 0) return null;

    var pid = null,
      curr = null;
    for (var i = 0; i < this.tree.length; i++) {
      if (this.tree[i].name.toLowerCase() === cpath[0]) {
        curr = this.tree[i];
        break;
      }
    }

    if (curr) {
      var i = 1,
        l = cpath.length;
      while (curr.type === "folder" && i < l) {
        var res = true;
        for (var j = 0; j < curr.data.length; j++) {
          if (curr.data[j].name.toLowerCase() === cpath[i]) {
            i += 1;
            if (curr.data[j].type === "folder") {
              res = false;
              curr = curr.data[j];
            }

            break;
          }
        }

        if (res) break;
      }

      if (i === l) pid = curr.id;
    }

    return pid;
  }

  findItemByName(parentId, name) {
    var parent = this.getId(parentId);
    if (parent == null || parent.type !== "folder") return null;

    return parent.data.find((item) => item.name === name) || null;
  }

  hasName(parentId, name, excludeId = null) {
    var parent = this.getId(parentId);
    if (parent == null || parent.type !== "folder") return false;

    var lname = name.toLowerCase();
    return parent.data.some(
      (item) => item.id !== excludeId && item.name.toLowerCase() === lname,
    );
  }

  createItem(parentId, data) {
    var parent = this.getId(parentId);
    if (parent == null || parent.type !== "folder") return null;

    var item = new Item({
      type: data.type,
      name: data.name,
      info: data.info,
      data: data.type === "folder" ? [] : data.data,
      host: parent,
    });

    this.setId(item.id, item);
    parent.setData([...parent.getData(), item]);

    return item;
  }

  renameItem(id, name) {
    var item = this.getId(id);
    if (item == null) return null;

    item.name = name;
    return item;
  }

  updateItemData(id, data) {
    var item = this.getId(id);
    if (item == null || item.type === "folder") return null;

    item.setData(data);
    return item;
  }

  removeItem(id) {
    var item = this.getId(id);
    if (item == null || item.host == null) return null;

    item.host.setData(item.host.getData().filter((child) => child.id !== id));
    this.removeLookup(item);
    return item;
  }

  removeLookup(item) {
    if (item.type === "folder") {
      item.data.forEach((child) => this.removeLookup(child));
    }

    Object.keys(this.special).forEach((key) => {
      if (this.special[key] === item.id) {
        delete this.special[key];
      }
    });

    delete this.lookup[item.id];
  }

  toJSON() {
    var output = {};

    const serializeItem = (item) => {
      var node = {};

      if (item.type !== "folder") {
        node.type = item.type;
      }

      if (item.info && Object.keys(item.info).length) {
        node.info = { ...item.info };
      }

      if (item.type === "folder") {
        if (item.data.length) {
          node.data = {};
          item.data.forEach((child) => {
            node.data[child.name] = serializeItem(child);
          });
        }
      } else {
        node.data = item.data ?? "";
      }

      return node;
    };

    this.tree.forEach((item) => {
      output[item.name] = serializeItem(item);
    });

    return output;
  }

  parseFolder(data = {}, name, host = null) {
    var type =
      data.type ||
      (typeof data.data === "string" || typeof data.content === "string"
        ? "text"
        : "folder");
    var item = new Item({
      type: type,
      name: data.name || name,
      info: data.info,
      host: host,
    });

    this.setId(item.id, item);

    if (data.info && data.info.spid) {
      this.setSpecial(data.info.spid, item.id);
    }

    if (item.type !== "folder") {
      item.setData(data.data ?? data.content ?? "");
    } else {
      var fdata = [];
      if (data.data && typeof data.data === "object") {
        for (const key of Object.keys(data.data)) {
          fdata.push(this.parseFolder(data.data[key], key, item));
        }
      }

      item.setData(fdata);
    }

    return item;
  }

  parse(data) {
    var drives = Object.keys(data);
    var tree = [];
    for (var i = 0; i < drives.length; i++) {
      tree.push(this.parseFolder(data[drives[i]]));
    }

    this.tree = tree;
  }
}
