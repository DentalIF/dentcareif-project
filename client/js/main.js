(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 40) {
            $('.navbar').addClass('sticky-top');
        } else {
            $('.navbar').removeClass('sticky-top');
        }
    });
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Image comparison
    $(".twentytwenty-container").twentytwenty({});


    // Price carousel
    $(".price-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 45,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });
    
})(jQuery);

const serviceSelect = document.getElementById('serviceSelect');
const doctorSelect = document.getElementById('doctorSelect');
const phoneInput = document.getElementById('patientPhone');

const appointmentParams = new URLSearchParams(window.location.search);
const preselectedServiceSlug = appointmentParams.get('service');
const preselectedDoctorSlug = appointmentParams.get('doctor');

async function loadAppointmentServices() {
    if (!serviceSelect) return;

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/services`);
        const services = await response.json();

        serviceSelect.innerHTML = '<option selected disabled value="">Оберіть послугу</option>';

        services.forEach(function (service) {
            const option = document.createElement('option');
            option.value = service.slug;
            option.dataset.id = service.id;
            option.textContent = service.title;
            serviceSelect.appendChild(option);
        });

        if (preselectedServiceSlug) {
            serviceSelect.value = preselectedServiceSlug;
            await loadDoctorsByService(preselectedServiceSlug);
        }
    } catch (error) {
        console.error('Services loading error:', error);
    }
}

async function loadDoctorsByService(serviceSlug) {
    if (!doctorSelect) return;

    try {
        doctorSelect.innerHTML = '<option selected disabled value="">Завантаження лікарів...</option>';
        doctorSelect.disabled = true;

        const response = await fetch(`${window.API_BASE_URL}/api/doctors?service=${serviceSlug}`);
        const doctors = await response.json();

        doctorSelect.innerHTML = '<option selected disabled value="">Оберіть лікаря</option>';

        doctors.forEach(function (doctor) {
            const option = document.createElement('option');
            option.value = doctor.slug;
            option.dataset.id = doctor.id;
            option.textContent = `${doctor.firstName} ${doctor.lastName}`;
            doctorSelect.appendChild(option);
        });

        doctorSelect.disabled = doctors.length === 0;

        if (preselectedDoctorSlug) {
            doctorSelect.value = preselectedDoctorSlug;
        }
    } catch (error) {
        console.error('Doctors loading error:', error);
        doctorSelect.innerHTML = '<option selected disabled value="">Не вдалося завантажити лікарів</option>';
    }
}

if (serviceSelect && doctorSelect) {
    serviceSelect.addEventListener('change', function () {
        loadDoctorsByService(this.value);
    });

    loadAppointmentServices();
}

const phoneInputs = document.querySelectorAll('.phone-input');
phoneInputs.forEach(function (phoneInput) {
    phoneInput.addEventListener('input', function () {
        let value = phoneInput.value.replace(/\D/g, '');
        if (!value.length) {
            phoneInput.value = '';
            return;
        }
        if (value.startsWith('380')) {
            value = value.slice(3);
        }
        if (value.startsWith('0')) {
            value = value.slice(1);
        }
        value = value.slice(0, 9);
        const operator = value.slice(0, 2);
        const part1 = value.slice(2, 5);
        const part2 = value.slice(5, 7);
        const part3 = value.slice(7, 9);
        let formattedValue = '+38';
        if (operator) formattedValue += ` (0${operator}`;
        if (operator.length === 2) formattedValue += ')';
        if (part1) formattedValue += ` ${part1}`;
        if (part2) formattedValue += ` ${part2}`;
        if (part3) formattedValue += ` ${part3}`;
        phoneInput.value = formattedValue;
    });
});

if (document.getElementById('appointmentDate')) {
    flatpickr('#appointmentDate', {
        locale: 'uk',
        dateFormat: 'd.m.Y',
        minDate: 'today',
        disableMobile: true
    });
}


;(function () {
  const doctorModal = document.getElementById('doctorModal')

  if (!doctorModal) return

  const doctorModalName = document.getElementById('doctorModalName')
  const doctorModalPosition = document.getElementById('doctorModalPosition')
  const doctorModalExperience = document.getElementById('doctorModalExperience')
  const doctorModalDescription = document.getElementById('doctorModalDescription')
  const doctorModalCertificates = document.getElementById('doctorModalCertificates')
  const doctorModalImage = document.getElementById('doctorModalImage')

  function getDoctorServices(doctor) {
    return doctor.services
      ?.map((item) => item.service)
      .filter(Boolean) || []
  }

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.doctor-modal-btn')

    if (!button) return

    const doctorSlug = button.dataset.doctorSlug

    if (!doctorSlug) return

    
    try {
      const response = await fetch(
    `${window.API_BASE_URL}/api/doctors/${doctorSlug}`
    )


      if (!response.ok) {
        throw new Error('Не вдалося завантажити інформацію про лікаря')
      }

      const doctor = await response.json()

      const services = getDoctorServices(doctor)

      doctorModalName.textContent =
        `${doctor.firstName} ${doctor.lastName}`

      doctorModalPosition.textContent =
        doctor.position || ''

      doctorModalExperience.textContent =
        doctor.experience
          ? `Досвід роботи: ${doctor.experience} років`
          : ''

      doctorModalDescription.textContent =
        doctor.description || ''

      doctorModalCertificates.textContent =
        doctor.certificates || 'Інформація відсутня'

      doctorModalImage.src =
        doctor.image || 'img/team-1.jpg'

      doctorModalImage.alt =
        `${doctor.firstName} ${doctor.lastName}`

      const existingServicesBlock =
        document.getElementById('doctorModalServices')

      if (existingServicesBlock) {
        existingServicesBlock.remove()
      }

      if (services.length) {
        const servicesHtml = `
          <div id="doctorModalServices" class="mt-4">
            <h6 class="mb-2">Послуги лікаря</h6>

            <div class="d-flex flex-wrap gap-2">
              ${services.map((service) => `
                <span class="badge bg-primary">
                  ${service.title}
                </span>
              `).join('')}
            </div>
          </div>
        `

        doctorModalCertificates.insertAdjacentHTML(
          'afterend',
          servicesHtml
        )
      }
    } catch (error) {
      console.error(error)
    }
  })
})()

const galleryElement = document.getElementById('clinicGallery');
if (galleryElement && typeof lightGallery !== 'undefined') {
    lightGallery(galleryElement, {
        selector: 'a',
        plugins: [lgZoom, lgThumbnail],
        speed: 500,
        download: false
    });
}
const galleryFilterButtons = document.querySelectorAll('.gallery-filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');
const galleryDescriptionButtons = document.querySelectorAll('.gallery-description-btn');
const galleryModalImage = document.getElementById('galleryModalImage');
const galleryModalTitle = document.getElementById('galleryModalTitle');
const galleryModalDescription = document.getElementById('galleryModalDescription');
galleryDescriptionButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        galleryModalImage.src = button.dataset.image;
        galleryModalImage.alt = button.dataset.title;
        galleryModalTitle.textContent = button.dataset.title;
        galleryModalDescription.textContent = button.dataset.description;
    });
});

galleryFilterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const filter = button.dataset.filter;
        galleryFilterButtons.forEach(function (item) {
            item.classList.remove('active', 'btn-primary');
            item.classList.add('btn-outline-primary');
        });
        button.classList.add('active', 'btn-primary');
        button.classList.remove('btn-outline-primary');
        galleryCards.forEach(function (card) {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            card.classList.remove('is-showing');
            if (shouldShow) {
                card.classList.remove('is-hidden', 'is-hiding');
                card.classList.add('is-showing');
            } else {
                card.classList.add('is-hiding');
                setTimeout(function () {
                    card.classList.add('is-hidden');
                    card.classList.remove('is-hiding');
                }, 350);
            }
        });
    });
});

const doctorFilterButtons = document.querySelectorAll('.doctor-filter-btn');
const doctorCards = document.querySelectorAll('.doctor-card');

doctorFilterButtons.forEach(function (button) {

    button.addEventListener('click', function () {

        const filter = button.dataset.filter;

        doctorFilterButtons.forEach(function (item) {
            item.classList.remove('active', 'btn-primary');
            item.classList.add('btn-outline-primary');
        });

        button.classList.add('active', 'btn-primary');
        button.classList.remove('btn-outline-primary');

        doctorCards.forEach(function (card) {

            const specialization = card.dataset.specialization;

            const shouldShow =
                filter === 'all' ||
                specialization === filter;

            card.classList.remove('is-showing');

            if (shouldShow) {

                card.classList.remove('is-hidden', 'is-hiding');
                card.classList.add('is-showing');

            } else {

                card.classList.add('is-hiding');

                setTimeout(function () {
                    card.classList.add('is-hidden');
                    card.classList.remove('is-hiding');
                }, 350);

            }

        });

    });

});

const contactForm = document.getElementById('contactForm');

if (contactForm) {

    contactForm.addEventListener('submit', function (event) {

        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const successModal = new bootstrap.Modal(document.getElementById('successModal'));

        successModal.show();

        contactForm.reset();

    });

}

const callbackForm = document.getElementById('callbackForm');
const successModalElement = document.getElementById('successModal');
const successModalTitle = document.getElementById('successModalLabel');
const successModalText = document.getElementById('successModalText');
if (callbackForm && successModalElement) {
    callbackForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!callbackForm.checkValidity()) {
            callbackForm.reportValidity();
            return;
        }
        successModalTitle.textContent = 'Дякуємо за заявку!';
        successModalText.textContent = 'Ваш номер телефону успішно надіслано. Адміністратор клініки зв’яжеться з вами найближчим часом.';
        const successModal = new bootstrap.Modal(successModalElement);
        successModal.show();
        callbackForm.reset();
    });
}



const appointmentDate = document.getElementById('appointmentDate');
const appointmentTime = document.getElementById('appointmentTime');

const availableTimeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
];

function updateAppointmentTimeSlots() {

    if (!appointmentDate || !appointmentTime) return;

    appointmentTime.innerHTML =
        '<option selected disabled value="">Оберіть час прийому</option>';

    if (!appointmentDate.value) {
        appointmentTime.disabled = true;
        return;
    }

    availableTimeSlots.forEach(function (slot) {

        const option = document.createElement('option');

        option.value = slot;
        option.textContent = slot;

        appointmentTime.appendChild(option);

    });

    appointmentTime.disabled = false;

}

if (appointmentDate) {

    appointmentDate.addEventListener('change', function () {

        updateAppointmentTimeSlots();

    });

}

const appointmentDateInput = document.getElementById('appointmentDate');
const appointmentTimeSelect = document.getElementById('appointmentTime');

function convertDateToApiFormat(dateValue) {
    const [day, month, year] = dateValue.split('.');

    return `${year}-${month}-${day}`;
}

async function loadAvailableTimes() {
    if (!doctorSelect || !appointmentDateInput || !appointmentTimeSelect) return;

    const selectedDoctorOption = doctorSelect.options[doctorSelect.selectedIndex];

    const doctorId = selectedDoctorOption?.dataset.id;
    const selectedDate = convertDateToApiFormat(appointmentDateInput.value);

    const selectedServiceOption = serviceSelect.options[serviceSelect.selectedIndex];
    const serviceId = selectedServiceOption?.dataset.id;

    if (!doctorId || !serviceId || !appointmentDateInput.value) return;

    try {
        appointmentTimeSelect.innerHTML = '<option selected disabled value="">Завантаження часу...</option>';
        appointmentTimeSelect.disabled = true;

        const response = await fetch(
            `${window.API_BASE_URL}/api/appointments/available-slots?doctorId=${doctorId}&serviceId=${serviceId}&date=${selectedDate}`
        );

        if (!response.ok) {
            throw new Error('Не вдалося завантажити доступний час');
        }

        const slots = await response.json();

        appointmentTimeSelect.innerHTML = '';

        if (!slots.length) {
            appointmentTimeSelect.innerHTML =
                '<option selected disabled value="">Немає доступного часу</option>';

            return;
        }

        appointmentTimeSelect.innerHTML =
            '<option selected disabled value="">Оберіть час</option>';

        slots.forEach((slot) => {
            const option = document.createElement('option');

            option.value = slot.startTime;
            option.textContent = `${slot.startTime} – ${slot.endTime}`;

            appointmentTimeSelect.appendChild(option);
        });

        appointmentTimeSelect.disabled = false;
    } catch (error) {
        console.error('Available slots loading error:', error);

        appointmentTimeSelect.innerHTML =
            '<option selected disabled value="">Не вдалося завантажити час</option>';
    }
}

if (doctorSelect) {
    doctorSelect.addEventListener('change', loadAvailableTimes);
}

if (appointmentDateInput) {
    appointmentDateInput.addEventListener('change', loadAvailableTimes);
}


;(function () {
  const doctorsGrid = document.getElementById('doctorsGrid')
  const doctorFilter = document.getElementById('doctorFilter')

  if (!doctorsGrid || !doctorFilter) return

  let doctorsCache = []

  function getDoctorServices(doctor) {
    return doctor.services
      ?.map((item) => item.service)
      .filter(Boolean) || []
  }

  function renderDoctorFilters(doctors) {
    const servicesMap = new Map()

    doctors.forEach((doctor) => {
      getDoctorServices(doctor).forEach((service) => {
        servicesMap.set(service.id, service.title)
      })
    })

    const buttons = [
      `
        <button class="btn btn-primary doctor-filter-btn active" type="button" data-service-id="all">
          Всі спеціалісти
        </button>
      `,
      ...Array.from(servicesMap.entries()).map(([id, title]) => {
        return `
          <button class="btn btn-outline-primary doctor-filter-btn" type="button" data-service-id="${id}">
            ${title}
          </button>
        `
      }),
    ]

    doctorFilter.innerHTML = buttons.join('')
  }

  function renderDoctors(doctors) {
    if (!doctors.length) {
      doctorsGrid.innerHTML = `
        <div class="col-12 text-center">
          <p class="mb-0">Лікарів за вибраною послугою не знайдено.</p>
        </div>
      `
      return
    }

    doctorsGrid.innerHTML = doctors.map((doctor, index) => {
      const services = getDoctorServices(doctor)
      const servicesText = services.map((service) => service.title).join(', ')

      return `
        <div class="col-lg-4 col-md-6 wow slideInUp doctor-card" data-wow-delay="${0.1 + index * 0.1}s">
          <div class="team-item">
            <div class="position-relative rounded-top" style="z-index: 1;">
              <img
                class="img-fluid rounded-top w-100"
                src="${doctor.image || 'img/team-1.jpg'}"
                alt="${doctor.firstName} ${doctor.lastName}"
              >
            </div>

            <div class="team-text position-relative bg-light text-center rounded-bottom p-4 pt-5">
              <button
                type="button"
                class="btn btn-link p-0 text-dark text-decoration-none doctor-modal-btn"
                data-bs-toggle="modal"
                data-bs-target="#doctorModal"
                data-doctor-slug="${doctor.slug}"
              >
                <h4 class="mb-2">${doctor.firstName} ${doctor.lastName}</h4>
              </button>

              <p class="text-primary mb-0">${doctor.position}</p>
              <small class="d-block mt-2">${servicesText || 'Стоматологічні послуги'}</small>
            </div>
          </div>
        </div>
      `
    }).join('')
  }

  function filterDoctors(serviceId) {
    if (serviceId === 'all') {
      renderDoctors(doctorsCache)
      return
    }

    const filteredDoctors = doctorsCache.filter((doctor) => {
      return getDoctorServices(doctor).some((service) => {
        return service.id === serviceId
      })
    })

    renderDoctors(filteredDoctors)
  }

  async function loadDoctorsPage() {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/doctors`)
      const doctors = await response.json()

      if (!response.ok) {
        throw new Error('Не вдалося завантажити лікарів')
      }

      doctorsCache = doctors

      renderDoctorFilters(doctorsCache)
      renderDoctors(doctorsCache)
    } catch (error) {
      console.error(error)

      doctorsGrid.innerHTML = `
        <div class="col-12 text-center">
          <p class="text-danger mb-0">${error.message}</p>
        </div>
      `
    }
  }

  doctorFilter.addEventListener('click', (event) => {
    const button = event.target.closest('.doctor-filter-btn')

    if (!button) return

    doctorFilter.querySelectorAll('.doctor-filter-btn').forEach((item) => {
      item.classList.remove('active', 'btn-primary')
      item.classList.add('btn-outline-primary')
    })

    button.classList.add('active', 'btn-primary')
    button.classList.remove('btn-outline-primary')

    filterDoctors(button.dataset.serviceId)
  })

  loadDoctorsPage()
})()

