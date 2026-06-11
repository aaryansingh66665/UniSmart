import db from './data.js';

// Router & Layout Orchestrator
const app = document.getElementById('app');

const routes = {
  '/': { view: 'landing', title: 'UniSmart AI - Home' },
  '/pricing': { view: 'pricing', title: 'Pricing Plans | UniSmart AI' },
  '/login-admin': { view: 'login-admin', title: 'Admin Login | UniSmart AI' },
  '/login-faculty': { view: 'login-faculty', title: 'Faculty Login | UniSmart AI' },
  '/admin/dashboard': { view: 'admin-dashboard', title: 'Admin Dashboard | UniSmart AI', role: 'admin' },
  '/admin/faculty': { view: 'faculty-management', title: 'Faculty Management | UniSmart AI', role: 'admin' },
  '/admin/students': { view: 'student-upload', title: 'Student Management | UniSmart AI', role: 'admin' },
  '/admin/attendance': { view: 'attendance-calendar', title: 'Attendance Tracker | UniSmart AI', role: 'admin' },
  '/admin/analytics': { view: 'analytics', title: 'Analytics Center | UniSmart AI', role: 'admin' },
  '/admin/ai-risk': { view: 'ai-risk-center', title: 'AI Risk Forecast | UniSmart AI', role: 'admin' },
  '/admin/reports': { view: 'reports', title: 'Reports Center | UniSmart AI', role: 'admin' },
  '/admin/settings': { view: 'settings', title: 'Settings | UniSmart AI', role: 'admin' },
  '/admin/lms-flow': { view: 'lms-flow', title: 'LMS System Flow | UniSmart AI', role: 'admin' },
  '/faculty/dashboard': { view: 'faculty-dashboard', title: 'Faculty Dashboard | UniSmart AI', role: 'faculty' },
  '/faculty/attendance': { view: 'attendance-calendar', title: 'Mark Attendance | UniSmart AI', role: 'faculty' },
  '/faculty/analytics': { view: 'analytics', title: 'Analytics | UniSmart AI', role: 'faculty' },
  '/faculty/ai-risk': { view: 'ai-risk-center', title: 'AI Risk Insights | UniSmart AI', role: 'faculty' },
  '/faculty/reports': { view: 'reports', title: 'Faculty Reports | UniSmart AI', role: 'faculty' },
  '/faculty/settings': { view: 'settings', title: 'Faculty Settings | UniSmart AI', role: 'faculty' },
  '/faculty/lms-flow': { view: 'lms-flow', title: 'LMS System Flow | UniSmart AI', role: 'faculty' }
};

// Apply theme settings
function applyTheme() {
  const settings = db.getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme || 'sky-blue');
}

window.addEventListener('unismart_settings_changed', applyTheme);
applyTheme();

// Get active session
function getSession() {
  const user = sessionStorage.getItem('unismart_user');
  return user ? JSON.parse(user) : null;
}

// Set active session
function setSession(role, name) {
  sessionStorage.setItem('unismart_user', JSON.stringify({ role, name }));
}

// Clear session
function clearSession() {
  sessionStorage.removeItem('unismart_user');
}

