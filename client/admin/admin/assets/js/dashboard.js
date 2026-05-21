const token = localStorage.getItem('adminToken')
const adminUser = JSON.parse(
  localStorage.getItem('adminUser')
)

if (!token) {
  window.location.href = 'login.html'
}

const logoutButton =
  document.getElementById('logoutButton')

const adminUserEmail =
  document.getElementById('adminUserEmail')

adminUserEmail.textContent = adminUser?.email || ''

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')

  window.location.href = 'login.html'
})

const sidebarLinks = document.querySelectorAll(
  '.admin-sidebar__link'
)

const sections = document.querySelectorAll(
  '.admin-section'
)

sidebarLinks.forEach((button) => {
  button.addEventListener('click', () => {
    sidebarLinks.forEach((item) => {
      item.classList.remove('active')
    })

    sections.forEach((section) => {
      section.classList.remove('active')
    })

    button.classList.add('active')

    const sectionName =
      button.dataset.section

    const targetSection =
      document.getElementById(
        `${sectionName}Section`
      )

    if (targetSection) {
      targetSection.classList.add('active')
    }
  })
})

async function loadDashboardStats() {
  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/admin/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to load dashboard data')
    }

    const data = await response.json()

    document.getElementById(
      'newAppointmentsCount'
    ).textContent =
      data.newAppointmentsCount

    document.getElementById(
      'todayAppointmentsCount'
    ).textContent =
      data.todayAppointmentsCount

    document.getElementById(
      'patientsCount'
    ).textContent =
      data.patientsCount

    document.getElementById(
      'contactRequestsCount'
    ).textContent =
      data.contactRequestsCount

      document.getElementById(
        'phoneLeadsCount'
      ).textContent =
        data.phoneLeadsCount || 0

  } catch (error) {
    console.error(error)
  }
}

loadDashboardStats()

async function loadCategories() {
  const tableBody = document.getElementById('categoriesTableBody')

  if (!tableBody) return

  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/service-categories/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити категорії')
    }

    tableBody.innerHTML = data.map((category) => {
      return `
        <tr>
          <td>${category.title}</td>
          <td>${category.slug}</td>
          <td>${category.description || '—'}</td>
          <td>${category._count?.services || 0}</td>
          <td>
            <span class="admin-status ${category.isActive ? 'admin-status--active' : 'admin-status--inactive'}">
              ${category.isActive ? 'Активна' : 'Прихована'}
            </span>
          </td>
          <td>
            <div class="admin-table-actions">
              <button class="admin-button admin-button--small admin-button--secondary">
                Редагувати
              </button>
              <button class="admin-button admin-button--small admin-button--danger">
                Видалити
              </button>
            </div>
          </td>
        </tr>
      `
    }).join('')
  } catch (error) {
    console.error(error)
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">${error.message}</td>
      </tr>
    `
  }
}

loadCategories()

let categoriesCache = []

async function loadCategories() {
  const tableBody = document.getElementById('categoriesTableBody')

  if (!tableBody) return

  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/service-categories/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити категорії')
    }

    categoriesCache = data

    tableBody.innerHTML = data.map((category) => {
      return `
        <tr>
          <td>${category.title}</td>
          <td>${category.slug}</td>
          <td>${category.description || '—'}</td>
          <td>${category._count?.services || 0}</td>
          <td>
            <span class="admin-status ${category.isActive ? 'admin-status--active' : 'admin-status--inactive'}">
              ${category.isActive ? 'Активна' : 'Прихована'}
            </span>
          </td>
          <td>
            <div class="admin-table-actions">
              <button
                class="admin-button admin-button--small admin-button--secondary"
                type="button"
                data-edit-category="${category.id}"
              >
                Редагувати
              </button>

              <button
                class="admin-button admin-button--small admin-button--secondary"
                type="button"
                data-toggle-category="${category.id}"
              >
                ${category.isActive ? 'Приховати' : 'Активувати'}
              </button>

              <button
                class="admin-button admin-button--small admin-button--danger"
                type="button"
                data-delete-category="${category.id}"
              >
                Видалити
              </button>
            </div>
          </td>
        </tr>
      `
    }).join('')
  } catch (error) {
    console.error(error)
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">${error.message}</td>
      </tr>
    `
  }
}

