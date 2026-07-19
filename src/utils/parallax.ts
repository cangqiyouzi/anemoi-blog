/**
 * 共享视差滚动效果
 * 对所有带 data-parallax-speed 属性的元素应用视差效果
 * 自动处理 View Transitions 下的监听器注册/清理
 */
export function initParallax() {
  const parallaxElements = document.querySelectorAll<HTMLElement>('[data-parallax-speed]');
  if (parallaxElements.length === 0) return;

  // prefers-reduced-motion 时禁用视差效果
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0');
      const yPos = scrollY * speed;
      // 使用独立的 translate 属性而非 transform，
      // 避免内联样式整体覆盖 Tailwind 的 scale-110 等 transform 类
      el.style.translate = `0 ${yPos}px`;
    });
  };

  const KEY = '__anemoi_parallax';

  // 避免 View Transitions 下重复注册
  if ((window as any)[KEY]) {
    window.removeEventListener('scroll', (window as any)[KEY]);
  }
  (window as any)[KEY] = handleScroll;

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 离开页面时清理
  const cleanup = () => {
    window.removeEventListener('scroll', handleScroll);
    delete (window as any)[KEY];
  };
  document.addEventListener('astro:before-swap', cleanup, { once: true });
}

// 打包后的模块脚本在整个会话中只会执行一次，
// 挂到 astro:page-load 上，保证 View Transitions 软导航后对新 DOM 重新初始化
document.addEventListener('astro:page-load', initParallax);