;(function () {
  const servicesGrid = document.getElementById('servicesGrid')
  const serviceFilter = document.getElementById('serviceFilter')

  if (!servicesGrid || !serviceFilter) return

  let servicesCache = []
  let categoriesCache = []

  function renderFilters() {
    const buttons = [
      `
        <button
          class="btn btn-primary service-filter-btn active"
          type="button"
          data-category-slug="all"
        >
          Всі послуги
        </button>
      `,
      ...categoriesCache.map((category) => {
        return `
          <button
            class="btn btn-outline-primary service-filter-btn"
            type="button"
            data-category-slug="${category.slug}"
          >
            ${category.title}
          </button>
        `
      }),
    ]

    serviceFilter.innerHTML = buttons.join('')
  }

  function renderServices(services) {
    if (!services.length) {
      servicesGrid.innerHTML = `
        <div class="col-12 text-center">
          <p class="mb-0">Послуг не знайдено.</p>
        </div>
      `
      return
    }

    servicesGrid.innerHTML = services.map((service, index) => {
      return `
        <div
          class="col-lg-4 col-md-6 service-card wow zoomIn"
          data-wow-delay="${0.1 + index * 0.1}s"
        >
          <div class="service-item h-100">
            <div class="rounded-top overflow-hidden">
              <img
                class="img-fluid w-100"
                src="${service.image || 'img/service-1.jpg'}"
                alt="${service.title}"
              >
            </div>

            <div class="position-relative bg-light rounded-bottom text-center p-4">
              <span class="d-inline-block text-primary mb-2">
                ${service.category?.title || 'Послуга'}
              </span>

              <h5 class="mb-3">
                ${service.title}
              </h5>

              <p class="mb-3">
                ${service.shortDesc || ''}
              </p>

              <div class="d-flex justify-content-center gap-3 mb-4">
                <small>
                  <i class="far fa-clock text-primary me-1"></i>
                  ${service.duration || 0} хв
                </small>

                <small>
                  <i class="fa fa-tag text-primary me-1"></i>
                  від ${service.price || 0} грн
                </small>
              </div>

              <div class="d-flex justify-content-center gap-2 flex-wrap">
                <a
                  href="service-details.html?slug=${service.slug}"
                  class="btn btn-outline-primary py-2 px-4"
                >
                  Детальніше
                </a>

                <a
                  href="appointment.html?service=${service.slug}"
                  class="btn btn-primary py-2 px-4"
                >
                  Записатися
                </a>
              </div>
            </div>
          </div>
        </div>
      `
    }).join('')

    if (typeof WOW !== 'undefined') {
      new WOW().init()
    }
  }

  function filterServices(categorySlug) {
    if (categorySlug === 'all') {
      renderServices(servicesCache)
      return
    }

    const filteredServices = servicesCache.filter((service) => {
      return service.category?.slug === categorySlug
    })

    renderServices(filteredServices)
  }

  async function loadServicesPage() {
    try {
      const [servicesResponse, categoriesResponse] = await Promise.all([
        fetch(`${window.API_BASE_URL}/api/services`),
        fetch(`${window.API_BASE_URL}/api/service-categories`),
      ])

      if (!servicesResponse.ok || !categoriesResponse.ok) {
        throw new Error('Не вдалося завантажити послуги')
      }

      servicesCache = await servicesResponse.json()
      categoriesCache = await categoriesResponse.json()

      renderFilters()
      renderServices(servicesCache)
    } catch (error) {
      console.error(error)

      servicesGrid.innerHTML = `
        <div class="col-12 text-center">
          <p class="text-danger mb-0">${error.message}</p>
        </div>
      `
    }
  }

  serviceFilter.addEventListener('click', (event) => {
    const button = event.target.closest('.service-filter-btn')

    if (!button) return

    serviceFilter.querySelectorAll('.service-filter-btn').forEach((item) => {
      item.classList.remove('active', 'btn-primary')
      item.classList.add('btn-outline-primary')
    })

    button.classList.add('active', 'btn-primary')
    button.classList.remove('btn-outline-primary')

    filterServices(button.dataset.categorySlug)
  })

  loadServicesPage()
})()

