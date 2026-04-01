(function () {
  const $ = (id) => document.getElementById(id),
    $$ = (s) => document.querySelectorAll(s);
  const desktop = $("desktop"),
    taskbar = $("taskbar"),
    startMenu = $("start-menu"),
    startBtn = $("start-btn");
  const searchPanel = $("search-panel"),
    calPopup = $("calendar-popup"),
    volPopup = $("volume-popup"),
    netPopup = $("network-popup");
  const actionCenter = $("action-center"),
    taskView = $("task-view");

  // ===== WINDOWS REGISTRY =====
  const wins = {
    "explorer-win": { tb: "tb-explorer", title: "文件资源管理器" },
    "notepad-win": { tb: "tb-notepad", title: "记事本" },
    "terminal-win": { tb: "tb-terminal", title: "Windows PowerShell" },
    "taskmgr-win": { tb: "tb-taskmgr", title: "任务管理器" },
    "settings-win": { tb: "tb-settings", title: "设置" },
    "edge-win": { tb: "tb-edge", title: "Microsoft Edge" },
    "controlpanel-win": { tb: "tb-controlpanel", title: "控制面板" },
  };
  let focusedWin = null;

  // ===== Clock =====
  function updateClock() {
    const n = new Date();
    const hh = String(n.getHours()).padStart(2, "0"),
      mm = String(n.getMinutes()).padStart(2, "0");
    $("clock-time").textContent = hh + ":" + mm;
    $("clock-date").textContent =
      n.getFullYear() + "/" + (n.getMonth() + 1) + "/" + n.getDate();
  }
  updateClock();
  setInterval(updateClock, 5000);

  // ===== Toast =====
  function showToast(title, body) {
    $("toast-title").textContent = title;
    $("toast-body").textContent = body;
    $("toast").classList.add("show");
    setTimeout(() => $("toast").classList.remove("show"), 4000);
  }

  // Welcome toast on load
  // toast disabled

  // ===== Close All Popups =====
  function closeAll() {
    $$(".ctx-menu").forEach((m) => m.classList.remove("show"));
    startMenu.classList.remove("show");
    startBtn.classList.remove("active");
    searchPanel.classList.remove("show");
    calPopup.classList.remove("show");
    volPopup.classList.remove("show");
    netPopup.classList.remove("show");
    actionCenter.classList.remove("show");
    taskView.classList.remove("show");
  }

  // ===== Desktop right-click =====
  desktop.addEventListener("contextmenu", function (e) {
    if (e.target.closest(".desktop-icon,.window")) return;
    e.preventDefault();
    closeAll();
    const m = $("desktop-ctx");
    let x = e.clientX,
      y = e.clientY;
    if (x + 230 > innerWidth) x = innerWidth - 230;
    if (y + 350 > innerHeight - 40) y = innerHeight - 390;
    m.style.left = x + "px";
    m.style.top = y + "px";
    m.classList.add("show");
  });
  $("ctx-refresh").addEventListener("click", () => location.reload());

  // ===== Icon right-click =====
  let iconCtxTarget = null;
  desktop.addEventListener("contextmenu", function (e) {
    const icon = e.target.closest(".desktop-icon");
    if (!icon) return;
    e.preventDefault();
    e.stopPropagation();
    closeAll();
    iconCtxTarget = icon;
    const m = $("icon-ctx");
    let x = e.clientX,
      y = e.clientY;
    if (x + 200 > innerWidth) x = innerWidth - 200;
    if (y + 220 > innerHeight - 40) y = innerHeight - 260;
    m.style.left = x + "px";
    m.style.top = y + "px";
    m.classList.add("show");
  });
  $("ictx-open").addEventListener("click", () => {
    if (iconCtxTarget) openFromIcon(iconCtxTarget);
    closeAll();
  });
  // Properties (属性) — for "此电脑" opens Settings > About
  $("ictx-properties").addEventListener("click", () => {
    closeAll();
    if (iconCtxTarget && iconCtxTarget.dataset.name === "此电脑") {
      openSettingsPage("system", "about");
      openWindow("settings-win");
    }
  });

  // ===== Taskbar right-click =====
  taskbar.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    closeAll();
    const m = $("taskbar-ctx");
    let x = e.clientX;
    if (x + 260 > innerWidth) x = innerWidth - 260;
    m.style.left = x + "px";
    m.style.top = innerHeight - 40 - 380 + "px";
    m.classList.add("show");
  });
  $("ctx-show-desktop").addEventListener("click", () => {
    closeAll();
    hideAllWindows();
  });
  $("ctx-taskmgr").addEventListener("click", () => {
    closeAll();
    openWindow("taskmgr-win");
  });

  document.addEventListener("click", function (e) {
    $$(".ctx-menu").forEach((m) => {
      if (!m.contains(e.target)) m.classList.remove("show");
    });
  });
  // submenu overflow
  $$(".menu-item").forEach((item) =>
    item.addEventListener("mouseenter", function () {
      const sub = this.querySelector(".submenu");
      if (sub) {
        const r = this.getBoundingClientRect();
        if (r.right + 200 > innerWidth) {
          sub.style.left = "auto";
          sub.style.right = "100%";
        } else {
          sub.style.left = "100%";
          sub.style.right = "auto";
        }
      }
    }),
  );

  // ===== Start Menu =====
  startBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const wasOpen = startMenu.classList.contains("show");
    closeAll();
    if (!wasOpen) {
      startMenu.classList.add("show");
      startBtn.classList.add("active");
    }
  });
  document.addEventListener("click", function (e) {
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
      startMenu.classList.remove("show");
      startBtn.classList.remove("active");
    }
  });

  // ===== Search Panel =====
  $("search-box").addEventListener("click", function (e) {
    e.stopPropagation();
    const wasOpen = searchPanel.classList.contains("show");
    closeAll();
    if (!wasOpen) {
      searchPanel.classList.add("show");
      setTimeout(() => $("search-input").focus(), 100);
    }
  });
  document.addEventListener("click", function (e) {
    if (
      !searchPanel.contains(e.target) &&
      e.target !== $("search-box") &&
      !$("search-box").contains(e.target)
    )
      searchPanel.classList.remove("show");
  });

  // ===== Desktop Icons =====
  const icons = $$(".desktop-icon");
  icons.forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.stopPropagation();
      icons.forEach((i) => i.classList.remove("selected"));
      this.classList.add("selected");
      closeAll();
    });
    icon.addEventListener("dblclick", function (e) {
      e.stopPropagation();
      openFromIcon(this);
    });
  });
  desktop.addEventListener("click", function (e) {
    if (!e.target.closest(".desktop-icon"))
      icons.forEach((i) => i.classList.remove("selected"));
  });

  function openFromIcon(icon) {
    const w = icon.dataset.open;
    if (w === "explorer") openWindow("explorer-win");
    else if (w === "notepad") openWindow("notepad-win");
    else if (w === "terminal") openWindow("terminal-win");
    else if (w === "taskmgr") openWindow("taskmgr-win");
    else if (w === "settings") openWindow("settings-win");
    else if (w === "edge") openWindow("edge-win");
    else if (w === "controlpanel") openWindow("controlpanel-win");
  }

  // Start menu / Action center / Search result open windows
  $$(
    ".app-item[data-open],.ac-btn[data-open],.settings-sidebar-btn,.search-result[data-open]",
  ).forEach((el) => {
    el.addEventListener("click", function () {
      closeAll();
      const w = this.dataset.open || "settings";
      if (w === "settings") openWindow("settings-win");
      else if (w === "terminal") openWindow("terminal-win");
      else if (w === "taskmgr") openWindow("taskmgr-win");
    });
  });

  // ===== Selection Box =====
  let isSel = false,
    sx,
    sy;
  const selBox = $("selection-box");
  desktop.addEventListener("mousedown", function (e) {
    if (
      e.button !== 0 ||
      e.target.closest(
        ".desktop-icon,.window,#taskbar,.ctx-menu,#start-menu,#search-panel,.tray-popup,#calendar-popup,#action-center,#task-view",
      )
    )
      return;
    isSel = true;
    sx = e.clientX;
    sy = e.clientY;
    selBox.style.left = sx + "px";
    selBox.style.top = sy + "px";
    selBox.style.width = "0";
    selBox.style.height = "0";
    selBox.style.display = "block";
    closeAll();
  });
  document.addEventListener("mousemove", function (e) {
    if (!isSel) return;
    selBox.style.left = Math.min(e.clientX, sx) + "px";
    selBox.style.top = Math.min(e.clientY, sy) + "px";
    selBox.style.width = Math.abs(e.clientX - sx) + "px";
    selBox.style.height = Math.abs(e.clientY - sy) + "px";
  });
  document.addEventListener("mouseup", () => {
    if (isSel) {
      isSel = false;
      selBox.style.display = "none";
    }
  });

  // ===== Window Management =====
  function focusWindow(id) {
    $$(".window").forEach((w) => w.classList.remove("focused"));
    const w = $(id);
    if (w) {
      w.classList.add("focused");
      focusedWin = id;
      Object.keys(wins).forEach((k) => {
        const tb = $(wins[k].tb);
        if (tb) tb.classList.toggle("active-window", k === id);
      });
    }
  }
  function openWindow(id) {
    const w = $(id);
    if (!w) return;
    w.classList.add("show");
    focusWindow(id);
    const info = wins[id];
    if (info) {
      const tb = $(info.tb);
      if (tb) {
        tb.style.display = "";
        tb.classList.add("has-window", "active-window");
      }
    }
    // Focus terminal input when opening terminal
    if (id === "terminal-win") {
      setTimeout(() => {
        const inp = $("terminal-input");
        if (inp) inp.focus();
      }, 100);
    }
  }
  function closeWindow(id) {
    const w = $(id);
    if (!w) return;
    w.classList.remove("show", "maximized");
    const info = wins[id];
    if (info) {
      const tb = $(info.tb);
      if (tb) {
        tb.classList.remove("has-window", "active-window");
        if (id !== "explorer-win" && id !== "edge-win") tb.style.display = "none";
      }
    }
    if (focusedWin === id) focusedWin = null;
    // Reset settings to home when closed
    if (id === "settings-win") {
      $$(".settings-page").forEach((p) => (p.style.display = "none"));
      const home = $("settings-home");
      if (home) home.style.display = "";
      const back = $("settings-back");
      if (back) back.style.display = "none";
    }
  }
  function minimizeWindow(id) {
    const w = $(id);
    if (!w) return;
    w.classList.remove("show");
    const info = wins[id];
    if (info) {
      const tb = $(info.tb);
      if (tb) tb.classList.remove("active-window");
    }
  }
  function hideAllWindows() {
    Object.keys(wins).forEach((k) => {
      const w = $(k);
      if (w && w.classList.contains("show")) {
        w.classList.remove("show");
        const tb = $(wins[k].tb);
        if (tb) tb.classList.remove("active-window");
      }
    });
  }

  // Titlebar buttons
  $$(".minimize-btn").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      minimizeWindow(b.dataset.win);
    }),
  );
  $$(".maximize-btn").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      $(b.dataset.win).classList.toggle("maximized");
    }),
  );
  $$(".close-btn").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      closeWindow(b.dataset.win);
    }),
  );
  $$(
    ".win-titlebar,.settings-titlebar,.terminal-titlebar,.taskmgr-titlebar,.edge-titlebar",
  ).forEach((tb) => {
    tb.addEventListener("dblclick", function (e) {
      if (e.target.closest(".win-btn")) return;
      const w = this.closest(".window");
      if (w) w.classList.toggle("maximized");
    });
  });

  // Taskbar icon click
  $$(".taskbar-icon[data-winid]").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAll();
      const wid = this.dataset.winid,
        w = $(wid);
      if (w.classList.contains("show")) {
        if (focusedWin === wid) minimizeWindow(wid);
        else focusWindow(wid);
      } else {
        w.classList.add("show");
        focusWindow(wid);
        this.classList.add("has-window", "active-window");
      }
    });
  });

  // ===== Window Dragging =====
  let dragWin = null,
    dwX,
    dwY;
  $$(
    ".win-titlebar,.settings-titlebar,.terminal-titlebar,.taskmgr-titlebar,.edge-titlebar",
  ).forEach((tb) => {
    tb.addEventListener("mousedown", function (e) {
      if (e.target.closest(".win-btn")) return;
      const win = this.closest(".window");
      if (!win || win.classList.contains("maximized")) return;
      dragWin = win;
      dwX = e.clientX - win.offsetLeft;
      dwY = e.clientY - win.offsetTop;
      focusWindow(win.id);
      e.preventDefault();
    });
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragWin) return;
    dragWin.style.left = Math.max(0, e.clientX - dwX) + "px";
    dragWin.style.top = Math.max(0, e.clientY - dwY) + "px";
  });
  document.addEventListener("mouseup", () => {
    dragWin = null;
  });

  // ===== Window Resizing =====
  let resizeWin = null,
    resizeDir = "",
    rsX,
    rsY,
    rsR;
  $$(".rh").forEach((h) => {
    h.addEventListener("mousedown", function (e) {
      const win = this.closest(".window");
      if (!win || win.classList.contains("maximized")) return;
      resizeWin = win;
      resizeDir = [...this.classList].find((c) => c !== "rh");
      rsX = e.clientX;
      rsY = e.clientY;
      rsR = {
        left: win.offsetLeft,
        top: win.offsetTop,
        width: win.offsetWidth,
        height: win.offsetHeight,
      };
      focusWindow(win.id);
      e.preventDefault();
      e.stopPropagation();
    });
  });
  document.addEventListener("mousemove", function (e) {
    if (!resizeWin) return;
    const dx = e.clientX - rsX,
      dy = e.clientY - rsY,
      mw = 400,
      mh = 300;
    if (resizeDir.includes("e"))
      resizeWin.style.width = Math.max(mw, rsR.width + dx) + "px";
    if (resizeDir.includes("s"))
      resizeWin.style.height = Math.max(mh, rsR.height + dy) + "px";
    if (resizeDir.includes("w")) {
      const nw = Math.max(mw, rsR.width - dx);
      resizeWin.style.width = nw + "px";
      resizeWin.style.left = rsR.left + rsR.width - nw + "px";
    }
    if (resizeDir.includes("n")) {
      const nh = Math.max(mh, rsR.height - dy);
      resizeWin.style.height = nh + "px";
      resizeWin.style.top = rsR.top + rsR.height - nh + "px";
    }
  });
  document.addEventListener("mouseup", () => {
    resizeWin = null;
  });

  // Focus on click
  $$(".window").forEach((win) =>
    win.addEventListener("mousedown", () => focusWindow(win.id)),
  );

  // File item selection
  $$(".fi").forEach((item) =>
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      $$(".fi").forEach((f) => f.classList.remove("selected"));
      this.classList.add("selected");
    }),
  );

  // ===== Calendar =====
  $("datetime").addEventListener("click", function (e) {
    e.stopPropagation();
    const was = calPopup.classList.contains("show");
    closeAll();
    if (!was) {
      renderCalendar();
      calPopup.classList.add("show");
    }
  });
  function renderCalendar() {
    const n = new Date(),
      y = n.getFullYear(),
      m = n.getMonth(),
      d = n.getDate();
    const months = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];
    const fd = new Date(y, m, 1).getDay(),
      dim = new Date(y, m + 1, 0).getDate(),
      dip = new Date(y, m, 0).getDate();
    let h =
      '<div class="cal-header">' +
      y +
      "年 " +
      months[m] +
      '</div><div class="cal-weekdays"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div><div class="cal-days">';
    for (let i = 0; i < fd; i++)
      h += '<span class="cal-day other">' + (dip - fd + 1 + i) + "</span>";
    for (let i = 1; i <= dim; i++)
      h +=
        '<span class="cal-day' +
        (i === d ? " today" : "") +
        '">' +
        i +
        "</span>";
    const r = 42 - (fd + dim);
    for (let i = 1; i <= r; i++)
      h += '<span class="cal-day other">' + i + "</span>";
    h += "</div>";
    calPopup.innerHTML = h;
  }

  // ===== Volume =====
  $("tray-volume").addEventListener("click", function (e) {
    e.stopPropagation();
    const was = volPopup.classList.contains("show");
    closeAll();
    if (!was) volPopup.classList.add("show");
  });
  $("vol-range").addEventListener("input", function () {
    $("vol-val").textContent = this.value;
  });

  // ===== Network =====
  $("tray-network").addEventListener("click", function (e) {
    e.stopPropagation();
    const was = netPopup.classList.contains("show");
    closeAll();
    if (!was) netPopup.classList.add("show");
  });

  // ===== Action Center =====
  $("notification-btn").addEventListener("click", function (e) {
    e.stopPropagation();
    const was = actionCenter.classList.contains("show");
    closeAll();
    if (!was) actionCenter.classList.add("show");
  });

  document.addEventListener("click", function (e) {
    if (
      !actionCenter.contains(e.target) &&
      !$("notification-btn").contains(e.target)
    )
      actionCenter.classList.remove("show");
    if (!calPopup.contains(e.target) && !$("datetime").contains(e.target))
      calPopup.classList.remove("show");
    if (!volPopup.contains(e.target) && !$("tray-volume").contains(e.target))
      volPopup.classList.remove("show");
    if (!netPopup.contains(e.target) && !$("tray-network").contains(e.target))
      netPopup.classList.remove("show");
  });

  // AC quick action toggle
  $$(".ac-btn").forEach((b) => {
    if (!b.dataset.open)
      b.addEventListener("click", function () {
        this.classList.toggle("active");
      });
  });

  // ===== Show Desktop =====
  $("show-desktop-btn").addEventListener("click", function () {
    closeAll();
    hideAllWindows();
  });

  // ===== Task View =====
  $("task-view-btn").addEventListener("click", function (e) {
    e.stopPropagation();
    closeAll();
    const was = taskView.classList.contains("show");
    if (!was) {
      buildTaskView();
      taskView.classList.add("show");
    }
  });
  function buildTaskView() {
    const c = $("tv-windows");
    c.innerHTML = "";
    Object.keys(wins).forEach((k) => {
      const w = $(k);
      if (!w || !w.classList.contains("show")) return;
      const d = document.createElement("div");
      d.className = "tv-win";
      d.innerHTML =
        '<div style="width:100%;height:100%;background:linear-gradient(135deg,#e8e8e8,#f8f8f8);display:flex;align-items:center;justify-content:center;font-size:14px;color:#666">' +
        wins[k].title +
        '</div><div class="tv-win-title">' +
        wins[k].title +
        "</div>";
      d.addEventListener("click", () => {
        taskView.classList.remove("show");
        focusWindow(k);
      });
      c.appendChild(d);
    });
    if (c.children.length === 0)
      c.innerHTML =
        '<div style="color:rgba(255,255,255,0.3);font-size:16px">没有打开的窗口</div>';
  }
  taskView.addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("show");
  });

  // ===== Language Indicator toggle =====
  $("lang-indicator").addEventListener("click", function (e) {
    e.stopPropagation();
    this.textContent = this.textContent === "中" ? "英" : "中";
  });

  // ===== Taskbar hover preview =====
  let previewTimer = null;
  $$(".taskbar-icon[data-winid]").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      const wid = this.dataset.winid;
      if (!$(wid) || !$(wid).classList.contains("show")) return;
      previewTimer = setTimeout(() => {
        const t = $("tooltip");
        const r = this.getBoundingClientRect();
        t.textContent = wins[wid].title;
        t.style.left = r.left + r.width / 2 + "px";
        t.style.top = r.top - 28 + "px";
        t.style.transform = "translateX(-50%)";
        t.classList.add("show");
      }, 400);
    });
    btn.addEventListener("mouseleave", function () {
      clearTimeout(previewTimer);
      $("tooltip").classList.remove("show");
    });
  });

  // ===== Notepad status bar =====
  const textarea = document.querySelector(".notepad-textarea");
  if (textarea) {
    textarea.addEventListener("input", updateNotepadStatus);
    textarea.addEventListener("click", updateNotepadStatus);
    textarea.addEventListener("keyup", updateNotepadStatus);
    function updateNotepadStatus() {
      const v = textarea.value,
        pos = textarea.selectionStart;
      const lines = v.substr(0, pos).split("\n");
      const line = lines.length,
        col = lines[lines.length - 1].length + 1;
      textarea
        .closest(".window")
        .querySelector(".notepad-statusbar span:first-child").textContent =
        "第 " + line + " 行，第 " + col + " 列";
    }
  }

  // ===== Terminal Input =====
  const termInput = $("terminal-input");
  const termOutput = $("terminal-output");
  if (termInput && termOutput) {
    const termHistory = [];
    let histIdx = -1;
    termInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = this.value.trim();
        termHistory.unshift(cmd);
        histIdx = -1;
        const prompt = '<span class="ps-prompt">PS C:\\Users\\用户&gt;</span> ';
        termOutput.innerHTML += prompt + escHtml(cmd) + "\n";
        if (cmd.toLowerCase() === "cls" || cmd.toLowerCase() === "clear") {
          termOutput.innerHTML = "";
        } else if (
          cmd.toLowerCase() === "date" ||
          cmd.toLowerCase() === "get-date"
        ) {
          termOutput.innerHTML +=
            "\n" + new Date().toLocaleString("zh-CN") + "\n\n";
        } else if (cmd.toLowerCase().startsWith("echo ")) {
          termOutput.innerHTML += "\n" + escHtml(cmd.substring(5)) + "\n\n";
        } else if (cmd.toLowerCase() === "help" || cmd === "?") {
          termOutput.innerHTML +=
            "\n支持的命令: cls, clear, date, Get-Date, echo, help, dir, ls, whoami, hostname, ipconfig, systeminfo\n\n";
        } else if (
          cmd.toLowerCase() === "dir" ||
          cmd.toLowerCase() === "ls" ||
          cmd.toLowerCase() === "get-childitem"
        ) {
          termOutput.innerHTML +=
            "\n    目录: C:\\Users\\用户\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\nd-----        2026/3/31     14:43                Desktop\nd-----        2026/3/31     10:00                Documents\nd-----        2026/3/30     16:10                Downloads\nd-----        2026/3/29     09:00                Music\nd-----        2026/3/28     12:00                Pictures\nd-----        2026/3/27     08:00                Videos\n\n";
        } else if (cmd.toLowerCase() === "whoami") {
          termOutput.innerHTML += "\ndesktop-win10\\用户\n\n";
        } else if (cmd.toLowerCase() === "hostname") {
          termOutput.innerHTML += "\nDESKTOP-WIN10\n\n";
        } else if (cmd.toLowerCase() === "ipconfig") {
          termOutput.innerHTML +=
            "\nWindows IP 配置\n\n以太网适配器 以太网:\n\n   连接特定的 DNS 后缀 . . . . . . . :\n   IPv4 地址 . . . . . . . . . . . . : 192.168.1.100\n   子网掩码  . . . . . . . . . . . . : 255.255.255.0\n   默认网关. . . . . . . . . . . . . : 192.168.1.1\n\n";
        } else if (cmd.toLowerCase() === "systeminfo") {
          termOutput.innerHTML +=
            "\n主机名:           DESKTOP-WIN10\nOS 名称:          Microsoft Windows 10 专业版\nOS 版本:          10.0.19045 暂缺 Build 19045\n系统制造商:        LENOVO\n系统类型:          x64-based PC\n处理器:           Intel(R) Core(TM) i7-10700K CPU @ 3.80GHz\n物理内存总量:      16,384 MB\n可用的物理内存:     6,842 MB\n\n";
        } else if (cmd !== "") {
          termOutput.innerHTML +=
            "\n" +
            escHtml(cmd) +
            ' : 无法将"' +
            escHtml(cmd) +
            '"项识别为 cmdlet、函数、脚本文件或可运行程序的名称。\n\n';
        } else {
          termOutput.innerHTML += "\n";
        }
        this.value = "";
        termOutput.scrollTop = termOutput.scrollHeight;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (histIdx < termHistory.length - 1) {
          histIdx++;
          this.value = termHistory[histIdx];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx > 0) {
          histIdx--;
          this.value = termHistory[histIdx];
        } else {
          histIdx = -1;
          this.value = "";
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        termOutput.innerHTML = "";
      }
    });
    function escHtml(s) {
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  }

  // ===== Task Manager Tabs =====
  $$(".taskmgr-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      $$(".taskmgr-tab").forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      const tabName = this.dataset.tab;
      // Show/hide tab content
      const processes = $("taskmgr-processes");
      const performance = $("taskmgr-performance");
      if (processes)
        processes.style.display = tabName === "processes" ? "" : "none";
      if (performance)
        performance.style.display = tabName === "performance" ? "" : "none";
    });
  });

  // Performance graph bars
  function initPerfGraphs() {
    ["cpu-graph", "mem-graph", "disk-graph", "net-graph"].forEach((id, idx) => {
      const g = $(id);
      if (!g) return;
      const vals = [12, 58, 2, 1];
      for (let i = 0; i < 30; i++) {
        const bar = document.createElement("div");
        bar.className = "perf-graph-bar";
        const base = vals[idx];
        const h = Math.max(2, base + Math.random() * 15 - 7);
        bar.style.left = i * 3.33 + "%";
        bar.style.width = "2.8%";
        bar.style.height = Math.min(100, h) + "%";
        g.appendChild(bar);
      }
    });
  }
  initPerfGraphs();

  // ===== Settings Navigation =====
  const settingsPageMap = {
    system: "settings-page-system",
    devices: "settings-page-generic",
    network: "settings-page-generic",
    personalize: "settings-page-personalize",
    accounts: "settings-page-generic",
    time: "settings-page-generic",
    gaming: "settings-page-generic",
    ease: "settings-page-generic",
    privacy: "settings-page-generic",
    update: "settings-page-update",
  };
  const genericPageTitles = {
    devices: "设备",
    network: "网络和 Internet",
    accounts: "账户",
    time: "时间和语言",
    gaming: "游戏",
    ease: "轻松使用",
    privacy: "隐私",
  };

  function openSettingsPage(page, section) {
    const home = $("settings-home");
    const pages = $$(".settings-page");
    const back = $("settings-back");
    // Hide all
    if (home) home.style.display = "none";
    pages.forEach((p) => (p.style.display = "none"));
    if (back) back.style.display = "";

    const targetId = settingsPageMap[page];
    if (targetId === "settings-page-generic") {
      const gp = $("settings-page-generic");
      if (gp) {
        gp.style.display = "";
        const title = genericPageTitles[page] || page;
        const gt = $("settings-generic-title");
        const gtn = $("settings-generic-title-nav");
        const gd = $("settings-generic-desc");
        if (gt) gt.textContent = title;
        if (gtn) gtn.textContent = title;
        if (gd) gd.textContent = "此页面正在建设中...";
      }
    } else {
      const tp = $(targetId);
      if (tp) tp.style.display = "";
    }

    // If a section is specified (e.g., "about" for system page)
    if (section && targetId === "settings-page-system") {
      const navs = $$(
        "#settings-page-system .settings-nav",
      );
      navs.forEach((n) => n.classList.remove("active"));
      navs.forEach((n) => {
        if (n.dataset.section === section) n.classList.add("active");
      });
      const panels = $$(
        "#settings-page-system .settings-panel",
      );
      panels.forEach((p) => {
        p.classList.toggle("active", p.dataset.panel === section);
      });
    }
  }

  // Settings home cards
  $$(".settings-card").forEach((card) =>
    card.addEventListener("click", function () {
      openSettingsPage(this.dataset.page);
    }),
  );

  // Settings back button
  const settingsBack = $("settings-back");
  if (settingsBack) {
    settingsBack.addEventListener("click", function () {
      $$(".settings-page").forEach((p) => (p.style.display = "none"));
      const home = $("settings-home");
      if (home) home.style.display = "";
      this.style.display = "none";
    });
  }

  // Settings sidebar nav on system page
  $$("#settings-page-system .settings-nav").forEach((nav) =>
    nav.addEventListener("click", function () {
      $$("#settings-page-system .settings-nav").forEach((n) =>
        n.classList.remove("active"),
      );
      this.classList.add("active");
      const sec = this.dataset.section;
      $$("#settings-page-system .settings-panel").forEach((p) => {
        p.classList.toggle("active", p.dataset.panel === sec);
      });
    }),
  );

  // ===== Search tabs =====
  $$(".search-tab").forEach((t) =>
    t.addEventListener("click", function () {
      $$(".search-tab").forEach((x) => x.classList.remove("active"));
      this.classList.add("active");
    }),
  );

  // ===== ESC =====
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAll();
      taskView.classList.remove("show");
    }
    if (e.key === "Meta") {
      e.preventDefault();
      const was = startMenu.classList.contains("show");
      closeAll();
      if (!was) {
        startMenu.classList.add("show");
        startBtn.classList.add("active");
      }
    }
  });

  // ===== Prevent right-click on non-desktop/taskbar =====
  document.addEventListener("contextmenu", function (e) {
    if (!desktop.contains(e.target) && !taskbar.contains(e.target))
      e.preventDefault();
  });

  // Ribbon tab switching
  $$(".win-ribbon-tab").forEach((tab) =>
    tab.addEventListener("click", function () {
      const tabs = this.closest(".win-ribbon-tabs");
      if (!tabs) return;
      tabs
        .querySelectorAll(".win-ribbon-tab")
        .forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    }),
  );
})();
