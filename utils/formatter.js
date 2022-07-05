const generateDay = (day) => {
    const lastDigit = Number(day.toString().split('').pop())

    if (lastDigit === 1) {
        return `${day}st`
    } else if (lastDigit === 2) {
        return `${day}nd`
    } else if (lastDigit === 3) {
        return `${day}rd`
    } else {
        return `${day}th`
    }
}

const AMPM = hour => hour <= 12 ? 'am' : 'pm'

module.exports = {
    format_date: date => {
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const month = date.toLocalString('default', { month: 'short' })
        const year = new Date(date).getFullYear()
        return `${month} ${generateDay(day)}, ${year} at ${hour % 12}:${minute} ${AMPM(hour)}`
    }
}