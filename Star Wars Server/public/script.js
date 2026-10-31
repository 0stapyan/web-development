document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const content = document.getElementById('content');
  const loginError = document.getElementById('login-error');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const list = document.getElementById('list');

  const API_BASE = '/api';
  const AUTH_ENDPOINT = '/auth';

  const token = localStorage.getItem('token');
  if (token) {
    showContent();
  } else {
    showLoginForm();
  }

  function showContent() {
    loginForm.style.display = 'none';
    logoutBtn.style.display = 'block';
    content.style.display = 'block';
    fetchPlanets();
  }

  function showLoginForm() {
    loginForm.style.display = 'block';
    logoutBtn.style.display = 'none';
    content.style.display = 'none';
  }

  async function fetchPlanets() {
    try {
      const response = await fetch(`${API_BASE}/planets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch planets');

      const planets = await response.json();
      list.innerHTML = planets
        .map((planet) => `<li>${planet.name}</li>`)
        .join('');
    } catch (error) {
      console.error(error);
      alert('Failed to fetch planets.');
    }
  }

  loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const response = await fetch(AUTH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        loginError.textContent = 'Invalid username or password.';
        return;
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      showContent();
    } catch (error) {
      console.error(error);
      loginError.textContent = 'An error occurred during login.';
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showLoginForm();
  });
});