const categoryModal = document.getElementById('categoryModal')
const categoryForm = document.getElementById('categoryForm')
const addCategoryButton = document.getElementById('addCategoryButton')
const categoryModalTitle = document.getElementById('categoryModalTitle')

function openCategoryModal(category = null) {
  categoryForm.reset()

  document.getElementById('categoryId').value = category?.id || ''
  document.getElementById('categoryTitle').value = category?.title || ''
  document.getElementById('categorySlug').value = category?.slug || ''
  document.getElementById('categoryDescription').value = category?.description || ''
  document.getElementById('categorySortOrder').value = category?.sortOrder || 0

  categoryModalTitle.textContent = category
    ? 'Редагування категорії'
    : 'Нова категорія'

  categoryModal.classList.add('active')
}

function closeCategoryModal() {
  categoryModal.classList.remove('active')
}

addCategoryButton?.addEventListener('click', () => {
  openCategoryModal()
})

document.addEventListener('click', async (event) => {
  const closeElement = event.target.closest('[data-close-modal]')

  if (closeElement) {
    closeCategoryModal()
  }

  const editButton = event.target.closest('[data-edit-category]')

  if (editButton) {
    const categoryId = editButton.dataset.editCategory
    const category = categoriesCache.find((item) => item.id === categoryId)

    if (category) {
      openCategoryModal(category)
    }
  }

  const toggleButton = event.target.closest('[data-toggle-category]')

  if (toggleButton) {
    const categoryId = toggleButton.dataset.toggleCategory

    await fetch(
      `${window.ADMIN_API_BASE_URL}/api/service-categories/admin/status/${categoryId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    loadCategories()
    loadDashboardStats()
  }

  const deleteButton = event.target.closest('[data-delete-category]')

  if (deleteButton) {
    const categoryId = deleteButton.dataset.deleteCategory

    const isConfirmed = confirm('Видалити категорію?')

    if (!isConfirmed) return

    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/service-categories/admin/delete/${categoryId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Не вдалося видалити категорію')
      return
    }

    loadCategories()
    loadDashboardStats()
  }
})

categoryForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(categoryForm)

  const categoryId = formData.get('id')

  const payload = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    sortOrder: Number(formData.get('sortOrder')),
  }

  const url = categoryId
    ? `${window.ADMIN_API_BASE_URL}/api/service-categories/admin/update/${categoryId}`
    : `${window.ADMIN_API_BASE_URL}/api/service-categories/admin/create`

  const method = categoryId ? 'PUT' : 'POST'

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося зберегти категорію')
    return
  }

  closeCategoryModal()
  loadCategories()
  loadDashboardStats()
})

let servicesCache = []

async function loadServices() {
  const tableBody = document.getElementById('servicesTableBody')

  if (!tableBody) return

  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/services/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити послуги')
    }

    servicesCache = data

    tableBody.innerHTML = data.map((service) => {
      return `
        <tr>
          <td>${service.title}</td>
          <td>${service.category?.title || '—'}</td>
          <td>${service.price ? `${service.price} грн` : '—'}</td>
          <td>${service.duration} хв</td>
          <td>
            <span class="admin-status ${service.isActive ? 'admin-status--active' : 'admin-status--inactive'}">
              ${service.isActive ? 'Активна' : 'Прихована'}
            </span>
          </td>
          <td>
            <div class="admin-table-actions">
              <button
                class="admin-button admin-button--small admin-button--secondary"
                type="button"
                data-edit-service="${service.id}"
              >
                Редагувати
              </button>

              <button
                class="admin-button admin-button--small admin-button--secondary"
                type="button"
                data-toggle-service="${service.id}"
              >
                ${service.isActive ? 'Приховати' : 'Активувати'}
              </button>

              <button
                class="admin-button admin-button--small admin-button--danger"
                type="button"
                data-delete-service="${service.id}"
              >
                Видалити
              </button>
            </div>
          </td>
        </tr>
      `
    }).join('')
  } catch (error) {
    console.error(error)

    tableBody.innerHTML = `
      <tr>
        <td colspan="6">${error.message}</td>
      </tr>
    `
  }
}

function fillServiceCategorySelect(selectedCategoryId = '') {
  const select = document.getElementById('serviceCategoryId')

  if (!select) return

  select.innerHTML = categoriesCache.map((category) => {
    return `
      <option value="${category.id}" ${category.id === selectedCategoryId ? 'selected' : ''}>
        ${category.title}
      </option>
    `
  }).join('')
}

const serviceModal = document.getElementById('serviceModal')
const serviceForm = document.getElementById('serviceForm')
const addServiceButton = document.getElementById('addServiceButton')
const serviceModalTitle = document.getElementById('serviceModalTitle')

function openServiceModal(service = null) {
  serviceForm.reset()

  fillServiceCategorySelect(service?.categoryId || '')

  document.getElementById('serviceId').value = service?.id || ''
  document.getElementById('serviceTitle').value = service?.title || ''
  document.getElementById('serviceSlug').value = service?.slug || ''
  document.getElementById('serviceShortDesc').value = service?.shortDesc || ''
  document.getElementById('serviceFullDesc').value = service?.fullDesc || ''
  document.getElementById('servicePrice').value = service?.price || ''
  document.getElementById('serviceDuration').value = service?.duration || ''
  document.getElementById('serviceBadge').value = service?.badge || ''
  document.getElementById('serviceImage').value = service?.image || ''
  document.getElementById('serviceSortOrder').value = service?.sortOrder || 0

  serviceModalTitle.textContent = service
    ? 'Редагування послуги'
    : 'Нова послуга'

  serviceModal.classList.add('active')

  document.getElementById('serviceIndications').value = service?.indications
    ? service.indications.map((item) => item.text).join('\n')
    : ''

  document.getElementById('serviceIncluded').value = service?.included
    ? service.included.map((item) => item.text).join('\n')
    : ''

  document.getElementById('serviceSteps').value = service?.steps
    ? service.steps.map((item) => `${item.title} | ${item.text}`).join('\n')
    : ''

  document.getElementById('serviceFaqs').value = service?.faqs
    ? service.faqs.map((item) => `${item.question} | ${item.answer}`).join('\n')
    : ''
}

function closeServiceModal() {
  serviceModal.classList.remove('active')
}

addServiceButton?.addEventListener('click', () => {
  openServiceModal()
})

document.addEventListener('click', async (event) => {
  const closeServiceElement = event.target.closest('[data-close-service-modal]')

  if (closeServiceElement) {
    closeServiceModal()
  }

  const editServiceButton = event.target.closest('[data-edit-service]')

  if (editServiceButton) {
    const serviceId = editServiceButton.dataset.editService
    const service = servicesCache.find((item) => item.id === serviceId)

    if (service) {
      openServiceModal(service)
    }
  }

  const toggleServiceButton = event.target.closest('[data-toggle-service]')

  if (toggleServiceButton) {
    const serviceId = toggleServiceButton.dataset.toggleService

    await fetch(
      `${window.ADMIN_API_BASE_URL}/api/services/admin/status/${serviceId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    loadServices()
    loadDashboardStats()
  }

  const deleteServiceButton = event.target.closest('[data-delete-service]')

  if (deleteServiceButton) {
    const serviceId = deleteServiceButton.dataset.deleteService

    const isConfirmed = confirm('Видалити послугу?')

    if (!isConfirmed) return

    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/services/admin/delete/${serviceId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Не вдалося видалити послугу')
      return
    }

    loadServices()
    loadDashboardStats()
  }
})

serviceForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(serviceForm)

  const serviceId = formData.get('id')

  const payload = {
    categoryId: formData.get('categoryId'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    shortDesc: formData.get('shortDesc'),
    fullDesc: formData.get('fullDesc'),
    price: formData.get('price') || null,
    duration: Number(formData.get('duration')),
    badge: formData.get('badge'),
    image: formData.get('image'),
    sortOrder: Number(formData.get('sortOrder')),
    indications: formData.get('indications'),
    included: formData.get('included'),
    steps: formData.get('steps'),
    faqs: formData.get('faqs'),
  }

  const url = serviceId
    ? `${window.ADMIN_API_BASE_URL}/api/services/admin/update/${serviceId}`
    : `${window.ADMIN_API_BASE_URL}/api/services/admin/create`

  const method = serviceId ? 'PUT' : 'POST'

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося зберегти послугу')
    return
  }

  closeServiceModal()
  loadServices()
  loadDashboardStats()
})

