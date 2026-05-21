const prisma = require('../src/config/prisma')

const doctors = [
  {
    firstName: 'Олександр',
    lastName: 'Мельник',
    slug: 'oleksandr-melnyk',
    position: 'Лікар-стоматолог терапевт',
    experience: 8,
    education: 'Івано-Франківський національний медичний університет',
    certificates: 'Ендодонтичне лікування постійних зубів; Художня реставрація фронтальної групи зубів; Сучасні протоколи лікування карієсу',
    description: 'Проводить консультації, профілактичні огляди, лікування карієсу, ендодонтичне лікування та естетичні реставрації.',
    image: 'img/team-1.jpg',
    sortOrder: 1,
    services: ['therapeutic-dentistry', 'professional-hygiene', 'teeth-whitening'],
  },
  {
    firstName: 'Ірина',
    lastName: 'Коваль',
    slug: 'iryna-koval',
    position: 'Лікар-стоматолог хірург-імплантолог',
    experience: 10,
    education: 'Львівський національний медичний університет імені Данила Галицького',
    certificates: 'Планування імплантації зубів; Хірургічні протоколи в стоматології; Відновлення зубного ряду на імплантах',
    description: 'Консультує пацієнтів щодо імплантації, проводить хірургічні втручання та планує подальше відновлення зубів.',
    image: 'img/team-2.jpg',
    sortOrder: 2,
    services: ['dental-implants', 'tooth-extraction', 'prosthetic-dentistry'],
  },
  {
    firstName: 'Андрій',
    lastName: 'Савчук',
    slug: 'andriy-savchuk',
    position: 'Лікар-ортодонт',
    experience: 7,
    education: 'Буковинський державний медичний університет',
    certificates: 'Ортодонтичне лікування брекет-системами; Елайнери у сучасній ортодонтії; Діагностика прикусу у дорослих і дітей',
    description: 'Займається діагностикою прикусу, ортодонтичним лікуванням брекет-системами та прозорими капами.',
    image: 'img/team-3.jpg',
    sortOrder: 3,
    services: ['orthodontic-treatment', 'pediatric-dental-care'],
  },
  {
    firstName: 'Наталія',
    lastName: 'Грицак',
    slug: 'natalia-hrytsak',
    position: 'Дитячий лікар-стоматолог',
    experience: 6,
    education: 'Івано-Франківський національний медичний університет',
    certificates: 'Адаптація дітей до стоматологічного лікування; Профілактика карієсу у дітей; Лікування молочних зубів',
    description: 'Працює з дітьми, проводить профілактичні огляди, лікування молочних зубів та адаптацію маленьких пацієнтів до прийому.',
    image: 'img/team-4.jpg',
    sortOrder: 4,
    services: ['pediatric-dental-care', 'professional-hygiene'],
  },
  {
    firstName: 'Марта',
    lastName: 'Данилюк',
    slug: 'marta-danyliuk',
    position: 'Стоматолог-гігієніст',
    experience: 5,
    education: 'Івано-Франківський медичний фаховий коледж',
    certificates: 'Професійна гігієна порожнини рота; Пародонтологічна профілактика; Індивідуальний підбір засобів гігієни',
    description: 'Проводить професійну гігієну, профілактику захворювань ясен та навчає пацієнтів правильному домашньому догляду.',
    image: 'img/team-5.jpg',
    sortOrder: 5,
    services: ['professional-hygiene', 'teeth-whitening'],
  },
  {
    firstName: 'Віктор',
    lastName: 'Бондаренко',
    slug: 'viktor-bondarenko',
    position: 'Лікар-стоматолог ортопед',
    experience: 12,
    education: 'Національний медичний університет імені О. О. Богомольця',
    certificates: 'Ортопедичне відновлення зубів; Керамічні коронки та вініри; Цифрове планування усмішки',
    description: 'Спеціалізується на коронках, вінірах, мостоподібних конструкціях та комплексному відновленні зубного ряду.',
    image: 'img/team-1.jpg',
    sortOrder: 6,
    services: ['prosthetic-dentistry', 'teeth-whitening', 'dental-implants'],
  },
  {
    firstName: 'Олена',
    lastName: 'Ткачук',
    slug: 'olena-tkachuk',
    position: 'Лікар-стоматолог терапевт',
    experience: 9,
    education: 'Тернопільський національний медичний університет',
    certificates: 'Лікування карієсу та пульпіту; Реставрація жувальних зубів; Сучасна ізоляція робочого поля',
    description: 'Займається терапевтичним лікуванням, реставраціями та профілактичними оглядами дорослих пацієнтів.',
    image: 'img/team-2.jpg',
    sortOrder: 7,
    services: ['therapeutic-dentistry', 'professional-hygiene'],
  },
  {
    firstName: 'Юрій',
    lastName: 'Павлюк',
    slug: 'yuriy-pavliuk',
    position: 'Лікар-стоматолог хірург',
    experience: 11,
    education: 'Львівський національний медичний університет імені Данила Галицького',
    certificates: 'Атравматичне видалення зубів; Хірургічна стоматологія; Підготовка до імплантації',
    description: 'Проводить видалення зубів, хірургічні консультації та підготовку пацієнтів до подальшого відновлення.',
    image: 'img/team-3.jpg',
    sortOrder: 8,
    services: ['tooth-extraction', 'dental-implants'],
  },
  {
    firstName: 'Софія',
    lastName: 'Левицька',
    slug: 'sofia-levytska',
    position: 'Лікар-ортодонт',
    experience: 6,
    education: 'Буковинський державний медичний університет',
    certificates: 'Ортодонтична діагностика; Брекет-системи; Елайнери для дорослих пацієнтів',
    description: 'Проводить ортодонтичну діагностику, веде лікування брекет-системами та прозорими елайнерами.',
    image: 'img/team-4.jpg',
    sortOrder: 9,
    services: ['orthodontic-treatment'],
  },
  {
    firstName: 'Роман',
    lastName: 'Іванишин',
    slug: 'roman-ivanyshyn',
    position: 'Лікар-стоматолог терапевт-естетист',
    experience: 8,
    education: 'Івано-Франківський національний медичний університет',
    certificates: 'Естетичні реставрації; Відбілювання зубів; Композитні вініри',
    description: 'Працює з естетичними реставраціями, відбілюванням зубів та відновленням природної форми усмішки.',
    image: 'img/team-5.jpg',
    sortOrder: 10,
    services: ['therapeutic-dentistry', 'teeth-whitening', 'prosthetic-dentistry'],
  },
  {
    firstName: 'Христина',
    lastName: 'Мороз',
    slug: 'khrystyna-moroz',
    position: 'Дитячий лікар-стоматолог',
    experience: 4,
    education: 'Івано-Франківський національний медичний університет',
    certificates: 'Поведінкова адаптація дітей; Профілактика карієсу молочних зубів; Герметизація фісур',
    description: 'Працює з дітьми, допомагає адаптуватися до стоматолога та проводить профілактичні процедури.',
    image: 'img/team-1.jpg',
    sortOrder: 11,
    services: ['pediatric-dental-care', 'professional-hygiene'],
  },
  {
    firstName: 'Тарас',
    lastName: 'Шевчук',
    slug: 'taras-shevchuk',
    position: 'Лікар-стоматолог імплантолог-ортопед',
    experience: 13,
    education: 'Національний медичний університет імені О. О. Богомольця',
    certificates: 'Комплексне відновлення зубів; Імплантація та протезування; Ортопедичні конструкції на імплантах',
    description: 'Планує комплексне відновлення зубів, працює з імплантацією та ортопедичними конструкціями.',
    image: 'img/team-2.jpg',
    sortOrder: 12,
    services: ['dental-implants', 'prosthetic-dentistry', 'tooth-extraction'],
  },
]