// Router main function
async function router() {
  let path = window.location.hash.slice(1) || '/';
  
  // Route matching
  let route = routes[path];
  if (!route) {
    // Fallback to landing
    path = '/';
    route = routes['/'];
    window.location.hash = '#/';
  }

  // Auth checking
  const session = getSession();
  if (route.role && (!session || session.role !== route.role)) {
    // Unauthorized: redirect to appropriate login
    if (route.role === 'admin') {
      window.location.hash = '#/login-admin';
      return;
    } else {
      window.location.hash = '#/login-faculty';
      return;
    }
  }

  document.title = route.title;

  try {
    const response = await fetch(`/views/${route.view}.html`);
    if (!response.ok) throw new Error(`Failed to load template: ${route.view}`);
    const htmlContent = await response.text();

    if (route.role) {
      // Authenticated Dashboard Layout
      renderDashboardShell(route.role, path, htmlContent, route.view);
    } else {
      // Guest Layout
      app.innerHTML = htmlContent;
      initGuestControllers(route.view);
    }
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <div class="flex items-center justify-center min-h-screen bg-background text-error">
        <div class="glass-card p-xl rounded-2xl max-w-md text-center">
          <span class="material-symbols-outlined text-5xl mb-md">error</span>
          <h2 class="text-headline-md font-bold mb-sm">Template Loading Error</h2>
          <p class="text-on-surface-variant mb-lg">${error.message}</p>
          <a href="#/" class="px-lg py-sm bg-primary text-white rounded-xl inline-block font-bold">Go to Safety</a>
        </div>
      </div>
    `;
  }
}

// Render Dashboard Shell (Aside, Header, Content)
function renderDashboardShell(role, path, contentHtml, viewName) {
  const session = getSession() || { role: 'Guest', name: 'User' };
  const settings = db.getSettings();
  
  const isAdmin = role === 'admin';
  const prefix = isAdmin ? '/admin' : '/faculty';

  // Extract avatar based on role
  const avatarUrl = isAdmin 
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBW_dSiSM_T_3Ve1Pubn0F-Z2QgbVVw_qhRcObFU0cSbkGVs0E0hIwkaW_LaXo0KSciGMrPR5Re70SQ6K5cdekKLwh2nkbVqBfJ0qk6W7u0wbvwsfZ-_F9mSGI2P7EgFdxzCgrvu7VlvjYD4z-1TdxPqMm9-w1f1xP3YBrI0_W5x9g8B4dEz0cDOMI5P019_ac7V0mpgHesxpdAdVkdO0V48kfw-iBVpKH2l3l6cwLLZLjcQj25-OaJUaJYsR7FmciTQTnhKLlnW3p8"
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuBeDOTNbhrINgTbRQZU25Q9x-ihoHnBFRMA18ceexHV-RJcm6IceAftgH-SQIZhURsVm1fbW-YQCpD2cnN48sfLod7Ht_zP-YoLDHG3PnpkW-WS6k5p5OGlRDNr4PnY1CTEqsCgvN5-iF1DmT2xwOeCVHFY8DeQbZ1SHtE80hEgphMioZhRrS78elYwERHGjR5CjEoVhFll7wl-CW59Mq4EvRsHVjfVy2qYgvCRvpVadSyIiY_hDO-C50zAGz0IKF59qb9q5t7vKCoj";

  const sideMenu = [
    { label: 'Overview', icon: 'dashboard', href: `${prefix}/dashboard` },
    isAdmin ? { label: 'Faculty', icon: 'school', href: `/admin/faculty` } : null,
    isAdmin ? { label: 'Students', icon: 'group', href: `/admin/students` } : null,
    { label: 'Attendance', icon: 'calendar_today', href: `${prefix}/attendance` },
    { label: 'Analytics', icon: 'insights', href: `${prefix}/analytics` },
    { label: 'AI Risk Center', icon: 'security', href: `${prefix}/ai-risk` },
    { label: 'Reports', icon: 'description', href: `${prefix}/reports` },
    { label: 'Settings', icon: 'settings', href: `${prefix}/settings` },
    { label: 'LMS Flow', icon: 'sync_alt', href: `${prefix}/lms-flow` }
  ].filter(Boolean);

  const activeIndex = sideMenu.findIndex(item => item.href === path);

  const sidebarHtml = `
    <aside class="fixed left-0 top-0 h-full w-[280px] bg-white/80 dark:bg-inverse-surface/80 sidebar-blur border-r border-outline-variant z-50 flex flex-col py-lg shadow-sm">
      <div class="px-lg mb-xl">
        <h1 class="font-headline-lg text-headline-lg font-bold text-primary">${settings.institutionName ? settings.institutionName.split(' ')[0] : 'UniSmart'} AI</h1>
        <p class="font-label-md text-label-md text-on-surface-variant">Enterprise LMS</p>
      </div>
      <nav class="flex-1 flex flex-col gap-1 overflow-y-auto px-md custom-scrollbar">
        ${sideMenu.map((item, idx) => `
          <a class="${idx === activeIndex ? 'sidebar-item-active' : 'text-on-surface-variant hover:bg-surface-container'} flex items-center gap-3 px-4 py-3 rounded-lg transition-all" href="#${item.href}">
            <span class="material-symbols-outlined" style="${idx === activeIndex ? "font-variation-settings: 'FILL' 1;" : ''}">${item.icon}</span>
            <span class="font-label-md text-label-md">${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="mt-auto px-lg">
        <div id="logout-btn" class="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-high hover:text-error transition-colors cursor-pointer border border-transparent hover:border-outline-variant">
          <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
            <img alt="${session.name}" class="w-full h-full object-cover" src="${avatarUrl}"/>
          </div>
          <div>
            <p class="font-label-md text-label-md font-bold text-on-surface">${session.name}</p>
            <p class="font-label-sm text-label-sm text-on-surface-variant">${isAdmin ? 'Administrator' : 'Faculty Member'}</p>
          </div>
          <span class="material-symbols-outlined ml-auto text-lg">logout</span>
        </div>
      </div>
    </aside>
  `;

  const headerHtml = `
    <header class="flex justify-between items-center h-16 px-lg sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div class="flex items-center flex-1 max-w-xl">
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input id="global-search" class="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg font-body-sm text-body-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Search insights, students, or modules..." type="text"/>
        </div>
      </div>
      <div class="flex items-center gap-md">
        <button id="alert-trigger" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant relative">
          <span class="material-symbols-outlined">notifications</span>
          <span class="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
        </button>
        <a href="#${prefix}/settings" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <span class="material-symbols-outlined">settings</span>
        </a>
        <button id="header-action-btn" class="bg-primary text-on-primary px-lg py-xs rounded-lg font-label-md text-label-md flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span class="material-symbols-outlined text-[18px]">add</span>
          New Report
        </button>
      </div>
    </header>
  `;

  // Wrap staging content in main container
  app.innerHTML = `
    <div class="min-h-screen bg-background">
      ${sidebarHtml}
      <main class="ml-[280px] min-h-screen flex flex-col">
        ${headerHtml}
        <div id="content-stage" class="p-lg max-w-container-max mx-auto w-full flex-1 view-enter">
          ${contentHtml}
        </div>
        <footer class="mt-auto border-t border-outline-variant bg-white/50 w-full py-md px-lg">
          <div class="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-sm">
            <div class="flex items-center gap-4">
              <span class="font-label-md text-label-md font-bold text-primary">${settings.institutionName || 'UniSmart AI'}</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">© 2024. All rights reserved.</span>
            </div>
            <div class="flex gap-lg">
              <a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
              <a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a>
            </div>
          </div>
        </footer>
      </main>
      
      <!-- Alert Feed Popup Modal -->
      <div id="alert-feed-modal" class="hidden fixed right-20 top-16 w-96 bg-white border border-outline-variant rounded-2xl shadow-xl z-[100] overflow-hidden">
        <div class="px-md py-sm bg-surface-container border-b border-outline-variant flex justify-between items-center">
          <h4 class="font-label-md font-bold">AI Insights & Notifications</h4>
          <span class="material-symbols-outlined text-primary text-md">auto_awesome</span>
        </div>
        <div id="modal-alerts-container" class="divide-y divide-outline-variant max-h-96 overflow-y-auto">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
  `;

  // Trigger smooth fade-in transition
  const stage = document.getElementById('content-stage');
  setTimeout(() => {
    stage.classList.remove('view-enter');
    stage.classList.add('view-enter-active');
  }, 10);

  // Wire up shell events
  document.getElementById('logout-btn').addEventListener('click', () => {
    clearSession();
    showToast("Logged out successfully");
    window.location.hash = '#/';
  });

  // Alert triggers
  const alertTrigger = document.getElementById('alert-trigger');
  const alertModal = document.getElementById('alert-feed-modal');
  alertTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    alertModal.classList.toggle('hidden');
    renderModalAlerts();
  });
  
  document.addEventListener('click', () => {
    alertModal.classList.add('hidden');
  });

  alertModal.addEventListener('click', (e) => e.stopPropagation());

  // Header quick action button
  document.getElementById('header-action-btn').addEventListener('click', () => {
    window.location.hash = `#${prefix}/reports`;
  });

  // Init page-specific scripts
  initAuthControllers(viewName);
}

// Render Alerts inside dropdown modal
function renderModalAlerts() {
  const container = document.getElementById('modal-alerts-container');
  const alerts = db.getAlerts();
  
  if (alerts.length === 0) {
    container.innerHTML = `<div class="p-md text-center text-on-surface-variant italic">No pending alerts</div>`;
    return;
  }

  container.innerHTML = alerts.map(alt => `
    <div class="p-md hover:bg-surface-container-low transition-colors flex gap-sm items-start relative group">
      <div class="w-8 h-8 rounded-full ${alt.priority === 'critical' ? 'bg-error/10 text-error' : alt.priority === 'normal' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'} flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined text-sm">${alt.priority === 'critical' ? 'priority_high' : alt.priority === 'normal' ? 'workspace_premium' : 'sync'}</span>
      </div>
      <div class="flex-1">
        <p class="font-label-sm text-label-sm font-bold text-on-surface mb-0.5">${alt.title}</p>
        <p class="text-xs text-on-surface-variant leading-relaxed mb-1">${alt.message}</p>
        <span class="text-[10px] text-outline">${alt.time}</span>
      </div>
      <button class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity text-outline" onclick="window.unismart_resolve_alert('${alt.id}')">
        <span class="material-symbols-outlined text-md">done</span>
      </button>
    </div>
  `).join('');
}

// Global resolve alert helper
window.unismart_resolve_alert = (id) => {
  db.resolveAlert(id);
  renderModalAlerts();
  showToast("Alert resolved successfully");
};

// Initializers for non-authenticated pages
function initGuestControllers(viewName) {
  if (viewName === 'landing') {
    // Landing Page Action Triggers
    const ctas = document.querySelectorAll('button');
    ctas.forEach(cta => {
      cta.addEventListener('click', (e) => {
        const text = e.target.textContent.trim().toLowerCase();
        if (text.includes('faculty login')) {
          window.location.hash = '#/login-faculty';
        } else if (text.includes('get started') || text.includes('demo')) {
          window.location.hash = '#/login-admin';
        } else if (text.includes('pricing')) {
          window.location.hash = '#/pricing';
        }
      });
    });
  } 
  else if (viewName === 'pricing') {
    setupPricingPage();
  }
  else if (viewName === 'login-admin' || viewName === 'login-faculty') {
    const isAdmin = viewName === 'login-admin';
    const form = document.querySelector('form');
    const primaryBtn = form.querySelector('button[type="submit"]') || form.querySelector('button.bg-primary');
    const emailInput = document.getElementById('email') || document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('password') || document.querySelector('input[type="password"]');
    
    // OTP fields simulate keypress progression
    const otpInputs = document.querySelectorAll('input[maxlength="1"]');
    if (otpInputs.length > 0) {
      otpInputs.forEach((input, idx) => {
        input.addEventListener('input', (e) => {
          if (e.target.value.length === 1 && otpInputs[idx + 1]) {
            otpInputs[idx + 1].focus();
          }
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !e.target.value && otpInputs[idx - 1]) {
            otpInputs[idx - 1].focus();
          }
        });
      });
    }

    let mockOTP = null;

    if (primaryBtn) {
      primaryBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!email) {
          showToast("Please enter your official university email");
          return;
        }

        // 1. Send OTP Flow
        if (primaryBtn.textContent.includes('Send') || primaryBtn.textContent.includes('Get Code')) {
          primaryBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Sending OTP...`;
          
          const settings = db.getSettings();

          try {
            // Attempt backend API call
            const res = await fetch('/api/send-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                smtpConfig: {
                  host: settings.smtpHost,
                  port: settings.smtpPort,
                  user: settings.smtpUser,
                  pass: settings.smtpPass
                }
              })
            });

            const data = await res.json();
            if (data.success) {
              showToast("OTP code sent to your Gmail inbox!");
              primaryBtn.innerHTML = `Verify & Login <span class="material-symbols-outlined text-[18px]">login</span>`;
              
              // Show OTP entry
              const otpSection = document.getElementById('otp-section');
              if (otpSection) {
                otpSection.classList.remove('hidden', 'opacity-0');
              }
            } else {
              throw new Error(data.error || 'Failed to send OTP');
            }
          } catch (err) {
            console.warn("Backend SMTP offline or misconfigured, falling back to simulated OTP.", err);
            
            // Generate simulated OTP
            mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`[DEV SIMULATION] OTP for ${email}: ${mockOTP}`);
            
            setTimeout(() => {
              primaryBtn.innerHTML = `Verify & Login <span class="material-symbols-outlined text-[18px]">login</span>`;
              showToast(`SMTP Server Offline. Simulated OTP is: ${mockOTP} (Printed to console)`);
              
              // Show OTP entry
              const otpSection = document.getElementById('otp-section');
              if (otpSection) {
                otpSection.classList.remove('hidden', 'opacity-0');
              }
            }, 1000);
          }
        } 
        // 2. Verify OTP Flow
        else {
          primaryBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Verifying...`;
          
          // Compile 6 digit code
          let code = '';
          otpInputs.forEach(input => code += input.value.trim());

          if (code.length < 6) {
            showToast("Please enter the full 6-digit OTP code");
            primaryBtn.innerHTML = `Verify & Login <span class="material-symbols-outlined text-[18px]">login</span>`;
            return;
          }

          // Verify if mockOTP fallback is active
          if (mockOTP !== null) {
            setTimeout(() => {
              if (code === mockOTP) {
                loginRedirect(isAdmin, email);
              } else {
                showToast("Invalid verification code. Please try again.");
                primaryBtn.innerHTML = `Verify & Login <span class="material-symbols-outlined text-[18px]">login</span>`;
              }
            }, 800);
            return;
          }

          try {
            // Verify via backend API
            const res = await fetch('/api/verify-otp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, otp: code })
            });

            const data = await res.json();
            if (data.success) {
              loginRedirect(isAdmin, email);
            } else {
              throw new Error(data.error || 'Invalid OTP');
            }
          } catch (err) {
            console.error(err);
            showToast(`Verification failed: ${err.message}`);
            primaryBtn.innerHTML = `Verify & Login <span class="material-symbols-outlined text-[18px]">login</span>`;
          }
        }
      });
    }
  }

  // Inject testing bypass menu at bottom-right on guest views
  if (viewName === 'landing' || viewName === 'login-admin' || viewName === 'login-faculty' || viewName === 'pricing') {
    if (!document.getElementById('dev-bypass-pill')) {
      const pill = document.createElement('div');
      pill.id = 'dev-bypass-pill';
      pill.className = 'fixed bottom-4 right-4 z-50 bg-zinc-900 text-white p-3 rounded-2xl shadow-xl flex flex-col gap-2 border border-white/10 text-xs font-bold max-w-xs transition-all opacity-80 hover:opacity-100';
      pill.innerHTML = `
        <div class="flex items-center justify-between gap-xl">
          <span class="text-[10px] text-zinc-400 uppercase tracking-wider">Dev Bypass Access</span>
          <span class="material-symbols-outlined text-sm cursor-pointer hover:text-red-500" onclick="document.getElementById('dev-bypass-pill').remove()">close</span>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors" onclick="window.unismart_dev_login('admin')">Bypass Admin</button>
          <button class="px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors" onclick="window.unismart_dev_login('faculty')">Bypass Faculty</button>
        </div>
      `;
      document.body.appendChild(pill);
      
      window.unismart_dev_login = (role) => {
        if (role === 'admin') {
          sessionStorage.setItem('unismart_user', JSON.stringify({ role: 'admin', name: 'Alex Thompson' }));
          window.location.hash = '#/admin/dashboard';
        } else {
          sessionStorage.setItem('unismart_user', JSON.stringify({ role: 'faculty', name: 'Dr. Elena Rodriguez' }));
          window.location.hash = '#/faculty/dashboard';
        }
        showToast("Logged in via Dev Bypass");
        pill.remove();
      };
    }
  } else {
    const pill = document.getElementById('dev-bypass-pill');
    if (pill) pill.remove();
  }
}