loadServices()

let doctorsCache = []

async function loadDoctors() {
  const tableBody = document.getElementById('doctorsTableBody')

  if (!tableBody) return

  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/doctors/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити лікарів')
    }

    doctorsCache = data

    tableBody.innerHTML = data.map((doctor) => {
      const services = doctor.services
        ?.map((item) => item.service?.title)
        .filter(Boolean)
        .join(', ')

      return `
        <tr>
          <td>${doctor.firstName} ${doctor.lastName}</td>
          <td>${doctor.position}</td>
          <td>${doctor.experience ? `${doctor.experience} р.` : '—'}</td>
          <td>${services || '—'}</td>
          <td>
            <span class="admin-status ${doctor.isActive ? 'admin-status--active' : 'admin-status--inactive'}">
              ${doctor.isActive ? 'Активний' : 'Прихований'}
            </span>
          </td>
          <td>
            <div class="admin-table-actions">
              <button
                class="admin-button admin-button--small admin-button--secondary"
                type="button"
                data-edit-doctor="${doctor.id}"
              >
                Редагувати
              </button>

              <button
                class="admin-button admin-button--small admin-button--secondary"
                type="button"
                data-schedule-doctor="${doctor.id}"
                >
                Графік
                </button>

              <button
                class="admin-button admin-button--small admin-button--secondary"
                type="button"
                data-toggle-doctor="${doctor.id}"
              >
                ${doctor.isActive ? 'Приховати' : 'Активувати'}
              </button>

              <button
                class="admin-button admin-button--small admin-button--danger"
                type="button"
                data-delete-doctor="${doctor.id}"
              >
                Видалити
              </button>
            </div>
          </td>
        </tr>
      `
    }).join('')
  } catch (error) {
    console.error(error)

    tableBody.innerHTML = `
      <tr>
        <td colspan="6">${error.message}</td>
      </tr>
    `
  }
}

