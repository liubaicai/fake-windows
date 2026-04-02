(async function () {
  const cacheBuster = `v=${Date.now()}`;
  const slots = document.querySelectorAll("[data-component]");
  await Promise.all(
    Array.from(slots).map(async (slot) => {
      const url = slot.dataset.component;
      try {
        const resolvedUrl = `${url}${url.includes("?") ? "&" : "?"}${cacheBuster}`;
        const response = await fetch(resolvedUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(String(response.status));
        }
        slot.outerHTML = await response.text();
      } catch (error) {
        console.error("[component-loader] 加载失败:", url, error);
      }
    }),
  );

  const script = document.createElement("script");
  script.src = `script.js?${cacheBuster}`;
  document.body.appendChild(script);
})();