function setupPricingPage() {
  const trialBtn = document.getElementById('buy-trial-btn');
  const trialModal = document.getElementById('trial-modal');
  const closeTrialBtn = document.getElementById('close-trial-btn');
  const trialForm = document.getElementById('trial-form');

  const contactBtn = document.getElementById('contact-sales-btn');
  const contactModal = document.getElementById('enterprise-modal');
  const closeContactBtn = document.getElementById('close-contact-btn');
  const contactForm = document.getElementById('enterprise-form');

  if (trialBtn && trialModal) {
    trialBtn.addEventListener('click', () => {
      trialModal.classList.remove('hidden');
      trialModal.classList.add('flex');
    });
  }

  if (closeTrialBtn && trialModal) {
    closeTrialBtn.addEventListener('click', () => {
      trialModal.classList.add('hidden');
      trialModal.classList.remove('flex');
    });
  }

  if (trialForm) {
    trialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = trialForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> Processing...`;

      setTimeout(() => {
        trialModal.classList.add('hidden');
        trialModal.classList.remove('flex');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        trialForm.reset();
        
        alert("Success! Your 2-Day Trial has been activated. A mock transaction receipt was sent to your email.");
        showToast("Trial Plan Activated Successfully!");
        window.location.hash = '#/login-admin';
      }, 1500);
    });
  }

  if (contactBtn && contactModal) {
    contactBtn.addEventListener('click', () => {
      contactModal.classList.remove('hidden');
      contactModal.classList.add('flex');
    });
  }

  if (closeContactBtn && contactModal) {
    closeContactBtn.addEventListener('click', () => {
      contactModal.classList.add('hidden');
      contactModal.classList.remove('flex');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-md">sync</span> Sending...`;

      setTimeout(() => {
        contactModal.classList.add('hidden');
        contactModal.classList.remove('flex');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        alert("Thank you! Your inquiry has been received. Our Enterprise Sales Team will reach out to you within 24 hours.");
        showToast("Inquiry Sent Successfully!");
      }, 1500);
    });
  }
}