function fillDoctorServicesSelect(selectedIds = []) {
  const select = document.getElementById('doctorServiceIds')

  if (!select) return

  select.innerHTML = servicesCache.map((service) => {
    return `
      <option value="${service.id}" ${selectedIds.includes(service.id) ? 'selected' : ''}>
        ${service.title}
      </option>
    `
  }).join('')
}

const doctorModal = document.getElementById('doctorModal')
const doctorForm = document.getElementById('doctorForm')
const addDoctorButton = document.getElementById('addDoctorButton')
const doctorModalTitle = document.getElementById('doctorModalTitle')

function openDoctorModal(doctor = null) {
  doctorForm.reset()

  const selectedServiceIds = doctor?.services
    ?.map((item) => item.serviceId) || []

  fillDoctorServicesSelect(selectedServiceIds)

  document.getElementById('doctorId').value = doctor?.id || ''
  document.getElementById('doctorFirstName').value = doctor?.firstName || ''
  document.getElementById('doctorLastName').value = doctor?.lastName || ''
  document.getElementById('doctorSlug').value = doctor?.slug || ''
  document.getElementById('doctorPosition').value = doctor?.position || ''
  document.getElementById('doctorExperience').value = doctor?.experience || ''
  document.getElementById('doctorEducation').value = doctor?.education || ''
  document.getElementById('doctorDescription').value = doctor?.description || ''
  document.getElementById('doctorImage').value = doctor?.image || ''
  document.getElementById('doctorSortOrder').value = doctor?.sortOrder || 0
  document.getElementById('doctorCertificates').value = doctor?.certificates || ''

  doctorModalTitle.textContent = doctor
    ? 'Редагування лікаря'
    : 'Новий лікар'

  doctorModal.classList.add('active')
}

function closeDoctorModal() {
  doctorModal.classList.remove('active')
}

addDoctorButton?.addEventListener('click', () => {
  openDoctorModal()
})

