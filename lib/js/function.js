document.addEventListener("DOMContentLoaded", () => {
  function initScreensaver() {
    const ss = document.getElementById('screensaver');
    const video = document.getElementById('screensaver-video');
    if (!ss || !video) return;

    const IDLE_MS = 15000;
    let timer;
    let loaded = false;

    function show() {
      if (!loaded) { video.load(); loaded = true; }
      video.play().catch(() => {});
      ss.classList.add('active');
    }

    function hide() {
      ss.classList.remove('active');
      setTimeout(() => { video.pause(); video.currentTime = 0; }, 1200);
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(show, IDLE_MS);
    }

    ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'].forEach(evt => {
      document.addEventListener(evt, () => {
        if (ss.classList.contains('active')) hide();
        else schedule();
      }, { passive: true });
    });

    window.addEventListener('load', schedule);
  }

  initScreensaver();
});
