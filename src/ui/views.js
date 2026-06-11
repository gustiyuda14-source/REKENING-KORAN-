const viewEls = () => ({
  login:     document.getElementById('login-section'),
  dashboard: document.getElementById('dashboard-section'),
  test:      document.getElementById('test-section'),
  review:    document.getElementById('review-section')
});

export function switchView(name) {
  const views = viewEls();
  Object.values(views).forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('flex');
  });
  views[name].classList.remove('hidden');
  views[name].classList.add('flex');
  requestAnimationFrame(setAppHeight);
}

export function setAppHeight() {
  const h = window.innerHeight;
  document.body.style.height = h + 'px';
  document.documentElement.style.setProperty('--app-h', h + 'px');
  const vp = document.getElementById('test-viewport');
  if (vp) {
    const half = Math.round(vp.clientHeight / 2);
    document.documentElement.style.setProperty('--vp-half', half + 'px');
  }
}
