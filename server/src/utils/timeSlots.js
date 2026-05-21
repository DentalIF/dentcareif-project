function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function isOverlapping(slotStart, slotEnd, busyStart, busyEnd) {
  return slotStart < busyEnd && slotEnd > busyStart
}

function generateAvailableSlots({
  scheduleStart,
  scheduleEnd,
  serviceDuration,
  busyAppointments = [],
  step = 30,
}) {
  const startMinutes = timeToMinutes(scheduleStart)
  const endMinutes = timeToMinutes(scheduleEnd)

  const slots = []

  for (
    let slotStart = startMinutes;
    slotStart + serviceDuration <= endMinutes;
    slotStart += step
  ) {
    const slotEnd = slotStart + serviceDuration

    const hasConflict = busyAppointments.some((appointment) => {
      const busyStart = timeToMinutes(appointment.startTime)
      const busyEnd = timeToMinutes(appointment.endTime)

      return isOverlapping(slotStart, slotEnd, busyStart, busyEnd)
    })

    if (!hasConflict) {
      slots.push({
        startTime: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd),
      })
    }
  }

  return slots
}

module.exports = {
  timeToMinutes,
  minutesToTime,
  generateAvailableSlots,
}