// Redirect and session setup helper
function loginRedirect(isAdmin, email) {
  if (isAdmin) {
    setSession('admin', 'Alex Thompson');
    window.location.hash = '#/admin/dashboard';
  } else {
    // Find faculty in database list or use default Rodriguez name
    const faculty = db.getFaculty() || [];
    const found = faculty.find(f => f.email.toLowerCase() === email.toLowerCase());
    const name = found ? found.name : 'Dr. Elena Rodriguez';
    setSession('faculty', name);
    window.location.hash = '#/faculty/dashboard';
  }
  showToast("Successfully logged in!");
}

// Initializers for authenticated pages
function initAuthControllers(viewName) {
  switch (viewName) {
    case 'admin-dashboard':
      setupAdminDashboard();
      break;

    case 'faculty-dashboard':
      // Setup attendance roster click handlers
      const rosterList = document.querySelector('.space-y-md');
      break;

    case 'faculty-management':
      renderFacultyTable();
      setupFacultyForm();
      break;

    case 'student-upload':
      setupStudentUploadDropzone();
      break;

    case 'attendance-calendar':
      renderAttendanceRoster();
      break;

    case 'ai-risk-center':
      setupAIRiskPage();
      break;

    case 'reports':
      renderReportsTable();
      setupReportsGenerator();
      break;

    case 'settings':
      setupSettingsPage();
      break;

    case 'analytics':
      setupAnalyticsPage();
      break;
  }
}

// PAGE INITIALIZERS

// 1. Faculty Management Table & Add Form
function renderFacultyTable(filterQuery = "") {
  const tableBody = document.querySelector('table tbody');
  if (!tableBody) return;

  const faculty = db.getFaculty();
  const filtered = faculty.filter(f => 
    f.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    f.department.toLowerCase().includes(filterQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(filterQuery.toLowerCase())
  );

  tableBody.innerHTML = filtered.map(f => {
    const score = f.score !== undefined ? f.score : 85;
    const isLow = score < 75;
    return `
      <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
        <td class="px-6 py-4 flex items-center gap-3">
          <img class="w-8 h-8 rounded-full object-cover border border-outline-variant" src="${f.avatar}" alt="${f.name}"/>
          <div>
            <p class="font-label-md text-label-md font-bold text-on-surface">${f.name}</p>
            <p class="text-[10px] text-outline">${f.id}</p>
          </div>
        </td>
        <td class="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">${f.department}</td>
        <td class="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">${f.courses}</td>
        <td class="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">${f.email}</td>
        <td class="px-6 py-4 font-body-sm text-body-sm">
          <span class="${isLow ? 'text-error font-bold bg-error/10 px-2 py-0.5 rounded-full' : 'text-on-surface-variant font-medium'}">
            ${score}%
          </span>
        </td>
        <td class="px-6 py-4 font-body-sm text-body-sm text-right">
          <button class="text-error hover:text-red-700 transition-colors p-1" onclick="window.unismart_delete_faculty('${f.id}')">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.unismart_delete_faculty = (id) => {
  if (confirm("Are you sure you want to remove this faculty member?")) {
    db.deleteFaculty(id);
    renderFacultyTable();
    showToast("Faculty member removed");
  }
};

function setupFacultyForm() {
  const form = document.querySelector('form');
  const searchInput = document.querySelector('input[placeholder="Search faculty deans or teachers..."]');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderFacultyTable(e.target.value);
    });
  }

  const addBtn = document.querySelector('button.bg-primary');
  // Dynamic modal injection for adding faculty
  if (addBtn && !addBtn.getAttribute('data-listener-added')) {
    addBtn.setAttribute('data-listener-added', 'true');
    addBtn.addEventListener('click', () => {
      // Prompt modal
      const name = prompt("Enter Faculty Name:");
      if (!name) return;
      const email = prompt("Enter Faculty Email:");
      if (!email) return;
      const dept = prompt("Enter Department (Computer Science, Business Analytics, Fine Arts, Life Sciences):", "Computer Science");
      if (!dept) return;
      const courses = prompt("Enter Assigned Courses (e.g. Algorithms, Compilation):");
      const scoreStr = prompt("Enter Performance Score (0-100):", "85");
      const score = parseInt(scoreStr) || 85;
      
      const newFac = {
        id: "FAC" + (Date.now().toString().slice(-6)),
        name,
        email,
        department: dept,
        courses: courses || "Pending Assignment",
        role: "Lecturer",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        score
      };

      db.addFaculty(newFac);
      renderFacultyTable();
      showToast(`${name} added to Faculty roster!`);
    });
  }
}

// 2. Student Upload Controller
function setupStudentUploadDropzone() {
  const dropzone = document.querySelector('.border-dashed');
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.csv, .xls, .xlsx';
  fileInput.className = 'hidden';
  document.body.appendChild(fileInput);

  if (!dropzone) return;

  dropzone.style.cursor = 'pointer';
  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-primary', 'bg-primary/5');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-primary', 'bg-primary/5');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-primary', 'bg-primary/5');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleDroppedFile(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleDroppedFile(fileInput.files[0]);
    }
  });
}

function handleDroppedFile(file) {
  showToast(`Uploading ${file.name}...`);
  setTimeout(() => {
    // Generate mock list of parsed students
    const parsedStudents = [
      { name: "John Doe", roll: "CS202410", department: "Computer Science", attendance: 92, risk: 8 },
      { name: "Emily Blunt", roll: "CS202411", department: "Computer Science", attendance: 71, risk: 79 },
      { name: "Robert Downey", roll: "BA202412", department: "Business Analytics", attendance: 88, risk: 15 }
    ];

    parsedStudents.forEach(std => {
      const current = db.getStudents();
      if (!current.some(c => c.roll === std.roll)) {
        std.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${std.name}`;
        current.push(std);
        db.saveStudents(current);
      }
    });

    showToast("Bulk Student Upload completed successfully! 3 records imported.");
    
    // Switch view automatically to attendance calendar or update view if present
    const tableBody = document.querySelector('table tbody');
    if (tableBody) {
      // If student listing table exists in the template, re-render it
      tableBody.innerHTML += parsedStudents.map(s => `
        <tr class="border-b border-outline-variant hover:bg-surface-container-low">
          <td class="px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">${s.name.split(' ').map(x=>x[0]).join('')}</div>
            <div class="font-label-md font-bold">${s.name}</div>
          </td>
          <td class="px-6 py-4 font-body-sm text-on-surface-variant">${s.roll}</td>
          <td class="px-6 py-4 font-body-sm text-on-surface-variant">${s.department}</td>
          <td class="px-6 py-4 font-body-sm text-green-600 font-bold">${s.attendance}%</td>
          <td class="px-6 py-4 font-body-sm text-right"><span class="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">Imported</span></td>
        </tr>
      `).join('');
    }
  }, 1500);
}

