const TIME_URL = 'https://worldtimeapi.org/api/timezone'

export const fetchTimezoneList = async () => {
  const res = await fetch(`${TIME_URL}`)

  if (res.ok) {
    const data = await res.json()
    return data
  }

  throw new Error(`HTTP error! status: ${res.status}`)
}

export const fetchTimeByCityName = async (area: string, city: string) => {
  const res = await fetch(`${TIME_URL}/${area}/${city}`)

  if (res.ok) {
    const data = await res.json()
    return data
  }

  throw new Error(`HTTP error! status: ${res.status}`)
}