document.addEventListener('click', async (event) => {
  const closeDoctorElement = event.target.closest('[data-close-doctor-modal]')

  if (closeDoctorElement) {
    closeDoctorModal()
  }

  const editDoctorButton = event.target.closest('[data-edit-doctor]')

  if (editDoctorButton) {
    const doctorId = editDoctorButton.dataset.editDoctor
    const doctor = doctorsCache.find((item) => item.id === doctorId)

    if (doctor) {
      openDoctorModal(doctor)
    }
  }

  const toggleDoctorButton = event.target.closest('[data-toggle-doctor]')

  if (toggleDoctorButton) {
    const doctorId = toggleDoctorButton.dataset.toggleDoctor

    await fetch(
      `${window.ADMIN_API_BASE_URL}/api/doctors/admin/status/${doctorId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    loadDoctors()
    loadDashboardStats()
  }

  const deleteDoctorButton = event.target.closest('[data-delete-doctor]')

  if (deleteDoctorButton) {
    const doctorId = deleteDoctorButton.dataset.deleteDoctor

    const isConfirmed = confirm('Видалити лікаря?')

    if (!isConfirmed) return

    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/doctors/admin/delete/${doctorId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Не вдалося видалити лікаря')
      return
    }

    loadDoctors()
    loadDashboardStats()
  }
})

doctorForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(doctorForm)
  const doctorId = formData.get('id')

  const selectedServiceIds = Array.from(
    document.getElementById('doctorServiceIds').selectedOptions
  ).map((option) => option.value)

  const payload = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    slug: formData.get('slug'),
    position: formData.get('position'),
    experience: formData.get('experience') || null,
    education: formData.get('education'),
    description: formData.get('description'),
    image: formData.get('image'),
    sortOrder: Number(formData.get('sortOrder')),
    serviceIds: selectedServiceIds,
    certificates: formData.get('certificates'),
  }

  const url = doctorId
    ? `${window.ADMIN_API_BASE_URL}/api/doctors/admin/update/${doctorId}`
    : `${window.ADMIN_API_BASE_URL}/api/doctors/admin/create`

  const method = doctorId ? 'PUT' : 'POST'

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося зберегти лікаря')
    return
  }

  closeDoctorModal()
  loadDoctors()
  loadDashboardStats()
})

loadDoctors()

let currentScheduleDoctorId = null
let currentScheduleItems = []

const scheduleModal = document.getElementById('scheduleModal')
const scheduleForm = document.getElementById('scheduleForm')
const scheduleTableBody = document.getElementById('scheduleTableBody')
const scheduleModalTitle = document.getElementById('scheduleModalTitle')

const dayNames = {
  1: 'Понеділок',
  2: 'Вівторок',
  3: 'Середа',
  4: 'Четвер',
  5: 'Пʼятниця',
  6: 'Субота',
  7: 'Неділя',
}

function openScheduleModal(doctorId) {
  currentScheduleDoctorId = doctorId

  const doctor = doctorsCache.find((item) => item.id === doctorId)

  scheduleModalTitle.textContent = doctor
    ? `Графік: ${doctor.firstName} ${doctor.lastName}`
    : 'Графік лікаря'

  document.getElementById('scheduleDoctorId').value = doctorId

  scheduleModal.classList.add('active')

  loadDoctorSchedule(doctorId)
}

function closeScheduleModal() {
  scheduleModal.classList.remove('active')
  currentScheduleDoctorId = null
  currentScheduleItems = []
}

async function loadDoctorSchedule(doctorId) {
  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/doctor-schedules/${doctorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити графік')
    }

    currentScheduleItems = data

    renderScheduleTable()
  } catch (error) {
    console.error(error)

    scheduleTableBody.innerHTML = `
      <tr>
        <td colspan="5">${error.message}</td>
      </tr>
    `
  }
}

function renderScheduleTable() {
  if (!currentScheduleItems.length) {
    scheduleTableBody.innerHTML = `
      <tr>
        <td colspan="5">Графік ще не додано</td>
      </tr>
    `
    return
  }

  scheduleTableBody.innerHTML = currentScheduleItems.map((item) => {
    return `
      <tr>
        <td>${dayNames[item.dayOfWeek]}</td>
        <td>${item.startTime}</td>
        <td>${item.endTime}</td>
        <td>
          <span class="admin-status ${item.isActive ? 'admin-status--active' : 'admin-status--inactive'}">
            ${item.isActive ? 'Активний' : 'Неактивний'}
          </span>
        </td>
        <td>
          <div class="admin-table-actions">
            <button
              class="admin-button admin-button--small admin-button--danger"
              type="button"
              data-delete-schedule="${item.id}"
            >
              Видалити
            </button>
          </div>
        </td>
      </tr>
    `
  }).join('')
}

document.addEventListener('click', async (event) => {
  const scheduleButton = event.target.closest('[data-schedule-doctor]')

  if (scheduleButton) {
    openScheduleModal(scheduleButton.dataset.scheduleDoctor)
  }

  const closeScheduleElement = event.target.closest('[data-close-schedule-modal]')

  if (closeScheduleElement) {
    closeScheduleModal()
  }

  const deleteScheduleButton = event.target.closest('[data-delete-schedule]')

  if (deleteScheduleButton) {
    const scheduleId = deleteScheduleButton.dataset.deleteSchedule

    const isConfirmed = confirm('Видалити цей день графіку?')

    if (!isConfirmed) return

    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/doctor-schedules/admin/delete/${scheduleId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Не вдалося видалити графік')
      return
    }

    loadDoctorSchedule(currentScheduleDoctorId)
  }
})

scheduleForm?.addEventListener('submit', async (event) => {
  event.preventDefault()

  const payload = {
    doctorId: currentScheduleDoctorId,
    dayOfWeek: Number(document.getElementById('scheduleDay').value),
    startTime: document.getElementById('scheduleStartTime').value,
    endTime: document.getElementById('scheduleEndTime').value,
  }

  const response = await fetch(
    `${window.ADMIN_API_BASE_URL}/api/doctor-schedules/admin/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося додати графік')
    return
  }

  scheduleForm.reset()
  loadDoctorSchedule(currentScheduleDoctorId)
})

let appointmentsCache = []

const appointmentStatusLabels = {
  NEW: 'Новий',
  CONFIRMED: 'Підтверджено',
  DONE: 'Завершено',
  CANCELED: 'Скасовано',
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('uk-UA')
}

async function loadAppointments() {
  const tableBody = document.getElementById('appointmentsTableBody')

  if (!tableBody) return

  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/appointments/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити записи')
    }

    appointmentsCache = data

    tableBody.innerHTML = data.map((appointment) => {
      return `
        <tr>
          <td>${appointment.patient.firstName} ${appointment.patient.lastName || ''}</td>
          <td>${appointment.patient.phone}</td>
          <td>${appointment.service.title}</td>
          <td>${appointment.doctor.firstName} ${appointment.doctor.lastName}</td>
          <td>${formatDate(appointment.appointmentDate)}</td>
          <td>${appointment.startTime}–${appointment.endTime}</td>
          <td>
            <select
              class="admin-status-select"
              data-appointment-status="${appointment.id}"
            >
              <option value="NEW" ${appointment.status === 'NEW' ? 'selected' : ''}>Новий</option>
              <option value="CONFIRMED" ${appointment.status === 'CONFIRMED' ? 'selected' : ''}>Підтверджено</option>
              <option value="DONE" ${appointment.status === 'DONE' ? 'selected' : ''}>Завершено</option>
              <option value="CANCELED" ${appointment.status === 'CANCELED' ? 'selected' : ''}>Скасовано</option>
            </select>
          </td>
          <td>
            <button
              class="admin-button admin-button--small admin-button--danger"
              type="button"
              data-delete-appointment="${appointment.id}"
            >
              Видалити
            </button>
          </td>
        </tr>
      `
    }).join('')
  } catch (error) {
    console.error(error)

    tableBody.innerHTML = `
      <tr>
        <td colspan="8">${error.message}</td>
      </tr>
    `
  }
}

