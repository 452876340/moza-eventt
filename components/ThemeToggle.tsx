import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// 检测系统主题偏好
function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: "dark" | "light") {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  localStorage.setItem("theme", theme);
}

// 判断是否为移动端或低性能设备，适当降低动画时长
function getAnimDuration(): number {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const lowCpu = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4;
  if (isMobile || lowCpu) return 300;
  return 450;
}

const ThemeToggle: React.FC<{ size?: "sm" | "md" }> = ({ size = "md" }) => {
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);

  // 初始化时同步 class
  useEffect(() => {
    applyTheme(theme);
  }, []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // 用户偏好减少动画 / 不支持 View Transition → 直接切换
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme(nextTheme);
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const maxR = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const clipStart = `circle(0px at ${x}px ${y}px)`;
    const clipEnd = `circle(${maxR}px at ${x}px ${y}px)`;
    const duration = getAnimDuration();

    const transition = document.startViewTransition(() => {
      applyTheme(nextTheme);
      setTheme(nextTheme);
    });

    // WAAPI 驱动，避免 CSS @keyframes 初始帧撕裂和圆角异常
    transition.ready.then(() => {
      document.documentElement.animate(
        [{ clipPath: clipStart }, { clipPath: clipEnd }],
        {
          duration,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
      className={`flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary hover:text-foreground ${size === "sm" ? "h-8 w-8" : "h-9 w-9"}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
};

export default ThemeToggle;
