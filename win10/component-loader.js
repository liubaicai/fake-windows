/**
 * 组件加载器 — 将 [data-component] 占位符替换为对应 HTML 片段，
 * 全部加载完成后再初始化 script.js 中的逻辑。
 */
(async function () {
  const slots = document.querySelectorAll("[data-component]");
  await Promise.all(
    Array.from(slots).map(async (slot) => {
      const url = slot.dataset.component;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        const html = await res.text();
        // 用片段内容替换占位 div（outerHTML 去掉包裹层）
        slot.outerHTML = html;
      } catch (e) {
        console.error("[component-loader] 加载失败:", url, e);
      }
    }),
  );

  // 所有组件就绪后，动态加载主逻辑脚本
  const s = document.createElement("script");
  s.src = "script.js";
  document.body.appendChild(s);
})();