document.addEventListener('change', async (event) => {
  const statusSelect = event.target.closest('[data-appointment-status]')

  if (!statusSelect) return

  const appointmentId = statusSelect.dataset.appointmentStatus
  const status = statusSelect.value

  const response = await fetch(
    `${window.ADMIN_API_BASE_URL}/api/appointments/admin/status/${appointmentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося оновити статус')
    return
  }

  loadAppointments()
  loadDashboardStats()
})

document.addEventListener('click', async (event) => {
  const deleteButton = event.target.closest('[data-delete-appointment]')

  if (!deleteButton) return

  const appointmentId = deleteButton.dataset.deleteAppointment

  const isConfirmed = confirm('Видалити запис?')

  if (!isConfirmed) return

  const response = await fetch(
    `${window.ADMIN_API_BASE_URL}/api/appointments/admin/delete/${appointmentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося видалити запис')
    return
  }

  loadAppointments()
  loadDashboardStats()
})

loadAppointments()

let patientsCache = []

const patientsSearchInput = document.getElementById('patientsSearchInput')
const patientsSearchButton = document.getElementById('patientsSearchButton')
const patientsResetButton = document.getElementById('patientsResetButton')

async function loadPatients(search = '') {
  const tableBody = document.getElementById('patientsTableBody')

  if (!tableBody) return

  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : ''

  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/patients/admin/list${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити пацієнтів')
    }

    patientsCache = data

    tableBody.innerHTML = data.map((patient) => {
      return `
        <tr>
          <td>${patient.firstName} ${patient.lastName || ''}</td>
          <td>${patient.phone}</td>
          
          <td>${patient._count?.appointments || 0}</td>
          <td>${formatDate(patient.createdAt)}</td>
          <td>
            <button
              class="admin-button admin-button--small admin-button--secondary"
              type="button"
              data-view-patient="${patient.id}"
            >
              Історія
            </button>
          </td>
        </tr>
      `
    }).join('')
  } catch (error) {
    console.error(error)

    tableBody.innerHTML = `
      <tr>
        <td colspan="6">${error.message}</td>
      </tr>
    `
  }
}