;(function () {
  const servicesGrid = document.getElementById('servicesGrid')
  const serviceFilter = document.getElementById('serviceFilter')

  if (!servicesGrid || !serviceFilter) return

  let servicesCache = []
  let categoriesCache = []

  function renderServiceFilters() {
    serviceFilter.innerHTML = `
      <button class="btn btn-primary service-filter-btn active" type="button" data-category-slug="all">
        Всі послуги
      </button>
      ${categoriesCache.map((category) => `
        <button class="btn btn-outline-primary service-filter-btn" type="button" data-category-slug="${category.slug}">
          ${category.title}
        </button>
      `).join('')}
    `
  }

  function renderServices(services) {
    if (!services.length) {
      servicesGrid.innerHTML = `
        <div class="col-12 text-center">
          <p class="mb-0">Послуг не знайдено.</p>
        </div>
      `
      return
    }

    servicesGrid.innerHTML = services.map((service, index) => `
      <div class="col-lg-4 col-md-6 service-card wow zoomIn" data-wow-delay="${0.1 + index * 0.1}s">
        <div class="service-item h-100">
          <div class="rounded-top overflow-hidden service-card-image">
            <img class="img-fluid w-100" src="${service.image || 'img/service-1.jpg'}" alt="${service.title}">
          </div>

          <div class="position-relative bg-light rounded-bottom text-center p-4 service-card-body">
            <span class="d-inline-block text-primary mb-2">
              ${service.category?.title || 'Послуга'}
            </span>

            <h5 class="mb-3">${service.title}</h5>

            <p class="mb-3">${service.shortDesc || ''}</p>

            <div class="d-flex justify-content-center gap-3 mb-4">
              <small><i class="far fa-clock text-primary me-1"></i>${service.duration} хв</small>
              <small><i class="fa fa-tag text-primary me-1"></i>від ${service.price} грн</small>
            </div>

            <div class="d-flex justify-content-center gap-2 flex-wrap">
              <a href="service-details.html?slug=${service.slug}" class="btn btn-outline-primary py-2 px-4">
                Детальніше
              </a>

              <a href="appointment.html?service=${service.slug}" class="btn btn-primary py-2 px-4">
                Записатися
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('')
  }

  function setActiveFilter(activeButton) {
    serviceFilter.querySelectorAll('.service-filter-btn').forEach((button) => {
      button.classList.remove('active', 'btn-primary')
      button.classList.add('btn-outline-primary')
    })

    activeButton.classList.add('active', 'btn-primary')
    activeButton.classList.remove('btn-outline-primary')
  }

  function filterServices(categorySlug) {
    if (categorySlug === 'all') {
      renderServices(servicesCache)
      return
    }

    renderServices(
      servicesCache.filter((service) => service.category?.slug === categorySlug)
    )
  }

  async function loadServicesPage() {
    try {
      const [servicesResponse, categoriesResponse] = await Promise.all([
        fetch(`${window.API_BASE_URL}/api/services`),
        fetch(`${window.API_BASE_URL}/api/service-categories`),
      ])

      if (!servicesResponse.ok || !categoriesResponse.ok) {
        throw new Error('Не вдалося завантажити послуги')
      }

      servicesCache = await servicesResponse.json()
      categoriesCache = await categoriesResponse.json()

      renderServiceFilters()
      renderServices(servicesCache)
    } catch (error) {
      console.error(error)

      servicesGrid.innerHTML = `
        <div class="col-12 text-center">
          <p class="text-danger mb-0">${error.message}</p>
        </div>
      `
    }
  }

  serviceFilter.addEventListener('click', (event) => {
    const button = event.target.closest('.service-filter-btn')

    if (!button) return

    setActiveFilter(button)
    filterServices(button.dataset.categorySlug)
  })

  loadServicesPage()
})()

;(function () {
  const serviceDetailsPage = document.getElementById('serviceDetailsPage')

  if (!serviceDetailsPage) return

  const params = new URLSearchParams(window.location.search)
  const slug = params.get('slug') || 'therapeutic-dentistry'

  function renderList(items) {
    if (!items?.length) return '<p class="mb-0">Інформація уточнюється.</p>'

    return items.map((item) => `
      <div class="col-md-6">
        <p class="mb-2">
          <i class="fa fa-check-circle text-primary me-2"></i>${item.text || item}
        </p>
      </div>
    `).join('')
  }

  function renderSteps(steps) {
    if (!steps?.length) return '<p>Етапи послуги уточнюються.</p>'

    return steps.map((step, index) => `
      <div class="bg-light rounded p-4 mb-3">
        <h5><span class="text-primary me-2">${String(index + 1).padStart(2, '0')}.</span>${step.title}</h5>
        <p class="mb-0">${step.text}</p>
      </div>
    `).join('')
  }

  function renderIncluded(items) {
    if (!items?.length) return '<li>Інформація уточнюється.</li>'

    return items.map((item) => `<li>${item.text || item}</li>`).join('')
  }

  function renderFaq(faqs) {
    if (!faqs?.length) return ''

    return `
      <div class="container-fluid py-5 bg-light">
        <div class="container">
          <div class="section-title text-center mb-5">
            <h5 class="position-relative d-inline-block text-primary text-uppercase">FAQ</h5>
            <h1 class="display-5 mb-0">Поширені запитання</h1>
          </div>

          <div class="accordion" id="serviceFaq">
            ${faqs.map((faq, index) => `
              <div class="accordion-item mb-3 border-0 rounded">
                <h2 class="accordion-header" id="faqHeading${index}">
                  <button
                    class="accordion-button ${index === 0 ? '' : 'collapsed'}"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faqCollapse${index}"
                    aria-expanded="${index === 0 ? 'true' : 'false'}"
                    aria-controls="faqCollapse${index}"
                  >
                    ${faq.question}
                  </button>
                </h2>

                <div
                  id="faqCollapse${index}"
                  class="accordion-collapse collapse ${index === 0 ? 'show' : ''}"
                  aria-labelledby="faqHeading${index}"
                  data-bs-parent="#serviceFaq"
                >
                  <div class="accordion-body">${faq.answer}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `
  }

  function renderService(service) {
    document.title = `${service.title} | DentCareIF`

    serviceDetailsPage.innerHTML = `
      <div class="container-fluid bg-primary py-5 hero-header mb-5">
        <div class="row py-3">
          <div class="col-12 text-center">
            <h1 class="display-3 text-white animated zoomIn">${service.title}</h1>
            <a href="index.html" class="h4 text-white">Головна</a>
            <i class="far fa-circle text-white px-2"></i>
            <a href="service.html" class="h4 text-white">Послуги</a>
            <i class="far fa-circle text-white px-2"></i>
            <span class="h4 text-white">${service.title}</span>
          </div>
        </div>
      </div>

      <div class="container-fluid py-5">
        <div class="container">
          <div class="row g-5">
            <div class="col-lg-8">
              <img class="img-fluid w-100 rounded mb-4 service-details-image" src="${service.image || 'img/service-1.jpg'}" alt="${service.title}">

              <div class="section-title mb-4">
                <h5 class="position-relative d-inline-block text-primary text-uppercase">Послуга</h5>
                <h1 class="display-5 mb-0">${service.title}</h1>
              </div>

              <p class="mb-4">${service.fullDesc || service.shortDesc || ''}</p>

              <div class="row g-4 mb-5">
                <div class="col-md-4">
                  <div class="bg-light rounded text-center p-4 h-100">
                    <i class="fa fa-tag text-primary fs-2 mb-3"></i>
                    <h5>Вартість</h5>
                    <p class="mb-0">від ${service.price} грн</p>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="bg-light rounded text-center p-4 h-100">
                    <i class="far fa-clock text-primary fs-2 mb-3"></i>
                    <h5>Тривалість</h5>
                    <p class="mb-0">від ${service.duration} хв</p>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="bg-light rounded text-center p-4 h-100">
                    <i class="fa fa-tooth text-primary fs-2 mb-3"></i>
                    <h5>Категорія</h5>
                    <p class="mb-0">${service.category?.title || 'Стоматологія'}</p>
                  </div>
                </div>
              </div>

              <h3 class="mb-4">Коли варто звернутися</h3>
              <div class="row g-3 mb-5">
                ${renderList(service.indications)}
              </div>

              <h3 class="mb-4">Як проходить лікування</h3>
              <div class="service-steps mb-5">
                ${renderSteps(service.steps)}
              </div>

              <h3 class="mb-4">Що входить у послугу</h3>
              <ul class="service-list mb-5">
                ${renderIncluded(service.included)}
              </ul>

              <div class="bg-primary rounded p-5 text-center">
                <h2 class="text-white mb-3">Потрібна консультація стоматолога?</h2>
                <p class="text-white mb-4">Запишіться на прийом, і адміністратор допоможе підібрати зручний час.</p>
                <a href="appointment.html?service=${service.slug}" class="btn btn-dark py-3 px-5">Записатися на прийом</a>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="bg-light rounded p-4 mb-4">
                <h4 class="mb-4">Коротко про послугу</h4>
                <p class="d-flex justify-content-between mb-2"><span>Категорія:</span><strong>${service.category?.title || 'Стоматологія'}</strong></p>
                <p class="d-flex justify-content-between mb-2"><span>Ціна:</span><strong>від ${service.price} грн</strong></p>
                <p class="d-flex justify-content-between mb-2"><span>Тривалість:</span><strong>від ${service.duration} хв</strong></p>
                <p class="d-flex justify-content-between mb-0"><span>Статус:</span><strong>${service.isActive ? 'Доступна' : 'Недоступна'}</strong></p>
              </div>

              <div class="bg-primary rounded p-4 text-center">
                <h4 class="text-white mb-3">Запис на прийом</h4>
                <p class="text-white mb-4">Оберіть послугу, дату та зручний час прийому.</p>
                <a href="appointment.html?service=${service.slug}" class="btn btn-dark py-2 px-4">Записатися</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${renderFaq(service.faqs)}
    `
  }

  async function loadServiceDetails() {
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/services/${slug}`)

      if (!response.ok) {
        throw new Error('Не вдалося завантажити послугу')
      }

      const service = await response.json()
      renderService(service)
    } catch (error) {
      serviceDetailsPage.innerHTML = `
        <div class="container py-5 text-center">
          <h1 class="mb-3">Послугу не знайдено</h1>
          <p class="mb-4">${error.message}</p>
          <a href="service.html" class="btn btn-primary">Повернутися до послуг</a>
        </div>
      `
    }
  }

  loadServiceDetails()
})()

const appointmentForm = document.getElementById('appointmentForm');
const patientNameInput = document.getElementById('patientName');
const appointmentCommentInput = document.getElementById('appointmentComment');

async function submitAppointment(event) {
    event.preventDefault();

    if (!appointmentForm.checkValidity()) {
        appointmentForm.classList.add('was-validated');
        return;
    }

    const selectedServiceOption = serviceSelect.options[serviceSelect.selectedIndex];
    const selectedDoctorOption = doctorSelect.options[doctorSelect.selectedIndex];

    const serviceId = selectedServiceOption?.dataset.id;
    const doctorId = selectedDoctorOption?.dataset.id;

    const fullName = patientNameInput.value.trim().split(' ');

    const appointmentData = {
        patientFirstName: fullName[0] || '',
        patientLastName: fullName.slice(1).join(' ') || '',
        patientPhone: phoneInput.value.trim(),
        patientEmail: '',
        serviceId,
        doctorId,
        appointmentDate: convertDateToApiFormat(appointmentDateInput.value),
        startTime: appointmentTimeSelect.value,
        comment: appointmentCommentInput.value.trim(),
    };

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Не вдалося створити запис');
        }

        appointmentForm.reset();
        appointmentForm.classList.remove('was-validated');

        doctorSelect.innerHTML = '<option selected disabled value="">Спочатку оберіть послугу</option>';
        doctorSelect.disabled = true;

        appointmentTimeSelect.innerHTML = '<option selected disabled value="">Спочатку оберіть дату</option>';
        appointmentTimeSelect.disabled = true;

        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    } catch (error) {
        console.error('Appointment submit error:', error);
        alert(error.message);
    }
}

if (appointmentForm) {
    appointmentForm.addEventListener('submit', submitAppointment);
}

const phoneLeadForm = document.getElementById('phoneLeadForm');
const phoneLeadInput = document.getElementById('phoneLeadInput');

function formatUkrainianPhone(value) {
    const digits = value.replace(/\D/g, '').replace(/^38/, '').slice(0, 10);

    let formatted = '+38';

    if (digits.length > 0) {
        formatted += ` (${digits.slice(0, 3)}`;
    }

    if (digits.length >= 3) {
        formatted += `) ${digits.slice(3, 6)}`;
    }

    if (digits.length >= 6) {
        formatted += `-${digits.slice(6, 8)}`;
    }

    if (digits.length >= 8) {
        formatted += `-${digits.slice(8, 10)}`;
    }

    return formatted;
}

if (phoneLeadInput) {
    phoneLeadInput.addEventListener('input', function () {
        this.value = formatUkrainianPhone(this.value);
    });

    phoneLeadInput.addEventListener('focus', function () {
        if (!this.value.trim()) {
            this.value = '+38 (0';
        }
    });
}

if (phoneLeadInput && typeof window.intlTelInput === 'function') {
    window.intlTelInput(phoneLeadInput, {
        initialCountry: 'ua',
        separateDialCode: true,
        preferredCountries: ['ua'],
        utilsScript:
            'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
    });
}

async function submitPhoneLead(event) {
    event.preventDefault();

    if (!phoneLeadInput.value.trim()) {
        return;
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/api/phone-leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phoneLeadInput.value.trim(),
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Не вдалося відправити заявку');
        }

        phoneLeadForm.reset();

        const successModal = new bootstrap.Modal(
            document.getElementById('successModal')
        );

        successModal.show();
    } catch (error) {
        console.error('Phone lead submit error:', error);

        alert(error.message);
    }
}

if (phoneLeadForm) {
    phoneLeadForm.addEventListener('submit', submitPhoneLead);
}