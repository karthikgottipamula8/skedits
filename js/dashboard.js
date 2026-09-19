/**
 * SK EDITS — AUTHENTICATED ROLE DASHBOARDS SYSTEM ENGINE
 * Controls Admin, Client, and Editor Single-Page Application (SPA),
 * Realtime Chat with Contact Privacy Protection, Revision System,
 * Google Drive Workflow, and Dynamic Payment Gateway Switcher.
 */

// Resolve Backend API Base URL from Vite environment variable (VITE_API_URL) or runtime fallback
function resolveApiBaseUrl() {
  let url = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      url = import.meta.env.VITE_API_URL;
    }
  } catch (_) {}

  if (!url && typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.VITE_API_URL) {
    url = window.__ENV__.VITE_API_URL;
  }

  if (!url) {
    url = 'https://sk-edits-backend-sak6.vercel.app';
  }

  const clean = url.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
}

const API_BASE = resolveApiBaseUrl();

const state = {
  token: localStorage.getItem('sk_token') || null,
  user: JSON.parse(localStorage.getItem('sk_user') || 'null'),
  currentRoleTab: 'CLIENT', // CLIENT, EDITOR, ADMIN
  activeView: 'dashboard',  // dashboard, projects, users, payments, chat, settings
  projects: [],
  users: [],
  conversations: [],
  activeConversationId: null,
  messages: [],
  paymentSettings: null,
  analytics: null
};

// Web Audio API Notification Synthesizer (Chime Sound)
function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (_) {}
}

// API Helper
async function apiFetch(endpoint, options = {}) {
  const headers = options.headers || {};
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }
  if (!options.isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method: options.method || 'GET',
    headers,
    body: options.isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined)
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'API Request failed');
    }
    return data;
  } catch (err) {
    throw err;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPortalMount();
  attachGlobalLoginTriggers();
  if (state.token && state.user) {
    // Session exists, portal ready when triggered
  }
  // Check URL query or hash: e.g. #login or ?login=true
  if (window.location.hash === '#login' || window.location.search.includes('login=true')) {
    setTimeout(() => { showAuthModal(); }, 150);
  }
});

function attachGlobalLoginTriggers() {
  const loginSelectors = '.card-nav-login-btn, [onclick*="showAuthModal"], .open-login-btn, a[href="#login"]';
  document.querySelectorAll(loginSelectors).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal();
    });
  });
}