patientsSearchButton?.addEventListener('click', () => {
  loadPatients(patientsSearchInput.value.trim())
})

patientsSearchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loadPatients(patientsSearchInput.value.trim())
  }
})

patientsResetButton?.addEventListener('click', () => {
  patientsSearchInput.value = ''
  loadPatients()
})

loadPatients()

const patientModal = document.getElementById('patientModal')
const patientDetails = document.getElementById('patientDetails')
const patientAppointmentsTableBody = document.getElementById('patientAppointmentsTableBody')

async function openPatientModal(patientId) {
  const response = await fetch(
    `${window.ADMIN_API_BASE_URL}/api/patients/admin/${patientId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const patient = await response.json()

  if (!response.ok) {
    alert(patient.message || 'Не вдалося завантажити пацієнта')
    return
  }

  document.getElementById('patientModalTitle').textContent =
    `${patient.firstName} ${patient.lastName || ''}`

  patientDetails.innerHTML = `
    <div class="admin-details">
      <p><strong>Телефон:</strong> ${patient.phone}</p>
      <p><strong>Email:</strong> ${patient.email || '—'}</p>
    </div>
  `

  if (!patient.appointments.length) {
    patientAppointmentsTableBody.innerHTML = `
      <tr>
        <td colspan="6">Історія записів порожня</td>
      </tr>
    `
  } else {
    patientAppointmentsTableBody.innerHTML = patient.appointments.map((appointment) => {
      return `
        <tr>
          <td>${formatDate(appointment.appointmentDate)}</td>
          <td>${appointment.startTime}–${appointment.endTime}</td>
          <td>${appointment.service?.title || '—'}</td>
          <td>${appointment.doctor?.firstName || ''} ${appointment.doctor?.lastName || ''}</td>
          <td>${appointmentStatusLabels[appointment.status] || appointment.status}</td>
          <td>${appointment.comment || '—'}</td>
        </tr>
      `
    }).join('')
  }

  patientModal.classList.add('active')
}

function closePatientModal() {
  patientModal.classList.remove('active')
}

document.addEventListener('click', (event) => {
  const viewPatientButton = event.target.closest('[data-view-patient]')

  if (viewPatientButton) {
    openPatientModal(viewPatientButton.dataset.viewPatient)
  }

  const closePatientElement = event.target.closest('[data-close-patient-modal]')

  if (closePatientElement) {
    closePatientModal()
  }
})

async function loadContacts() {
  const tableBody = document.getElementById('contactsTableBody')

  if (!tableBody) return

  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/contact-requests/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити звернення')
    }

    tableBody.innerHTML = data.map((item) => {
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.phone}</td>
          <td>${item.email || '—'}</td>
          <td>${item.subject || '—'}</td>
          <td>${item.message}</td>
          <td>
            <select class="admin-status-select" data-contact-status="${item.id}">
              <option value="NEW" ${item.status === 'NEW' ? 'selected' : ''}>Нове</option>
              <option value="PROCESSED" ${item.status === 'PROCESSED' ? 'selected' : ''}>Опрацьовано</option>
            </select>
          </td>
          <td>${formatDate(item.createdAt)}</td>
          <td>
            <button
              class="admin-button admin-button--small admin-button--danger"
              type="button"
              data-delete-contact="${item.id}"
            >
              Видалити
            </button>
          </td>
        </tr>
      `
    }).join('')
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8">${error.message}</td>
      </tr>
    `
  }
}

document.addEventListener('change', async (event) => {
  const statusSelect = event.target.closest('[data-contact-status]')

  if (!statusSelect) return

  const contactId = statusSelect.dataset.contactStatus
  const status = statusSelect.value

  const response = await fetch(
    `${window.ADMIN_API_BASE_URL}/api/contact-requests/admin/status/${contactId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося оновити статус')
    return
  }

  loadContacts()
  loadDashboardStats()
})

