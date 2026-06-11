import { setAppHeight } from './ui/views.js';
import { initLogin }     from './ui/login.js';
import { initDashboard } from './ui/dashboard.js';
import { initTest }      from './ui/test.js';
import { initReview }    from './ui/review.js';

window.addEventListener('resize', setAppHeight);
setAppHeight();

document.addEventListener('touchmove', e => {
  if (!e.target.closest('.ios-scroll')) e.preventDefault();
}, { passive: false });

initLogin();
initDashboard();
initTest();
initReview();