const schedules = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 4, startTime: '10:00', endTime: '19:00' },
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
]

async function main() {
  for (const doctor of doctors) {
    const savedDoctor = await prisma.doctor.upsert({
      where: {
        slug: doctor.slug,
      },
      update: {
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        position: doctor.position,
        experience: doctor.experience,
        education: doctor.education,
        certificates: doctor.certificates,
        description: doctor.description,
        image: doctor.image,
        sortOrder: doctor.sortOrder,
        isActive: true,
      },
      create: {
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        slug: doctor.slug,
        position: doctor.position,
        experience: doctor.experience,
        education: doctor.education,
        certificates: doctor.certificates,
        description: doctor.description,
        image: doctor.image,
        sortOrder: doctor.sortOrder,
        isActive: true,
      },
    })

    await prisma.doctorService.deleteMany({
      where: {
        doctorId: savedDoctor.id,
      },
    })

    for (const serviceSlug of doctor.services) {
      const service = await prisma.service.findUnique({
        where: {
          slug: serviceSlug,
        },
      })

      if (!service) {
        console.warn(`Service not found: ${serviceSlug}`)
        continue
      }

      await prisma.doctorService.create({
        data: {
          doctorId: savedDoctor.id,
          serviceId: service.id,
        },
      })
    }

    for (const schedule of schedules) {
      await prisma.doctorSchedule.upsert({
        where: {
          id: `${savedDoctor.id}-${schedule.dayOfWeek}`,
        },
        update: {
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: true,
        },
        create: {
          doctorId: savedDoctor.id,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: true,
        },
      })
    }
  }

  console.log('Doctors seed completed successfully')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })