const loginForm = document.getElementById('loginForm')
const loginError = document.getElementById('loginError')

const token = localStorage.getItem('adminToken')

if (token) {
  window.location.href = 'dashboard.html'
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  loginError.textContent = ''

  const formData = new FormData(loginForm)

  const payload = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  try {
    const response = await fetch(`${window.ADMIN_API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Помилка авторизації')
    }

    localStorage.setItem('adminToken', data.token)
    localStorage.setItem('adminUser', JSON.stringify(data.user))

    window.location.href = 'dashboard.html'
  } catch (error) {
    loginError.textContent = error.message
  }
})