// Render Modal Container in DOM
function initPortalMount() {
  if (document.getElementById('sk-portal-mount')) return;

  const mount = document.createElement('div');
  mount.id = 'sk-portal-mount';
  mount.innerHTML = `
    <!-- AUTH MODAL -->
    <div class="portal-modal-backdrop" id="portal-auth-modal">
      <div class="portal-auth-card">
        <button type="button" class="portal-auth-close-btn" id="btn-close-auth-modal" aria-label="Close Login Modal">&times;</button>
        <div class="portal-auth-header">
          <div class="portal-auth-logo">
            <img src="assets/logo-nav.png" alt="SK Edits Logo" />
            <span>SK Edits<span class="dot">.</span></span>
          </div>
          <p id="portal-auth-subtitle" style="color:var(--portal-subtext); font-size:0.88rem;">Select your role & sign in to SK Edits Portal</p>
        </div>

        <!-- ROLE SELECTION TABS: CLIENT | EDITOR | ADMIN -->
        <div class="portal-role-tabs" id="portal-role-tabs-container">
          <div class="portal-role-tab active" data-role="CLIENT">Client Portal</div>
          <div class="portal-role-tab" data-role="EDITOR">Editor Portal</div>
          <div class="portal-role-tab" data-role="ADMIN">Admin Portal</div>
        </div>

        <!-- LOGIN VIEW -->
        <div id="portal-login-view">
          <form id="portal-login-form">
            <div class="portal-form-group">
              <label class="portal-form-label">Email Address</label>
              <input type="email" id="auth-email" class="portal-input" placeholder="name@domain.com" required />
            </div>
            <div class="portal-form-group">
              <label class="portal-form-label">Password</label>
              <input type="password" id="auth-password" class="portal-input" placeholder="••••••••" required />
            </div>
            <div id="auth-error-msg" style="color:#F87171; font-size:0.82rem; margin-bottom:14px; display:none;"></div>
            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">
              Sign In to <span id="auth-role-name">Client</span> Portal
            </button>
          </form>

          <div style="margin-top:20px; text-align:center; font-size:0.85rem; color:var(--portal-subtext);">
            Don't have an account? <a href="#" id="toggle-register-link" style="color:var(--portal-lime); font-weight:700; text-decoration:none;">Create Account</a>
          </div>
        </div>

        <!-- REGISTER VIEW -->
        <div id="portal-register-view" style="display:none;">
          <form id="portal-register-form">
            <div class="portal-form-group">
              <label class="portal-form-label">Full Name</label>
              <input type="text" id="reg-fullname" class="portal-input" placeholder="e.g. Coach Rohan Sharma" required />
            </div>
            <div class="portal-form-group">
              <label class="portal-form-label">Email Address</label>
              <input type="email" id="reg-email" class="portal-input" placeholder="name@domain.com" required />
            </div>
            <div class="portal-form-group">
              <label class="portal-form-label">Password (min. 6 characters)</label>
              <input type="password" id="reg-password" class="portal-input" placeholder="Create a secure password" minlength="6" required />
            </div>
            <div class="portal-form-group">
              <label class="portal-form-label">Phone / WhatsApp Number</label>
              <input type="tel" id="reg-phone" class="portal-input" placeholder="+91 9876543210" required />
            </div>
            
            <!-- Dynamic Role-Specific Fields -->
            <div class="portal-form-group" id="reg-client-fields">
              <label class="portal-form-label">Company / Brand Name</label>
              <input type="text" id="reg-company" class="portal-input" placeholder="e.g. FitPro Mentorship" />
            </div>
            <div class="portal-form-group" id="reg-editor-fields" style="display:none;">
              <label class="portal-form-label">Editing Skills & Software</label>
              <input type="text" id="reg-skills" class="portal-input" placeholder="e.g. Premiere Pro, After Effects, CapCut" />
            </div>
            
            <div id="reg-admin-notice" style="display:none; color:var(--portal-subtext); font-size:0.82rem; margin-bottom:14px; background:rgba(255,255,255,0.05); padding:10px 12px; border-radius:8px; border:1px solid var(--portal-border);">
              <i class="fas fa-info-circle" style="color:var(--portal-lime); margin-right:6px;"></i>
              Admin accounts are pre-configured. Switch to <strong>Client</strong> or <strong>Editor</strong> to register.
            </div>

            <div id="reg-error-msg" style="color:#F87171; font-size:0.82rem; margin-bottom:14px; display:none;"></div>

            <button type="submit" id="btn-submit-register" class="btn btn-primary" style="width:100%; justify-content:center;">
              Create <span id="reg-role-label">Client</span> Account
            </button>
          </form>

          <div style="margin-top:20px; text-align:center; font-size:0.85rem; color:var(--portal-subtext);">
            Already have an account? <a href="#" id="toggle-login-link" style="color:var(--portal-lime); font-weight:700; text-decoration:none;">Sign In</a>
          </div>
        </div>
      </div>
    </div>

    <!-- USER PROFILE & SECURITY MODAL (CLIENT & EDITOR) -->
    <div class="portal-modal-backdrop" id="portal-profile-modal">
      <div class="portal-auth-card portal-profile-card">
        <button type="button" class="portal-auth-close-btn" id="btn-close-profile-modal" aria-label="Close Profile Modal">&times;</button>
        <div class="portal-auth-header">
          <div style="width:52px; height:52px; border-radius:50%; background:var(--portal-lime); color:#050608; font-weight:900; font-size:1.3rem; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto;" id="modal-profile-initials">SK</div>
          <h3 style="font-size:1.25rem; font-weight:800; color:#fff; margin:0 0 4px 0;" id="modal-profile-title">Profile & Security</h3>
          <p style="color:var(--portal-subtext); font-size:0.85rem; margin:0;">Update your mobile number, email, and password</p>
          <span id="modal-profile-role-badge" class="portal-badge portal-badge-assigned" style="margin-top:8px; display:inline-block;">CLIENT</span>
        </div>

        <form id="portal-profile-form">
          <div class="portal-form-group">
            <label class="portal-form-label"><i class="fas fa-user" style="color:var(--portal-lime); margin-right:6px;"></i> Full Name</label>
            <input type="text" id="profile-name-input" class="portal-input" placeholder="Your name" required />
          </div>

          <div class="portal-form-group">
            <label class="portal-form-label"><i class="fas fa-envelope" style="color:var(--portal-lime); margin-right:6px;"></i> Email Address</label>
            <input type="email" id="profile-email-input" class="portal-input" placeholder="name@domain.com" required />
          </div>

          <div class="portal-form-group">
            <label class="portal-form-label"><i class="fas fa-phone-alt" style="color:var(--portal-lime); margin-right:6px;"></i> Mobile / WhatsApp Number</label>
            <input type="tel" id="profile-phone-input" class="portal-input" placeholder="e.g. +91 8074015211" required />
          </div>

          <div style="border-top:1px solid var(--portal-border); margin:18px 0 14px 0; padding-top:14px;">
            <div style="font-weight:700; font-size:0.88rem; color:#fff; margin-bottom:10px; display:flex; align-items:center; gap:8px;">
              <i class="fas fa-key" style="color:var(--portal-lime);"></i>
              <span>Change Password</span>
              <small style="color:var(--portal-muted); font-size:0.75rem; font-weight:400;">(Optional)</small>
            </div>
            
            <div class="portal-form-group">
              <label class="portal-form-label">Current Password</label>
              <input type="password" id="profile-current-password" class="portal-input" placeholder="Enter current password if changing" />
            </div>

            <div class="portal-form-group">
              <label class="portal-form-label">New Password</label>
              <input type="password" id="profile-new-password" class="portal-input" placeholder="Minimum 6 characters" minlength="6" />
            </div>

            <div class="portal-form-group">
              <label class="portal-form-label">Confirm New Password</label>
              <input type="password" id="profile-confirm-password" class="portal-input" placeholder="Confirm new password" />
            </div>
          </div>

          <div id="profile-status-alert" style="display:none; font-size:0.85rem; padding:10px 14px; border-radius:8px; margin-bottom:14px;"></div>

          <div style="display:flex; gap:10px; margin-top:16px;">
            <button type="button" class="btn btn-secondary" id="btn-cancel-profile-edit" style="flex:1; justify-content:center;">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-save-profile-submit" style="flex:1; justify-content:center;">
              <i class="fas fa-check"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MAIN PORTAL SPA WRAPPER -->
    <div class="portal-app-wrapper" id="portal-app-wrapper">
      <div class="portal-sidebar-backdrop" id="portal-sidebar-backdrop"></div>
      <div class="portal-sidebar">
        <div class="portal-sidebar-brand">
          <img src="assets/logo-nav.png" width="30" height="30" alt="Logo" />
          <span style="font-family:'Outfit',sans-serif; font-weight:800; font-size:1.25rem; color:#fff;">SK Edits<span style="color:var(--portal-lime);">.</span></span>
          <span id="user-role-badge" class="portal-badge portal-badge-assigned" style="margin-left:auto; font-size:0.65rem;">CLIENT</span>
        </div>
        <div class="portal-sidebar-nav" id="portal-sidebar-nav">
          <!-- Dynamic Nav Items by Role -->
        </div>
        <div class="portal-sidebar-footer">
          <div class="portal-user-profile-btn" id="portal-user-profile-trigger" title="Click to view & edit your profile, mobile & password" role="button" tabindex="0">
            <div style="width:38px; height:38px; border-radius:50%; background:var(--portal-lime); color:#050608; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.9rem;" id="user-avatar-initials">SK</div>
            <div style="overflow:hidden; flex:1;">
              <div style="font-weight:700; font-size:0.85rem; color:#fff; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;" id="user-display-name">User Name</div>
              <div style="font-size:0.75rem; color:var(--portal-muted); white-space:nowrap; text-overflow:ellipsis; overflow:hidden;" id="user-display-email">user@skedits.agency</div>
            </div>
            <i class="fas fa-user-pen portal-profile-edit-icon" title="Edit Profile"></i>
          </div>
          <button id="portal-logout-btn" class="btn btn-secondary btn-sm" style="width:100%; margin-top:10px; justify-content:center;">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      <div class="portal-main-workspace">
        <div class="portal-topbar">
          <div style="display:flex; align-items:center; gap:10px;">
            <button class="portal-mobile-sidebar-toggle" id="btn-mobile-sidebar-toggle" aria-label="Toggle Navigation Menu">
              <i class="fas fa-bars"></i>
            </button>
            <h2 style="font-size:1.15rem; font-weight:800; color:#fff; margin:0;" id="portal-view-title">Dashboard</h2>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <!-- Topbar Clickable User Profile Chip -->
            <button class="portal-user-chip" id="topbar-profile-chip" title="Click to view & edit your profile, mobile & password" type="button">
              <div class="portal-user-chip-avatar" id="topbar-user-avatar-initials">SK</div>
              <span class="portal-user-chip-name" id="topbar-user-display-name">User Name</span>
              <i class="fas fa-user-pen" style="font-size:0.75rem; color:var(--portal-lime); margin-left:3px;"></i>
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-close-portal"><i class="fas fa-arrow-left"></i> <span class="portal-back-btn-text">Back to Landing Page</span></button>
          </div>
        </div>
        <div class="portal-content-scroll" id="portal-main-content">
          <!-- Dynamic View Mount -->
        </div>

        <!-- Floating WhatsApp & Call Icons in Client & Editor Dashboards (redirects to 8074015211) -->
        <div class="dashboard-floating-actions" id="dashboard-floating-whatsapp-container" style="display:none;">
          <a href="https://wa.me/918074015211?text=Hi%20SK%20Edits%2C%20I%20need%20assistance%20with%20my%20editing%20project" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="dashboard-floating-btn dashboard-floating-whatsapp" 
             id="dashboard-floating-whatsapp-btn" 
             title="Chat with SK Edits on WhatsApp (+91 8074015211)">
            <i class="fab fa-whatsapp"></i>
          </a>
          <a href="tel:+918074015211" 
             class="dashboard-floating-btn dashboard-floating-call" 
             id="dashboard-floating-call-btn" 
             title="Call SK Edits (+91 8074015211)">
            <i class="fas fa-phone-alt"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(mount);
  bindAuthEvents();
}

function bindAuthEvents() {
  const tabs = document.querySelectorAll('.portal-role-tab');
  const roleNameSpan = document.getElementById('auth-role-name');
  const emailInput = document.getElementById('auth-email');
  const passInput = document.getElementById('auth-password');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentRoleTab = tab.getAttribute('data-role');
      if (roleNameSpan) roleNameSpan.textContent = state.currentRoleTab;

      // Update register role label & role-specific field display
      const regRoleLabel = document.getElementById('reg-role-label');
      const regClientFields = document.getElementById('reg-client-fields');
      const regEditorFields = document.getElementById('reg-editor-fields');
      const regAdminNotice = document.getElementById('reg-admin-notice');
      const regSubmitBtn = document.getElementById('btn-submit-register');

      if (regRoleLabel) regRoleLabel.textContent = state.currentRoleTab === 'ADMIN' ? 'Account' : state.currentRoleTab;

      if (state.currentRoleTab === 'CLIENT') {
        if (regClientFields) regClientFields.style.display = 'block';
        if (regEditorFields) regEditorFields.style.display = 'none';
        if (regAdminNotice) regAdminNotice.style.display = 'none';
        if (regSubmitBtn) regSubmitBtn.disabled = false;
        emailInput.value = 'dr.priya@executivecoaching.in';
        passInput.value = 'Client@123';
      } else if (state.currentRoleTab === 'EDITOR') {
        if (regClientFields) regClientFields.style.display = 'none';
        if (regEditorFields) regEditorFields.style.display = 'block';
        if (regAdminNotice) regAdminNotice.style.display = 'none';
        if (regSubmitBtn) regSubmitBtn.disabled = false;
        emailInput.value = 'david.editor@skedits.agency';
        passInput.value = 'Editor@123';
      } else if (state.currentRoleTab === 'ADMIN') {
        if (regClientFields) regClientFields.style.display = 'none';
        if (regEditorFields) regEditorFields.style.display = 'none';
        if (regAdminNotice) regAdminNotice.style.display = 'block';
        if (regSubmitBtn) regSubmitBtn.disabled = true;
        emailInput.value = 'skedits1438@gmail.com';
        passInput.value = 'Sak@77805';
      }
    });
  });

  // --- Toggle between Sign In & Create Account ---
  const toggleRegLink = document.getElementById('toggle-register-link');
  const toggleLoginLink = document.getElementById('toggle-login-link');
  const loginView = document.getElementById('portal-login-view');
  const regView = document.getElementById('portal-register-view');
  const authSubtitle = document.getElementById('portal-auth-subtitle');

  if (toggleRegLink) {
    toggleRegLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginView && regView) {
        loginView.style.display = 'none';
        regView.style.display = 'block';
        if (authSubtitle) authSubtitle.textContent = 'Create your SK Edits Portal account';
        
        // If current role is ADMIN, switch to CLIENT for registration
        if (state.currentRoleTab === 'ADMIN') {
          const clientTab = document.querySelector('.portal-role-tab[data-role="CLIENT"]');
          if (clientTab) clientTab.click();
        }
      }
    });
  }

  if (toggleLoginLink) {
    toggleLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginView && regView) {
        regView.style.display = 'none';
        loginView.style.display = 'block';
        if (authSubtitle) authSubtitle.textContent = 'Select your role & sign in to SK Edits Portal';
      }
    });
  }

  // --- Login Form Submission ---
  const loginForm = document.getElementById('portal-login-form');
  const errorMsg = document.getElementById('auth-error-msg');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.style.display = 'none';

      const email = emailInput.value.trim();
      const password = passInput.value;

      try {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          body: { email, password, role: state.currentRoleTab }
        });

        state.token = res.token;
        state.user = res.user;
        localStorage.setItem('sk_token', res.token);
        localStorage.setItem('sk_user', JSON.stringify(res.user));

        hideAuthModal();
        launchPortalApp();
      } catch (err) {
        errorMsg.textContent = err.message || 'Login failed.';
        errorMsg.style.display = 'block';
      }
    });
  }

  // --- Registration Form Submission ---
  const regForm = document.getElementById('portal-register-form');
  const regErrorMsg = document.getElementById('reg-error-msg');

  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (regErrorMsg) regErrorMsg.style.display = 'none';

      const fullName = document.getElementById('reg-fullname')?.value.trim();
      const email = document.getElementById('reg-email')?.value.trim();
      const password = document.getElementById('reg-password')?.value;
      const phone = document.getElementById('reg-phone')?.value.trim();
      const companyName = document.getElementById('reg-company')?.value.trim();
      const skills = document.getElementById('reg-skills')?.value.trim();
      const role = state.currentRoleTab === 'EDITOR' ? 'EDITOR' : 'CLIENT';

      if (!fullName || !email || !password || !phone) {
        if (regErrorMsg) {
          regErrorMsg.textContent = 'Please fill out all required fields.';
          regErrorMsg.style.display = 'block';
        }
        return;
      }

      if (password.length < 6) {
        if (regErrorMsg) {
          regErrorMsg.textContent = 'Password must be at least 6 characters long.';
          regErrorMsg.style.display = 'block';
        }
        return;
      }

      const submitBtn = document.getElementById('btn-submit-register');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      }

      try {
        const res = await apiFetch('/auth/register', {
          method: 'POST',
          body: {
            fullName,
            email,
            password,
            phone,
            role,
            companyName: role === 'CLIENT' ? companyName : undefined,
            skills: role === 'EDITOR' ? skills : undefined
          }
        });

        state.token = res.token;
        state.user = res.user;
        localStorage.setItem('sk_token', res.token);
        localStorage.setItem('sk_user', JSON.stringify(res.user));

        hideAuthModal();
        launchPortalApp();
      } catch (err) {
        if (regErrorMsg) {
          regErrorMsg.textContent = err.message || 'Account creation failed. Please try again.';
          regErrorMsg.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Create <span id="reg-role-label">${role}</span> Account`;
        }
      }
    });
  }

  const logoutBtn = document.getElementById('portal-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('sk_token');
      localStorage.removeItem('sk_user');
      state.token = null;
      state.user = null;
      document.getElementById('portal-app-wrapper').classList.remove('active');
      showAuthModal();
    });
  }

  const closePortalBtn = document.getElementById('btn-close-portal');
  if (closePortalBtn) {
    closePortalBtn.addEventListener('click', () => {
      document.getElementById('portal-app-wrapper').classList.remove('active');
      document.getElementById('portal-auth-modal').classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  // --- Mobile Dashboard Sidebar Drawer Toggle ---
  const mobileSidebarToggle = document.getElementById('btn-mobile-sidebar-toggle');
  const sidebarBackdrop = document.getElementById('portal-sidebar-backdrop');
  const portalSidebar = document.querySelector('.portal-sidebar');

  if (mobileSidebarToggle && portalSidebar && sidebarBackdrop) {
    mobileSidebarToggle.addEventListener('click', () => {
      portalSidebar.classList.toggle('mobile-open');
      sidebarBackdrop.classList.toggle('active');
    });

    sidebarBackdrop.addEventListener('click', () => {
      portalSidebar.classList.remove('mobile-open');
      sidebarBackdrop.classList.remove('active');
    });
  }

  // Close mobile sidebar whenever a nav item is clicked
  document.addEventListener('click', (e) => {
    if (e.target.closest('.portal-nav-item') && portalSidebar && portalSidebar.classList.contains('mobile-open')) {
      portalSidebar.classList.remove('mobile-open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    }
  });

  // Close Auth Modal triggers (X button and backdrop click)
  const closeAuthModalBtn = document.getElementById('btn-close-auth-modal');
  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', hideAuthModal);
  }

  const authModalEl = document.getElementById('portal-auth-modal');
  if (authModalEl) {
    authModalEl.addEventListener('click', (e) => {
      if (e.target === authModalEl) {
        hideAuthModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('portal-auth-modal');
      if (modal && modal.classList.contains('active')) {
        hideAuthModal();
      }
      const pModal = document.getElementById('portal-profile-modal');
      if (pModal && pModal.classList.contains('active')) {
        hideProfileModal();
      }
    }
  });

  // --- Profile Settings Modal Management (Client & Editor) ---
  const profileTrigger = document.getElementById('portal-user-profile-trigger');
  const profileModal = document.getElementById('portal-profile-modal');
  const closeProfileBtn = document.getElementById('btn-close-profile-modal');
  const cancelProfileBtn = document.getElementById('btn-cancel-profile-edit');
  const profileForm = document.getElementById('portal-profile-form');
  const profileAlert = document.getElementById('profile-status-alert');

  if (profileTrigger) {
    profileTrigger.addEventListener('click', showProfileModal);
  }
  const topbarProfileChip = document.getElementById('topbar-profile-chip');
  if (topbarProfileChip) {
    topbarProfileChip.addEventListener('click', showProfileModal);
  }
  if (closeProfileBtn) {
    closeProfileBtn.addEventListener('click', hideProfileModal);
  }
  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', hideProfileModal);
  }
  if (profileModal) {
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) hideProfileModal();
    });
  }

  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!profileAlert) return;

      profileAlert.style.display = 'none';
      const fullName = document.getElementById('profile-name-input')?.value.trim();
      const email = document.getElementById('profile-email-input')?.value.trim();
      const phone = document.getElementById('profile-phone-input')?.value.trim();
      const currentPassword = document.getElementById('profile-current-password')?.value;
      const newPassword = document.getElementById('profile-new-password')?.value;
      const confirmPassword = document.getElementById('profile-confirm-password')?.value;

      if (!email || !phone) {
        profileAlert.className = 'portal-alert-error';
        profileAlert.textContent = 'Email and mobile number are required.';
        profileAlert.style.display = 'block';
        return;
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          profileAlert.className = 'portal-alert-error';
          profileAlert.textContent = 'New password must be at least 6 characters long.';
          profileAlert.style.display = 'block';
          return;
        }
        if (newPassword !== confirmPassword) {
          profileAlert.className = 'portal-alert-error';
          profileAlert.textContent = 'New password and confirmation do not match.';
          profileAlert.style.display = 'block';
          return;
        }
      }

      const saveBtn = document.getElementById('btn-save-profile-submit');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
      }

      try {
        const res = await apiFetch('/users/profile', {
          method: 'PATCH',
          body: {
            fullName,
            email,
            phone,
            currentPassword: currentPassword || undefined,
            newPassword: newPassword || undefined
          }
        });

        // Update active session in state & localStorage
        state.user = { ...state.user, ...res.user, email, phone, fullName };
        localStorage.setItem('sk_user', JSON.stringify(state.user));

        // Update sidebar profile card UI & Topbar profile chip
        const nameEl = document.getElementById('user-display-name');
        const emailEl = document.getElementById('user-display-email');
        const initialsEl = document.getElementById('user-avatar-initials');
        const topbarNameEl = document.getElementById('topbar-user-display-name');
        const topbarInitialsEl = document.getElementById('topbar-user-avatar-initials');

        const updatedName = state.user.fullName || 'User';
        const updatedInitials = updatedName.substring(0, 2).toUpperCase();

        if (nameEl) nameEl.textContent = updatedName;
        if (emailEl) emailEl.textContent = state.user.email;
        if (initialsEl) initialsEl.textContent = updatedInitials;
        if (topbarNameEl) topbarNameEl.textContent = updatedName;
        if (topbarInitialsEl) topbarInitialsEl.textContent = updatedInitials;

        profileAlert.className = 'portal-alert-success';
        profileAlert.textContent = '✅ Profile, contact, and password updated successfully!';
        profileAlert.style.display = 'block';

        setTimeout(() => {
          hideProfileModal();
        }, 1200);
      } catch (err) {
        profileAlert.className = 'portal-alert-error';
        profileAlert.textContent = err.message || 'Failed to update profile. Please check your credentials.';
        profileAlert.style.display = 'block';
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = '<i class="fas fa-check"></i> Save Changes';
        }
      }
    });
  }
}

