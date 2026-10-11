// export function initSlidePanel(panelId) {
//     const panel = document.getElementById(panelId);
//     const handle = panel?.querySelector(".handle-bar");

//     if (!panel || !handle) {
//         console.warn(`Panel or handle not found for ID: ${panelId}`);
//         return;
//     }

//     let expanded = false;

//     handle.addEventListener("click", () => {
//         expanded = !expanded;
//         panel.classList.toggle("expanded", expanded);
//     });
// }

export function initSlidePanel(panelId) {
    const infoPanel = document.getElementById(panelId);
    if (!infoPanel) {
        console.warn(`Panel with ID '${panelId}' not found.`);
        return;
    }

    const handle = infoPanel.querySelector(".handle-bar");

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let expanded = false;

    // 切换展开状态
    function togglePanel(forceState) {
        if (typeof forceState === "boolean") {
            expanded = forceState;
        } else {
            expanded = !expanded;
        }
        infoPanel.classList.toggle("expanded", expanded);
    }

    // 点击 handle 仍保留
    if (handle) {
        handle.addEventListener("click", () => {
            togglePanel();
        });
    }

    // ✅ 滑动手势绑定到整个 infoPanel
    infoPanel.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
    });

    infoPanel.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
    });

    infoPanel.addEventListener("touchend", () => {
        if (!isDragging) return;
        const deltaY = currentY - startY;
        if (deltaY > 30) {
            togglePanel(false); // 向下滑动关闭
        } else if (deltaY < -30) {
            togglePanel(true); // 向上滑动展开
        }
        isDragging = false;
    });

    // ✅ 点击面板外区域关闭
    document.addEventListener("click", (e) => {
        const clickedInside = infoPanel.contains(e.target);
        if (!clickedInside && expanded) {
            togglePanel(false);
        }
    });
}