// 3. Attendance Calendar marking
function renderAttendanceRoster() {
  const container = document.querySelector('.custom-scrollbar');
  if (!container) return;

  const students = db.getStudents();
  container.innerHTML = students.map(s => `
    <div class="flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:border-primary/20 transition-all hover:bg-surface-container-lowest">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
          <img alt="${s.name}" class="w-full h-full object-cover" src="${s.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + s.name}"/>
        </div>
        <div>
          <p class="font-label-md text-on-surface font-semibold">${s.name}</p>
          <p class="text-[12px] text-on-surface-variant">Roll: #${s.roll} • <span class="font-bold text-primary">${s.attendance}% Avg</span></p>
        </div>
      </div>
      <div class="flex bg-surface-container-low rounded-lg p-1 gap-1">
        <button class="px-3 py-1 rounded-md text-label-sm transition-all bg-white shadow-sm text-primary font-bold hover:bg-primary/5 active:scale-95" onclick="window.unismart_mark_attendance('${s.roll}', true, this)">P</button>
        <button class="px-3 py-1 rounded-md text-label-sm transition-all text-on-surface-variant hover:bg-white active:scale-95" onclick="window.unismart_mark_attendance('${s.roll}', false, this)">A</button>
      </div>
    </div>
  `).join('');
}

window.unismart_mark_attendance = (roll, isPresent, btnElement) => {
  db.updateStudentAttendance(roll, isPresent);
  
  // Update UI visual selection state
  const parent = btnElement.parentElement;
  parent.querySelectorAll('button').forEach(b => {
    b.className = "px-3 py-1 rounded-md text-label-sm transition-all text-on-surface-variant hover:bg-white active:scale-95";
  });
  
  if (isPresent) {
    btnElement.className = "px-3 py-1 rounded-md text-label-sm transition-all bg-white shadow-sm text-primary font-bold hover:bg-primary/5 active:scale-95";
    showToast(`Marked #${roll} Present`);
  } else {
    btnElement.className = "px-3 py-1 rounded-md text-label-sm transition-all bg-error text-white font-bold shadow-sm active:scale-95";
    showToast(`Marked #${roll} Absent`);
  }

  // Live reload calendar metrics if visible
  const statsElements = document.querySelectorAll('.text-headline-md');
  if (statsElements.length > 0) {
    const students = db.getStudents();
    const avgAttendance = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length);
    const atRiskCount = students.filter(s => s.risk > 75).length;
    
    statsElements[0].textContent = avgAttendance + "%";
    if (statsElements[1]) statsElements[1].textContent = "0" + atRiskCount;
  }
};

// 4. Reports Module Generator
function renderReportsTable() {
  const tableBody = document.querySelector('table tbody');
  if (!tableBody) return;

  const reports = db.getReports();
  tableBody.innerHTML = reports.map(r => `
    <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary text-[28px]">description</span>
          <div>
            <p class="font-label-md text-label-md font-bold text-on-surface">${r.name}</p>
            <p class="text-[10px] text-outline">${r.id}</p>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">${r.date}</td>
      <td class="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase">${r.type}</span>
      </td>
      <td class="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">${r.size}</td>
      <td class="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">${r.generatedBy}</td>
      <td class="px-6 py-4 text-right">
        <button class="text-primary hover:text-primary-container transition-colors p-1" onclick="window.unismart_download_report('${r.id}', '${r.name}')">
          <span class="material-symbols-outlined text-[18px]">download</span>
        </button>
      </td>
    </tr>
  `).join('');
}

function setupReportsGenerator() {
  const triggerBtn = document.querySelector('button.bg-primary');
  if (!triggerBtn) return;

  triggerBtn.addEventListener('click', () => {
    const reportName = prompt("Enter Report Description Name:", "Module Performance Audit");
    if (!reportName) return;

    triggerBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Generating Report...`;
    setTimeout(() => {
      const session = getSession() || { name: "Alex Thompson" };
      const newReport = {
        id: "REP" + (Date.now().toString().slice(-3)),
        name: reportName,
        date: new Date().toISOString().split('T')[0],
        type: "CSV",
        size: "98 KB",
        generatedBy: session.name
      };

      db.addReport(newReport);
      renderReportsTable();
      triggerBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">add</span> Create New Report`;
      showToast("Report generated successfully!");
      
      // Prompt download
      window.unismart_download_report(newReport.id, newReport.name);
    }, 1200);
  });
}

