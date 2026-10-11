document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.querySelector("gmp-map");
    const markers = mapElement.querySelectorAll("gmp-advanced-marker");
    const bottomPanel = document.getElementById("bottom-panel");
    const closeButton = bottomPanel.querySelector(".close-button");
    const panelTitle = bottomPanel.querySelector("h2");
    const panelContent = bottomPanel.querySelector(".panel-content");

    // 添加标签元素
    markers.forEach((marker) => {
        const title = marker.getAttribute("title");
        const label = document.createElement("div");
        label.className = "marker-label";
        label.textContent = title;
        marker.appendChild(label);
    });

    // 监听缩放级别变化
    mapElement.addEventListener("zoom_changed", () => {
        const zoom = mapElement.zoom;
        markers.forEach((marker) => {
            const label = marker.querySelector(".marker-label");
            if (zoom >= 12) {
                label.style.display = "block";
            } else {
                label.style.display = "none";
            }
        });
    });

    // 添加点击事件
    markers.forEach((marker) => {
        marker.addEventListener("gmp-click", () => {
            // 重置所有标记的图标大小
            markers.forEach((m) => {
                const icon = m.querySelector(".icon-img");
                if (icon) {
                    icon.classList.remove("enlarged");
                }
            });

            // 放大当前标记的图标
            const icon = marker.querySelector(".icon-img");
            if (icon) {
                icon.classList.add("enlarged");
            }

            // 显示底部面板
            const title = marker.getAttribute("title");
            const info = marker.getAttribute("data-info");

            panelTitle.textContent = title;
            panelContent.textContent = info;
            bottomPanel.classList.add("visible");
        });
    });

    // 关闭底部面板
    closeButton.addEventListener("click", () => {
        bottomPanel.classList.remove("visible");
        // 重置所有标记的图标大小
        markers.forEach((m) => {
            const icon = m.querySelector(".icon-img");
            if (icon) {
                icon.classList.remove("enlarged");
            }
        });
    });
});