function showProfileModal() {
  initPortalMount();
  const modal = document.getElementById('portal-profile-modal');
  if (!modal || !state.user) return;

  const initials = document.getElementById('modal-profile-initials');
  const roleBadge = document.getElementById('modal-profile-role-badge');
  const nameInput = document.getElementById('profile-name-input');
  const emailInput = document.getElementById('profile-email-input');
  const phoneInput = document.getElementById('profile-phone-input');
  const currentPass = document.getElementById('profile-current-password');
  const newPass = document.getElementById('profile-new-password');
  const confirmPass = document.getElementById('profile-confirm-password');
  const alertEl = document.getElementById('profile-status-alert');

  if (initials) initials.textContent = (state.user.fullName || 'User').substring(0, 2).toUpperCase();
  if (roleBadge) roleBadge.textContent = state.user.role;
  if (nameInput) nameInput.value = state.user.fullName || '';
  if (emailInput) emailInput.value = state.user.email || '';
  if (phoneInput) phoneInput.value = state.user.phone || '';

  if (currentPass) currentPass.value = '';
  if (newPass) newPass.value = '';
  if (confirmPass) confirmPass.value = '';
  if (alertEl) alertEl.style.display = 'none';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideProfileModal() {
  const modal = document.getElementById('portal-profile-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

window.showProfileModal = showProfileModal;
window.hideProfileModal = hideProfileModal;

function showAuthModal() {
  initPortalMount();
  const modal = document.getElementById('portal-auth-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function hideAuthModal() {
  const modal = document.getElementById('portal-auth-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Explicitly expose on window so inline onclick handlers and cross-module calls work seamlessly
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;

// Launch Portal Application after Authentication
async function launchPortalApp() {
  const appWrapper = document.getElementById('portal-app-wrapper');
  if (appWrapper) {
    appWrapper.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Set Profile UI
  const roleBadge = document.getElementById('user-role-badge');
  const nameEl = document.getElementById('user-display-name');
  const emailEl = document.getElementById('user-display-email');
  const initialsEl = document.getElementById('user-avatar-initials');
  const topbarNameEl = document.getElementById('topbar-user-display-name');
  const topbarInitialsEl = document.getElementById('topbar-user-avatar-initials');

  const displayName = state.user.role === 'ADMIN' ? 'SK Edits' : (state.user.fullName || 'User');
  const displayInitials = state.user.role === 'ADMIN' ? 'SK' : (state.user.fullName || 'User').substring(0, 2).toUpperCase();

  if (roleBadge) roleBadge.textContent = state.user.role;
  if (nameEl) nameEl.textContent = displayName;
  if (emailEl) emailEl.textContent = state.user.email || 'skedits@agency';
  if (initialsEl) initialsEl.textContent = displayInitials;
  if (topbarNameEl) topbarNameEl.textContent = displayName;
  if (topbarInitialsEl) topbarInitialsEl.textContent = displayInitials;

  // Floating WhatsApp icon for Client and Editor dashboards (redirects to 8074015211)
  const whatsappFloatingContainer = document.getElementById('dashboard-floating-whatsapp-container');
  if (whatsappFloatingContainer) {
    if (state.user.role === 'CLIENT' || state.user.role === 'EDITOR') {
      whatsappFloatingContainer.style.display = 'flex';
    } else {
      whatsappFloatingContainer.style.display = 'none';
    }
  }

  renderSidebarNav();
  await loadDashboardData();
  renderCurrentView();
}

function renderSidebarNav() {
  const navContainer = document.getElementById('portal-sidebar-nav');
  if (!navContainer) return;

  const role = state.user.role;
  let items = [];

  if (role === 'ADMIN') {
    items = [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-pie' },
      { id: 'projects', label: 'Projects', icon: 'fas fa-film' },
      { id: 'users', label: 'Clients & Editors', icon: 'fas fa-users' },
      { id: 'payments', label: 'Finance & Payments', icon: 'fas fa-wallet' },
      { id: 'chat', label: 'Messages', icon: 'fas fa-comments' },
      { id: 'settings', label: 'Payment Settings', icon: 'fas fa-sliders-h' }
    ];
  } else if (role === 'CLIENT') {
    items = [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
      { id: 'projects', label: 'My Projects', icon: 'fas fa-video' },
      { id: 'new-project', label: 'New Project', icon: 'fas fa-plus-circle' },
      { id: 'payments', label: 'Payments', icon: 'fas fa-credit-card' },
      { id: 'chat', label: 'Messages', icon: 'fas fa-comments' }
    ];
  } else if (role === 'EDITOR') {
    items = [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { id: 'projects', label: 'Assigned Projects', icon: 'fas fa-tasks' },
      { id: 'chat', label: 'Messages', icon: 'fas fa-comments' }
    ];
  }

  navContainer.innerHTML = items.map(item => `
    <div class="portal-nav-item ${state.activeView === item.id ? 'active' : ''}" onclick="switchPortalView('${item.id}')">
      <i class="${item.icon}"></i>
      <span>${item.label}</span>
    </div>
  `).join('');
}

window.switchPortalView = function(viewId) {
  state.activeView = viewId;
  renderSidebarNav();
  renderCurrentView();
};

async function loadDashboardData() {
  try {
    const projRes = await apiFetch('/projects');
    state.projects = projRes.projects || [];

    if (state.user.role === 'ADMIN') {
      const userRes = await apiFetch('/users');
      state.users = userRes.users || [];
      const analyticsRes = await apiFetch('/analytics/dashboard');
      state.analytics = analyticsRes.analytics || {};
    }

    const paySetRes = await apiFetch('/payments/settings');
    state.paymentSettings = paySetRes.settings || {};
  } catch (err) {
    console.log('Load dashboard error:', err);
  }
}

function renderCurrentView() {
  const content = document.getElementById('portal-main-content');
  const titleEl = document.getElementById('portal-view-title');
  if (!content) return;

  const role = state.user.role;

  if (state.activeView === 'dashboard') {
    if (titleEl) titleEl.textContent = `${role} Overview`;
    if (role === 'ADMIN') renderAdminHome(content);
    else if (role === 'CLIENT') renderClientHome(content);
    else if (role === 'EDITOR') renderEditorHome(content);
  } else if (state.activeView === 'projects') {
    if (titleEl) titleEl.textContent = 'Project Management';
    renderProjectsView(content);
  } else if (state.activeView === 'new-project') {
    if (titleEl) titleEl.textContent = 'Create New Project';
    renderNewProjectForm(content);
  } else if (state.activeView === 'users') {
    if (titleEl) titleEl.textContent = 'Client & Editor Management';
    renderUsersView(content);
  } else if (state.activeView === 'payments') {
    if (titleEl) titleEl.textContent = 'Payments & Invoices';
    renderPaymentsView(content);
  } else if (state.activeView === 'chat') {
    if (titleEl) titleEl.textContent = 'Communication Portal';
    renderChatView(content);
  } else if (state.activeView === 'settings') {
    if (titleEl) titleEl.textContent = 'Payment Gateway Switcher Settings';
    renderPaymentSettingsView(content);
  }
}

/* ==========================================================================
   1. ADMIN DASHBOARD HOME
   ========================================================================== */
function renderAdminHome(container) {
  const analytics = state.analytics || {};

  container.innerHTML = `
    <!-- Top Summary Metric Cards -->
    <div class="portal-grid-4">
      <div class="portal-metric-card">
        <div class="portal-metric-label">Total Revenue (Paid)</div>
        <div class="portal-metric-val" style="color:var(--portal-lime);">₹${(analytics.totalRevenue || 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="portal-metric-card">
        <div class="portal-metric-label">Pending Payments</div>
        <div class="portal-metric-val" style="color:#FACC15;">₹${(analytics.pendingRevenue || 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="portal-metric-card">
        <div class="portal-metric-label">Active Projects</div>
        <div class="portal-metric-val">${analytics.activeProjects || 0}</div>
      </div>
      <div class="portal-metric-card">
        <div class="portal-metric-label">Clients & Editors</div>
        <div class="portal-metric-val">${(analytics.totalClients || 0)} / ${(analytics.totalEditors || 0)}</div>
      </div>
    </div>

    <!-- Active Projects Table -->
    <div style="margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
      <h3 style="color:#fff; font-size:1.1rem; margin:0;">Active Projects</h3>
      <button class="btn btn-primary btn-sm" onclick="openCreateProjectModal()"><i class="fas fa-plus"></i> New Project</button>
    </div>

    <div class="portal-table-container">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client</th>
            <th>Assigned Editor(s)</th>
            <th>Status</th>
            <th>Drive Footage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${state.projects.length ? state.projects.map(p => `
            <tr>
              <td style="font-weight:700;">${p.name}</td>
              <td>${p.client ? p.client.fullName : 'Client'}</td>
              <td>${p.assignedEditors && p.assignedEditors.length ? p.assignedEditors.map(e => e.fullName).join(', ') : '<span style="color:var(--portal-muted);">Unassigned</span>'}</td>
              <td><span class="portal-badge portal-badge-${(p.status || 'new').toLowerCase()}">${p.status}</span></td>
              <td>${p.footageUrl ? `<a href="${p.footageUrl}" target="_blank" style="color:var(--portal-lime);"><i class="fab fa-google-drive"></i> Open Drive</a>` : 'N/A'}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="openAssignEditorModal('${p.id}')"><i class="fas fa-user-plus"></i> Assign</button>
              </td>
            </tr>
          `).join('') : '<tr><td colspan="6" style="text-align:center; color:var(--portal-muted);">No projects found.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

/* ==========================================================================
   2. CLIENT DASHBOARD HOME
   ========================================================================== */
function renderClientHome(container) {
  const activeCount = state.projects.filter(p => p.status !== 'Completed').length;
  const completedCount = state.projects.filter(p => p.status === 'Completed').length;

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <div>
        <h2 style="font-size:1.5rem; font-weight:800; color:#fff;">Welcome back, ${state.user.fullName} 👋</h2>
        <p style="color:var(--portal-subtext); font-size:0.9rem;">Track your high-retention video projects, revisions, and deliverables.</p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="window.showProfileModal()" title="Edit Profile, Mobile & Password">
        <i class="fas fa-user-pen" style="color:var(--portal-lime); margin-right:6px;"></i> Edit Profile & Password
      </button>
    </div>

    <div class="portal-grid-4">
      <div class="portal-metric-card">
        <div class="portal-metric-label">Active Projects</div>
        <div class="portal-metric-val" style="color:var(--portal-lime);">${activeCount}</div>
      </div>
      <div class="portal-metric-card">
        <div class="portal-metric-label">Completed Projects</div>
        <div class="portal-metric-val">${completedCount}</div>
      </div>
      <div class="portal-metric-card">
        <div class="portal-metric-label">Total Reels Target</div>
        <div class="portal-metric-val">${state.projects.reduce((acc, p) => acc + (p.reelCount || 13), 0)}</div>
      </div>
      <div class="portal-metric-card">
        <div class="portal-metric-label">SK Edits Offer Rate</div>
        <div class="portal-metric-val" style="color:var(--portal-lime);">₹499*</div>
      </div>
    </div>

    <div class="portal-table-container">
      <div style="padding:16px 20px; border-bottom:1px solid var(--portal-border); font-weight:700; color:#fff;">My Editing Projects</div>
      <table class="portal-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Assigned Editor</th>
            <th>Status</th>
            <th>Deliverable Video</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.projects.length ? state.projects.map(p => `
            <tr>
              <td style="font-weight:700;">${p.name}</td>
              <td>${p.assignedEditors && p.assignedEditors.length ? p.assignedEditors[0].fullName : 'SK Edits Team'}</td>
              <td><span class="portal-badge portal-badge-${(p.status || 'new').toLowerCase()}">${p.status}</span></td>
              <td>${p.deliverableUrl ? `<a href="${p.deliverableUrl}" target="_blank" style="color:var(--portal-lime); font-weight:700;"><i class="fas fa-play-circle"></i> View Output Drive</a>` : '<span style="color:var(--portal-muted);">In Progress</span>'}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="openRevisionModal('${p.id}')"><i class="fas fa-edit"></i> Request Revision</button>
                ${p.status !== 'Approved' && p.status !== 'Completed' ? `<button class="btn btn-primary btn-sm" style="margin-left:6px;" onclick="approveProject('${p.id}')"><i class="fas fa-check"></i> Approve</button>` : ''}
              </td>
            </tr>
          `).join('') : '<tr><td colspan="5" style="text-align:center; color:var(--portal-muted);">No projects yet. Click "New Project" to start!</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

/* ==========================================================================
   3. EDITOR DASHBOARD HOME
   ========================================================================== */
function renderEditorHome(container) {
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <div>
        <h2 style="font-size:1.5rem; font-weight:800; color:#fff;">Welcome back, ${state.user.fullName} 🎬</h2>
        <p style="color:var(--portal-subtext); font-size:0.9rem;">Assigned editing projects and Google Drive raw footage links.</p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="window.showProfileModal()" title="Edit Profile, Mobile & Password">
        <i class="fas fa-user-pen" style="color:var(--portal-lime); margin-right:6px;"></i> Edit Profile & Password
      </button>
    </div>

    <div class="portal-table-container">
      <div style="padding:16px 20px; border-bottom:1px solid var(--portal-border); font-weight:700; color:#fff;">Assigned Projects</div>
      <table class="portal-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client Name</th>
            <th>Raw Footage Link</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.projects.length ? state.projects.map(p => `
            <tr>
              <td style="font-weight:700;">${p.name}</td>
              <td>${p.client ? p.client.fullName : 'Client'}</td>
              <td>${p.footageUrl ? `<a href="${p.footageUrl}" target="_blank" style="color:var(--portal-lime);"><i class="fab fa-google-drive"></i> Open Raw Footage</a>` : 'No Link'}</td>
              <td><span class="portal-badge portal-badge-${(p.status || 'new').toLowerCase()}">${p.status}</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="openSubmitDeliverableModal('${p.id}')"><i class="fas fa-upload"></i> Submit Output Link</button>
              </td>
            </tr>
          `).join('') : '<tr><td colspan="5" style="text-align:center; color:var(--portal-muted);">No assigned projects currently.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

/* ==========================================================================
   4. NEW PROJECT FORM (CLIENT ONLY - GOOGLE DRIVE LINK)
   ========================================================================== */
function renderNewProjectForm(container) {
  container.innerHTML = `
    <div class="portal-auth-card" style="max-width:650px; margin:0 auto;">
      <h3 style="color:#fff; font-size:1.3rem; margin-bottom:16px;">Submit New Editing Project</h3>
      <form id="form-create-project">
        <div class="portal-form-group">
          <label class="portal-form-label">Project Name</label>
          <input type="text" id="new-proj-name" class="portal-input" placeholder="e.g. 15 Executive Reels - Batch #1" required />
        </div>
        <div class="portal-form-group">
          <label class="portal-form-label">Package Type</label>
          <select id="new-proj-type" class="portal-input">
            <option value="Starter Pack (₹499*)">Starter Pack (₹499*/reel)</option>
            <option value="Growth Coach Pack (₹999*)">Growth Coach Pack (₹999*/reel)</option>
            <option value="Premium Pack (₹1499*)">Premium Pack (₹1499*/reel)</option>
          </select>
        </div>
        <div class="portal-form-group">
          <label class="portal-form-label">Google Drive Raw Footage Link <span style="color:var(--portal-lime); font-size:0.75rem;">(Required)</span></label>
          <input type="url" id="new-proj-footage" class="portal-input" placeholder="https://drive.google.com/drive/folders/..." required />
          <div style="font-size:0.75rem; color:var(--portal-subtext); margin-top:4px;">
            <i class="fas fa-info-circle"></i> Direct video uploads are disabled. Please paste your Google Drive or Cloud storage link.
          </div>
        </div>
        <div class="portal-form-group">
          <label class="portal-form-label">Reels / Videos Count</label>
          <input type="number" id="new-proj-reels" class="portal-input" value="13" min="1" max="50" required />
        </div>
        <div class="portal-form-group">
          <label class="portal-form-label">Editing Style & Brief Notes</label>
          <textarea id="new-proj-notes" class="portal-input" rows="4" placeholder="Mention caption style, hook preferences, and reference video links..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">
          <i class="fas fa-paper-plane"></i> Create Project
        </button>
      </form>
    </div>
  `;

  document.getElementById('form-create-project')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/projects', {
        method: 'POST',
        body: {
          name: document.getElementById('new-proj-name').value,
          type: document.getElementById('new-proj-type').value,
          footageUrl: document.getElementById('new-proj-footage').value,
          reelCount: parseInt(document.getElementById('new-proj-reels').value, 10),
          notes: document.getElementById('new-proj-notes').value
        }
      });
      playNotificationChime();
      alert('Project created successfully!');
      state.activeView = 'projects';
      await loadDashboardData();
      renderCurrentView();
    } catch (err) {
      alert(err.message || 'Error creating project.');
    }
  });
}

/* ==========================================================================
   5. DYNAMIC PAYMENT GATEWAY SWITCHER SETTINGS (ADMIN ONLY)
   ========================================================================== */
function renderPaymentSettingsView(container) {
  const set = state.paymentSettings || {};

  container.innerHTML = `
    <div class="portal-auth-card" style="max-width:650px; margin:0 auto;">
      <h3 style="color:#fff; font-size:1.3rem; margin-bottom:8px;">Dynamic Payment Gateway Switcher</h3>
      <p style="color:var(--portal-subtext); font-size:0.85rem; margin-bottom:20px;">
        Switch the active payment gateway for the website between Razorpay, PhonePe, Cashfree, and Manual UPI.
      </p>

      <form id="form-payment-settings">
        <div class="portal-form-group">
          <label class="portal-form-label">Active Gateway Provider</label>
          <select id="set-active-gateway" class="portal-input" style="font-weight:700; color:var(--portal-lime);">
            <option value="Razorpay" ${set.activeGateway === 'Razorpay' ? 'selected' : ''}>Razorpay (Cards, Netbanking, UPI)</option>
            <option value="PhonePe" ${set.activeGateway === 'PhonePe' ? 'selected' : ''}>PhonePe Payment Gateway</option>
            <option value="Cashfree" ${set.activeGateway === 'Cashfree' ? 'selected' : ''}>Cashfree Payments</option>
            <option value="Manual UPI" ${set.activeGateway === 'Manual UPI' ? 'selected' : ''}>Manual UPI / Direct QR Code</option>
          </select>
        </div>

        <div class="portal-form-group">
          <label class="portal-form-label">Razorpay Key ID</label>
          <input type="text" id="set-razorpay-key" class="portal-input" value="${set.razorpayKeyId || ''}" placeholder="rzp_live_..." />
        </div>

        <div class="portal-form-group">
          <label class="portal-form-label">PhonePe Merchant ID</label>
          <input type="text" id="set-phonepe-id" class="portal-input" value="${set.phonepeMerchantId || ''}" placeholder="MERCHANTUAT" />
        </div>

        <div class="portal-form-group">
          <label class="portal-form-label">Cashfree App ID</label>
          <input type="text" id="set-cashfree-id" class="portal-input" value="${set.cashfreeAppId || ''}" placeholder="CF_APP_..." />
        </div>

        <div class="portal-form-group">
          <label class="portal-form-label">UPI ID (e.g. skedits@upi)</label>
          <input type="text" id="set-upi-id" class="portal-input" value="${set.upiId || 'skedits@upi'}" />
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">
          <i class="fas fa-save"></i> Save & Switch Gateway Settings
        </button>
      </form>
    </div>
  `;

  document.getElementById('form-payment-settings')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/payments/settings', {
        method: 'PATCH',
        body: {
          activeGateway: document.getElementById('set-active-gateway').value,
          razorpayKeyId: document.getElementById('set-razorpay-key').value,
          phonepeMerchantId: document.getElementById('set-phonepe-id').value,
          cashfreeAppId: document.getElementById('set-cashfree-id').value,
          upiId: document.getElementById('set-upi-id').value
        }
      });
      playNotificationChime();
      alert(res.message || 'Payment settings updated!');
      state.paymentSettings = res.settings;
    } catch (err) {
      alert(err.message || 'Error updating payment settings.');
    }
  });
}

/* ==========================================================================
   6. REALTIME CHAT & PRIVACY FILTER
   ========================================================================== */
function renderChatView(container) {
  container.innerHTML = `
    <div class="portal-chat-window">
      <div class="portal-chat-sidebar">
        <div style="padding:14px; border-bottom:1px solid var(--portal-border); font-weight:700; color:#fff;">Conversations</div>
        <div id="chat-conv-list">
          <div style="padding:16px; color:var(--portal-subtext); text-align:center;">Loading chats...</div>
        </div>
      </div>
      <div class="portal-chat-main">
        <div style="padding:14px 20px; border-bottom:1px solid var(--portal-border); font-weight:700; color:#fff;" id="chat-active-header">
          Select a conversation
        </div>
        <div class="portal-chat-messages" id="chat-messages-container">
          <div style="color:var(--portal-subtext); margin:auto;">Select a project or general chat to view messages.</div>
        </div>
        <div class="portal-chat-input-bar">
          <input type="text" id="chat-text-input" class="portal-input" placeholder="Type message... (Contact info exchange is strictly blocked)" />
          <button class="btn btn-primary" id="btn-send-chat"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  `;

  loadChatConversations();

  document.getElementById('btn-send-chat')?.addEventListener('click', sendChatMessage);
  document.getElementById('chat-text-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

async function loadChatConversations() {
  try {
    const res = await apiFetch('/chat/conversations');
    state.conversations = res.conversations || [];

    const listEl = document.getElementById('chat-conv-list');
    if (!listEl) return;

    if (!state.conversations.length) {
      listEl.innerHTML = '<div style="padding:16px; color:var(--portal-subtext); text-align:center;">No conversations found.</div>';
      return;
    }

    listEl.innerHTML = state.conversations.map(c => `
      <div style="padding:12px 16px; border-bottom:1px solid var(--portal-border); cursor:pointer; background:${state.activeConversationId === c.id ? 'rgba(204,255,0,0.1)' : 'transparent'};" onclick="openConversation('${c.id}')">
        <div style="font-weight:700; color:#fff; font-size:0.88rem;">${c.title}</div>
        <div style="font-size:0.75rem; color:var(--portal-subtext); margin-top:2px;">${c.projectName}</div>
      </div>
    `).join('');
  } catch (err) {
    console.log('Load chats error:', err);
  }
}

window.openConversation = async function(convId) {
  state.activeConversationId = convId;
  loadChatConversations();

  const headerEl = document.getElementById('chat-active-header');
  const msgContainer = document.getElementById('chat-messages-container');

  try {
    const res = await apiFetch(`/chat/conversations/${convId}/messages`);
    state.messages = res.messages || [];

    const activeConv = state.conversations.find(c => c.id === convId);
    if (headerEl && activeConv) headerEl.textContent = activeConv.title;

    if (msgContainer) {
      msgContainer.innerHTML = state.messages.map(m => {
        const isMine = m.senderId === state.user.id;
        const senderName = m.sender ? m.sender.fullName : 'User';
        return `
          <div class="portal-msg-bubble ${isMine ? 'portal-msg-mine' : 'portal-msg-other'}">
            <div style="font-size:0.72rem; font-weight:700; margin-bottom:4px; opacity:0.8;">${senderName}</div>
            <div>${m.content}</div>
          </div>
        `;
      }).join('');
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  } catch (err) {
    alert(err.message || 'Error opening chat.');
  }
};

async function sendChatMessage() {
  const input = document.getElementById('chat-text-input');
  if (!input || !input.value.trim() || !state.activeConversationId) return;

  const content = input.value.trim();

  try {
    const res = await apiFetch(`/chat/conversations/${state.activeConversationId}/messages`, {
      method: 'POST',
      body: { content }
    });

    input.value = '';
    playNotificationChime();
    openConversation(state.activeConversationId);
  } catch (err) {
    alert(err.message || 'Message blocked for privacy rules.');
  }
}

// Global modal triggers
window.openAssignEditorModal = async function(projId) {
  const editorIds = prompt('Enter Editor User ID(s) to assign (comma separated):');
  if (!editorIds) return;
  const arr = editorIds.split(',').map(s => s.trim()).filter(Boolean);
  try {
    await apiFetch(`/projects/${projId}/assign`, {
      method: 'POST',
      body: { editorIds: arr }
    });
    alert('Editors assigned!');
    await loadDashboardData();
    renderCurrentView();
  } catch (err) {
    alert(err.message || 'Error assigning editors.');
  }
};

window.openRevisionModal = async function(projId) {
  const desc = prompt('Describe the revision needed for this project:');
  if (!desc) return;
  try {
    await apiFetch(`/projects/${projId}/revisions`, {
      method: 'POST',
      body: { description: desc }
    });
    alert('Revision request submitted!');
    await loadDashboardData();
    renderCurrentView();
  } catch (err) {
    alert(err.message || 'Error requesting revision.');
  }
};

window.approveProject = async function(projId) {
  if (!confirm('Are you sure you want to approve this project?')) return;
  try {
    await apiFetch(`/projects/${projId}/status`, {
      method: 'PATCH',
      body: { status: 'Approved' }
    });
    alert('Project approved!');
    await loadDashboardData();
    renderCurrentView();
  } catch (err) {
    alert(err.message || 'Error approving project.');
  }
};

window.openSubmitDeliverableModal = async function(projId) {
  const url = prompt('Enter Google Drive Deliverable Link:');
  if (!url) return;
  try {
    await apiFetch(`/projects/${projId}/status`, {
      method: 'PATCH',
      body: { deliverableUrl: url, status: 'Client Review' }
    });
    alert('Deliverable link submitted!');
    await loadDashboardData();
    renderCurrentView();
  } catch (err) {
    alert(err.message || 'Error submitting deliverable.');
  }
};

// Render remaining views (Users, Payments, Projects)
function renderProjectsView(container) { renderAdminHome(container); }
function renderUsersView(container) {
  container.innerHTML = `
    <div class="portal-table-container">
      <div style="padding:16px 20px; border-bottom:1px solid var(--portal-border); font-weight:700; color:#fff;">Clients & Editors Directory</div>
      <table class="portal-table">
        <thead>
          <tr><th>Full Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${state.users.map(u => `
            <tr>
              <td style="font-weight:700;">${u.fullName}</td>
              <td><span class="portal-badge portal-badge-${u.role === 'ADMIN' ? 'approved' : 'assigned'}">${u.role}</span></td>
              <td>${u.email || 'N/A'}</td>
              <td>${u.phone || 'N/A'}</td>
              <td>${u.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPaymentsView(container) {
  container.innerHTML = `
    <div class="portal-table-container">
      <div style="padding:16px 20px; border-bottom:1px solid var(--portal-border); font-weight:700; color:#fff;">Payment Transactions</div>
      <div style="padding:20px; color:var(--portal-subtext);">
        Active Gateway Provider: <strong style="color:var(--portal-lime);">${state.paymentSettings?.activeGateway || 'Razorpay'}</strong>
        <br/>UPI ID: <code>${state.paymentSettings?.upiId || 'skedits@upi'}</code>
      </div>
    </div>
  `;
}