window.unismart_download_report = (id, name) => {
  showToast(`Downloading ${name}...`);
  const students = db.getStudents();
  
  // Compile CSV content
  let csvContent = "Roll Number,Student Name,Department,Avg Attendance %,AI Dropout Risk %\r\n";
  students.forEach(s => {
    csvContent += `${s.roll},"${s.name}","${s.department}",${s.attendance},${s.risk}\r\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${name.toLowerCase().replace(/ /g, '_')}_${id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 5. Settings Controller
function setupSettingsPage() {
  const settings = db.getSettings();
  
  // Map settings object to input values
  const instNameInput = document.getElementById('settings-inst-name');
  const codeInput = document.getElementById('settings-inst-code');
  const domainInput = document.getElementById('settings-domain');
  const smtpHostInput = document.getElementById('settings-smtp-host');
  const smtpPortInput = document.getElementById('settings-smtp-port');
  const smtpUserInput = document.getElementById('settings-smtp-user');
  const smtpPassInput = document.getElementById('settings-smtp-pass');
  
  if (instNameInput) instNameInput.value = settings.institutionName || '';
  if (codeInput) codeInput.value = settings.institutionCode || '';
  if (domainInput) domainInput.value = settings.primaryDomain || '';
  if (smtpHostInput) smtpHostInput.value = settings.smtpHost || '';
  if (smtpPortInput) smtpPortInput.value = settings.smtpPort || '';
  if (smtpUserInput) smtpUserInput.value = settings.smtpUser || '';
  if (smtpPassInput) smtpPassInput.value = settings.smtpPass || '';

  // Add settings theme toggle support
  const brandingSection = document.getElementById('pane-univ-details') || document.querySelector('section');
  if (brandingSection && !document.getElementById('theme-switcher-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'theme-switcher-wrapper';
    wrapper.className = 'space-y-base mt-lg';
    wrapper.innerHTML = `
      <label class="font-label-md text-label-md text-on-surface font-semibold">Application Theme Mode</label>
      <select id="theme-select-branding" class="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none bg-white">
        <option value="sky-blue" ${settings.theme === 'sky-blue' ? 'selected' : ''}>Sky Blue Theme (Futuristic Flow)</option>
        <option value="royal-blue" ${settings.theme === 'royal-blue' ? 'selected' : ''}>Royal Blue Theme (Traditional Modernism)</option>
      </select>
    `;
    brandingSection.appendChild(wrapper);
    
    document.getElementById('theme-select-branding').addEventListener('change', (e) => {
      settings.theme = e.target.value;
      db.saveSettings(settings);
      showToast(`Theme switched to ${e.target.value === 'royal-blue' ? 'Royal Blue' : 'Sky Blue'}`);
    });
  }

  // Add vertical tab switching handlers
  const tabs = ['univ-details', 'academic', 'email', 'otp', 'ai-config', 'users'];
  tabs.forEach(tabId => {
    const tabBtn = document.getElementById(`tab-${tabId}`);
    if (tabBtn) {
      tabBtn.addEventListener('click', () => {
        // Hide all panes
        document.querySelectorAll('.settings-pane').forEach(pane => {
          pane.classList.add('hidden');
        });
        // Remove active class from all tabs
        tabs.forEach(tId => {
          const btn = document.getElementById(`tab-${tId}`);
          if (btn) {
            btn.className = "w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all hover:bg-surface-container font-label-md text-label-md text-on-surface-variant";
          }
        });
        // Show target pane
        const targetPane = document.getElementById(`pane-${tabId}`);
        if (targetPane) targetPane.classList.remove('hidden');
        // Add active classes to current tab
        tabBtn.className = "w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all settings-tab-active font-label-md text-label-md font-bold text-primary bg-primary/10 border-r-2 border-primary";
      });
    }
  });

  // Handle Save settings trigger
  const saveBtn = document.querySelector('button.bg-primary') || document.querySelector('.mt-auto button:last-child');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const updated = {
        ...settings,
        institutionName: instNameInput ? instNameInput.value : settings.institutionName,
        institutionCode: codeInput ? codeInput.value : settings.institutionCode,
        primaryDomain: domainInput ? domainInput.value : settings.primaryDomain,
        smtpHost: smtpHostInput ? smtpHostInput.value : settings.smtpHost,
        smtpPort: smtpPortInput ? parseInt(smtpPortInput.value) : settings.smtpPort,
        smtpUser: smtpUserInput ? smtpUserInput.value : settings.smtpUser,
        smtpPass: smtpPassInput ? smtpPassInput.value : settings.smtpPass
      };
      db.saveSettings(updated);
      showToast("System configurations saved!");
    });
  }
}

// 6. AI Risk Center suggestions
function setupAIRiskPage() {
  const rangeSlider = document.querySelector('input[type="range"]');
  
  // Wire up slider confidence thresholds
  if (rangeSlider) {
    rangeSlider.addEventListener('input', (e) => {
      showToast(`Filtering AI Confidence above ${e.target.value}%`);
      renderRiskStudents(e.target.value);
    });
  }

  // Render Risk Students Table and dynamic counts
  renderRiskStudents();

  // Wire up chat assistant
  const sendBtn = document.getElementById('assistant-send-btn');
  const chatInput = document.getElementById('assistant-input');
  
  if (sendBtn && chatInput) {
    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;
      
      appendChatMessage(text, true);
      chatInput.value = '';
      
      // AI Thinking...
      setTimeout(() => {
        let reply = "I am ready to help you coordinate academic interventions. Ask me about specific students, departments, or warning templates.";
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('marcus')) {
          reply = "Marcus Thorne's attendance is currently 62% in Computer Science. Our predictive engine suggests an 82% risk of drop out. Recommended action: schedule a direct counselor intervention.";
        } else if (lowerText.includes('aria')) {
          reply = "Aria Gupta has a risk level of 78% due to a 72% attendance rate in Fine Arts. An academic alert email notification has been prepared for dispatch.";
        } else if (lowerText.includes('email') || lowerText.includes('warning')) {
          reply = "I have drafted academic warning letters for Marcus Thorne and Aria Gupta. Would you like to dispatch them now?";
        } else if (lowerText.includes('meeting') || lowerText.includes('counsel') || lowerText.includes('tutoring')) {
          reply = "Scheduling tutoring sessions or counselor meetings usually improves retention by 14%. I can send invitations to department leads Rodriguez and Shannon.";
        }
        
        appendChatMessage(reply, false);
      }, 700);
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
}

// Helper for chat bubble appending
function appendChatMessage(text, isUser) {
  const chatContainer = document.getElementById('ai-chat-messages');
  if (!chatContainer) return;
  
  const msgWrapper = document.createElement('div');
  msgWrapper.className = 'flex flex-col gap-sm';
  
  if (isUser) {
    msgWrapper.innerHTML = `
      <div class="bg-surface-container-high text-on-surface p-md rounded-2xl rounded-tr-none font-body-sm shadow-sm leading-relaxed self-end max-w-[85%]">
        <p>${text}</p>
      </div>
      <span class="text-[10px] text-on-surface-variant uppercase mr-2 font-bold self-end">You</span>
    `;
  } else {
    msgWrapper.innerHTML = `
      <div class="bg-primary text-white p-md rounded-2xl rounded-tl-none font-body-sm shadow-sm leading-relaxed max-w-[85%] animate-fade-in">
        <p>${text}</p>
      </div>
      <span class="text-[10px] text-on-surface-variant uppercase ml-2 font-bold">AI Assistant</span>
    `;
  }
  
  chatContainer.appendChild(msgWrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Helper to render high priority risk students and recalculate counters
function renderRiskStudents(threshold = 50) {
  const tbody = document.getElementById('ai-risk-students-body');
  const criticalEl = document.getElementById('critical-risk-count');
  const warningEl = document.getElementById('warning-risk-count');
  const stableEl = document.getElementById('stable-risk-count');
  
  if (!tbody) return;

  const students = db.getStudents();
  
  // Recalculate summary counts based on student database list
  let criticalCount = 0;
  let warningCount = 0;
  let stableCount = 0;
  
  students.forEach(s => {
    if (s.risk >= 75) criticalCount++;
    else if (s.risk >= 20) warningCount++;
    else stableCount++;
  });

  if (criticalEl) criticalEl.textContent = criticalCount;
  if (warningEl) warningEl.textContent = warningCount;
  if (stableEl) stableEl.textContent = stableCount;

  // Render table rows
  const filtered = students.filter(s => s.risk >= threshold).sort((a, b) => b.risk - a.risk);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-lg py-4 text-center text-on-surface-variant italic">No students match current filter threshold (${threshold}%)</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    let riskColorClass = "text-primary";
    let riskBgClass = "bg-primary/10";
    if (s.risk >= 75) {
      riskColorClass = "text-error";
      riskBgClass = "bg-error/10";
    } else if (s.risk >= 20) {
      riskColorClass = "text-secondary";
      riskBgClass = "bg-secondary/10";
    }

    let recommendation = "Monitor attendance trends";
    if (s.risk >= 75) recommendation = "Immediate counselor session";
    else if (s.risk >= 50) recommendation = "Academic warning notification";
    else if (s.risk >= 20) recommendation = "Assign tutoring partner";

    return `
      <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
        <td class="px-lg py-4 flex items-center gap-3">
          <img class="w-8 h-8 rounded-full object-cover border border-outline-variant" src="${s.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + s.name}" alt="${s.name}"/>
          <div>
            <p class="font-label-md text-label-md font-bold text-on-surface">${s.name}</p>
            <p class="text-[10px] text-outline">${s.roll}</p>
          </div>
        </td>
        <td class="px-lg py-4 font-body-sm text-body-sm text-on-surface-variant">${s.attendance}%</td>
        <td class="px-lg py-4 font-body-sm text-body-sm">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.attendance >= 85 ? 'bg-green-100 text-green-700' : s.attendance >= 75 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}">
            ${s.attendance >= 85 ? 'Stable' : s.attendance >= 75 ? 'Medium' : 'Critical'}
          </span>
        </td>
        <td class="px-lg py-4 font-body-sm text-body-sm font-bold ${riskColorClass}">
          <span class="px-2.5 py-0.5 rounded-full ${riskBgClass}">${s.risk}% Risk</span>
        </td>
        <td class="px-lg py-4 font-body-sm text-body-sm text-on-surface-variant">${recommendation}</td>
        <td class="px-lg py-4 text-right">
          <button class="px-3 py-1 bg-primary text-white rounded-md text-xs font-bold hover:opacity-90 active:scale-95 transition-all" onclick="window.unismart_assistant_action('trigger', '${s.name}')">
            Trigger
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Global action handler for assistant interventions
window.unismart_assistant_action = (actionType, studentName = '') => {
  if (actionType === 'email') {
    showToast("Dispatched intervention warning emails to 2 students");
  } else if (actionType === 'meeting') {
    showToast("Counseling invitations sent to department advisors");
  } else if (actionType === 'trigger') {
    showToast(`Initiated AI intervention workflow for ${studentName}`);
  }
};

// 7. Analytics trend loading
let resizeHandlerRegistered = false;

function setupAnalyticsPage() {
  const selectFilter = document.querySelector('select');
  if (selectFilter) {
    selectFilter.addEventListener('change', (e) => {
      showToast(`Reloading trends for ${e.target.value}...`);
      drawForecastChart();
    });
  }

  // Trigger chart drawing
  setTimeout(drawForecastChart, 50);

  if (!resizeHandlerRegistered) {
    window.addEventListener('resize', () => {
      if (document.getElementById('forecastChart')) {
        drawForecastChart();
      }
    });
    resizeHandlerRegistered = true;
  }
}

// Draw Forecast Curve on Canvas API dynamically
function drawForecastChart() {
  const canvas = document.getElementById('forecastChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);

  // Retrieve computed CSS variables for current dynamic color styling
  const style = getComputedStyle(document.documentElement);
  const primaryColor = style.getPropertyValue('--color-primary').trim() || '#0284c7';
  const secondaryColor = style.getPropertyValue('--color-secondary').trim() || '#0ea5e9';
  const gridColor = style.getPropertyValue('--color-outline-variant').trim() || '#e2e8f0';
  const onSurfaceVariant = style.getPropertyValue('--color-on-surface-variant').trim() || '#64748b';

  const students = db.getStudents() || [];
  const avgAttendance = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length) || 88;

  const totalDays = 30;
  const splitDay = 15;
  const points = [];

  for (let i = 0; i < totalDays; i++) {
    const wave = Math.sin(i * 0.4) * 6 + Math.cos(i * 0.2) * 3;
    let val = avgAttendance + wave;
    val = Math.max(0, Math.min(100, val));
    points.push(val);
  }

  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;

  // 1. Draw gridlines & Y labels
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.fillStyle = onSurfaceVariant;
  ctx.textAlign = 'right';

  const yLabels = [100, 80, 60, 40, 20];
  yLabels.forEach(label => {
    const percent = label / 100;
    const y = paddingTop + chartH * (1 - percent);
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();
    ctx.fillText(`${label}%`, paddingLeft - 8, y + 3);
  });

  // 2. Draw X labels
  ctx.textAlign = 'center';
  const xLabels = ['Oct 1', 'Oct 7', 'Oct 14', 'Oct 21', 'Oct 28', 'Nov 4'];
  const xSteps = totalDays / (xLabels.length - 1);
  xLabels.forEach((label, idx) => {
    const dayIdx = Math.min(totalDays - 1, Math.round(idx * xSteps));
    const x = paddingLeft + (dayIdx / (totalDays - 1)) * chartW;
    ctx.fillText(label, x, h - paddingBottom + 18);
  });

  const coords = points.map((val, idx) => {
    const x = paddingLeft + (idx / (totalDays - 1)) * chartW;
    const y = paddingTop + chartH * (1 - val / 100);
    return { x, y };
  });

  // 3. Draw Historical Line (solid curve)
  ctx.beginPath();
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.moveTo(coords[0].x, coords[0].y);
  for (let i = 1; i < splitDay; i++) {
    const xc = (coords[i - 1].x + coords[i].x) / 2;
    const yc = (coords[i - 1].y + coords[i].y) / 2;
    ctx.quadraticCurveTo(coords[i - 1].x, coords[i - 1].y, xc, yc);
  }
  ctx.lineTo(coords[splitDay - 1].x, coords[splitDay - 1].y);
  ctx.stroke();

  // 4. Draw Forecast Line (dashed curve)
  ctx.beginPath();
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([6, 4]);
  ctx.moveTo(coords[splitDay - 1].x, coords[splitDay - 1].y);
  for (let i = splitDay; i < totalDays; i++) {
    const xc = (coords[i - 1].x + coords[i].x) / 2;
    const yc = (coords[i - 1].y + coords[i].y) / 2;
    ctx.quadraticCurveTo(coords[i - 1].x, coords[i - 1].y, xc, yc);
  }
  ctx.lineTo(coords[totalDays - 1].x, coords[totalDays - 1].y);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. Draw Area Gradient under Historical curve
  let fillBase = primaryColor;
  if (primaryColor.startsWith('#')) {
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    fillBase = `rgba(${r}, ${g}, ${b}`;
  }
  const fillGradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
  fillGradient.addColorStop(0, fillBase.includes('rgba') ? `${fillBase}, 0.15)` : 'rgba(2, 132, 199, 0.15)');
  fillGradient.addColorStop(1, fillBase.includes('rgba') ? `${fillBase}, 0)` : 'rgba(2, 132, 199, 0)');

  ctx.beginPath();
  ctx.moveTo(coords[0].x, coords[0].y);
  for (let i = 1; i < splitDay; i++) {
    const xc = (coords[i - 1].x + coords[i].x) / 2;
    const yc = (coords[i - 1].y + coords[i].y) / 2;
    ctx.quadraticCurveTo(coords[i - 1].x, coords[i - 1].y, xc, yc);
  }
  ctx.lineTo(coords[splitDay - 1].x, coords[splitDay - 1].y);
  ctx.lineTo(coords[splitDay - 1].x, paddingTop + chartH);
  ctx.lineTo(coords[0].x, paddingTop + chartH);
  ctx.closePath();
  ctx.fillStyle = fillGradient;
  ctx.fill();

  // 6. Draw Glowing Node at boundary
  const node = coords[splitDay - 1];
  ctx.beginPath();
  ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = primaryColor;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
}

// 8. Admin Dashboard setups
function setupAdminDashboard() {
  const students = db.getStudents() || [];
  const faculty = db.getFaculty() || [];

  // KPI total student count
  const totalStudentsEl = document.getElementById('kpi-total-students');
  if (totalStudentsEl) {
    totalStudentsEl.textContent = (students.length + 14277).toLocaleString();
  }

  // KPI total faculty count
  const totalFacultyEl = document.getElementById('kpi-total-faculty');
  if (totalFacultyEl) {
    totalFacultyEl.textContent = (faculty.length + 837).toLocaleString();
  }

  // KPI average attendance rate
  const avgAttendance = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length) || 88;
  const attendanceRateEl = document.getElementById('kpi-attendance-rate');
  if (attendanceRateEl) {
    attendanceRateEl.textContent = `${avgAttendance}%`;
  }

  // KPI high risk students
  const criticalCount = students.filter(s => s.risk >= 75).length;
  const highRiskStudentsEl = document.getElementById('kpi-high-risk-students');
  if (highRiskStudentsEl) {
    highRiskStudentsEl.textContent = criticalCount + 120;
  }

  // Populate Weekly Attendance Trend
  const trendContainer = document.getElementById('admin-dashboard-weekly-trend');
  if (trendContainer) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    trendContainer.innerHTML = days.map((day, idx) => {
      const wave = Math.sin(idx * 1.5) * 8 + Math.cos(idx * 0.7) * 4;
      const height = Math.max(20, Math.min(100, avgAttendance + wave));
      const isLow = height < 75;
      const barColor = isLow ? 'bg-error/20 hover:bg-error/35' : 'bg-primary/10 hover:bg-primary/25';
      const borderColor = isLow ? 'border-error' : 'border-primary';
      
      return `
        <div class="flex flex-col items-center flex-1 gap-2 h-full justify-end">
          <div class="w-1/2 ${barColor} rounded-t-lg relative transition-all duration-500 group" style="height: ${height}%">
            <div class="absolute -top-1 left-0 w-full border-t-2 ${borderColor}"></div>
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-background text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-10">${Math.round(height)}%</div>
          </div>
          <span class="text-[10px] text-on-surface-variant font-bold">${day}</span>
        </div>
      `;
    }).join('');
  }

  // Populate Faculty Score listing
  const scoreContainer = document.getElementById('admin-dashboard-faculty-scores');
  if (scoreContainer) {
    const departments = ['Computer Science', 'Business Analytics', 'Fine Arts', 'Life Sciences'];
    const deptData = {};
    
    departments.forEach(d => {
      deptData[d] = { total: 0, count: 0 };
    });

    students.forEach(s => {
      if (deptData[s.department]) {
        deptData[s.department].total += s.attendance;
        deptData[s.department].count++;
      }
    });

    scoreContainer.innerHTML = departments.map(d => {
      const info = deptData[d];
      let deptAvg = info.count > 0 ? Math.round(info.total / info.count) : 85;
      
      // Fine Arts fallback to 72 if empty
      if (d === 'Fine Arts' && info.count === 0) deptAvg = 72;
      
      const isLow = deptAvg < 75;
      const progressBg = isLow ? 'bg-error' : 'bg-primary';
      const scoreColor = isLow ? 'text-error font-bold' : 'text-primary font-bold';

      return `
        <div class="space-y-2">
          <div class="flex justify-between font-label-md text-label-md">
            <span class="text-on-surface">${d}</span>
            <span class="${scoreColor}">${deptAvg}%</span>
          </div>
          <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div class="h-full ${progressBg}" style="width: ${deptAvg}%"></div>
          </div>
        </div>
      `;
    }).join('') + `
      <div class="pt-md">
        <a href="#/admin/analytics" class="w-full text-center font-label-md text-label-md text-primary hover:underline block">View All Departments</a>
      </div>
    `;
  }
}

// Global UI Toast Helper
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-[200] space-y-2';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'px-6 py-3 bg-on-surface text-background font-label-md text-label-md font-bold rounded-xl shadow-lg border border-outline/10 flex items-center gap-2 transform translate-y-5 opacity-0 transition-all duration-300';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-primary text-md">check_circle</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  
  // Trigger entry animation
  setTimeout(() => {
    toast.classList.remove('translate-y-5', 'opacity-0');
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('translate-y-5', 'opacity-0');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
}

// Router trigger handlers
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
router();