document.addEventListener('click', async (event) => {
  const deleteButton = event.target.closest('[data-delete-contact]')

  if (!deleteButton) return

  const contactId = deleteButton.dataset.deleteContact
  const isConfirmed = confirm('Видалити звернення?')

  if (!isConfirmed) return

  const response = await fetch(
    `${window.ADMIN_API_BASE_URL}/api/contact-requests/admin/delete/${contactId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося видалити звернення')
    return
  }

  loadContacts()
  loadDashboardStats()
})

loadContacts()

async function loadPhoneLeads() {
  const tableBody = document.getElementById('phoneLeadsTableBody')

  if (!tableBody) return

  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/phone-leads/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Не вдалося завантажити телефонні заявки')
    }

    tableBody.innerHTML = data.map((item) => {
      return `
        <tr>
          <td>${item.phone}</td>
          <td>
            <select class="admin-status-select" data-phone-lead-status="${item.id}">
              <option value="NEW" ${item.status === 'NEW' ? 'selected' : ''}>Нова</option>
              <option value="PROCESSED" ${item.status === 'PROCESSED' ? 'selected' : ''}>Опрацьовано</option>
            </select>
          </td>
          <td>${formatDate(item.createdAt)}</td>
          <td>
            <button
              class="admin-button admin-button--small admin-button--danger"
              type="button"
              data-delete-phone-lead="${item.id}"
            >
              Видалити
            </button>
          </td>
        </tr>
      `
    }).join('')
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">${error.message}</td>
      </tr>
    `
  }
}

document.addEventListener('change', async (event) => {
  const statusSelect = event.target.closest('[data-phone-lead-status]')

  if (!statusSelect) return

  const leadId = statusSelect.dataset.phoneLeadStatus
  const status = statusSelect.value

  const response = await fetch(
    `${window.ADMIN_API_BASE_URL}/api/phone-leads/admin/status/${leadId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося оновити статус')
    return
  }

  loadPhoneLeads()
  loadDashboardStats()
})

document.addEventListener('click', async (event) => {
  const deleteButton = event.target.closest('[data-delete-phone-lead]')

  if (!deleteButton) return

  const leadId = deleteButton.dataset.deletePhoneLead
  const isConfirmed = confirm('Видалити телефонну заявку?')

  if (!isConfirmed) return

  const response = await fetch(
    `${window.ADMIN_API_BASE_URL}/api/phone-leads/admin/delete/${leadId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    alert(data.message || 'Не вдалося видалити заявку')
    return
  }

  loadPhoneLeads()
  loadDashboardStats()
})

loadPhoneLeads()

const exportPhoneLeadsButton =
  document.getElementById('exportPhoneLeadsButton')

exportPhoneLeadsButton?.addEventListener('click', async () => {
  try {
    const response = await fetch(
      `${window.ADMIN_API_BASE_URL}/api/phone-leads/admin/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Не вдалося експортувати номери')
    }

    const csvRows = [
      ['Телефон', 'Статус', 'Дата'],
    ]

    data.forEach((item) => {
      csvRows.push([
        item.phone,
        item.status,
        formatDate(item.createdAt),
      ])
    })

    const csvContent = csvRows
      .map((row) => row.join(';'))
      .join('\n')

    const blob = new Blob(
      [csvContent],
      { type: 'text/csv;charset=utf-8;' }
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = 'phone-leads.csv'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  } catch (error) {
    alert(error.message)
  }
})