import { useEffect, useLayoutEffect, useState } from 'react'
import { fetchTimeByCityName, fetchTimezoneList } from '../../services'
import { Button } from '../../components'
import styles from './Clock.module.css'

export function Clock() {
  const [currentArea, setCurrentArea] = useState<any | null>(null)
  const [currentSity, setCurrentSity] = useState<string | null>(null)
  const [timezoneList, setTimezoneList] = useState<{ [key: string]: string[] }>({})
  const [time, setTime] = useState<{ hh: number, mm: number, ss: number } | null>(null)
  const [timestamp, setTimestamp] = useState<number | null>(null)

  const tick = (timestamp: number) => {
    const date = new Date(timestamp)
    const hh = date.getHours() * 30 - 360
    const mm = date.getMinutes() * 6
    const ss = date.getSeconds() * 6
    setTime({ hh, mm, ss })
    setTimestamp(timestamp)
  }

  useLayoutEffect(() => {
    fetchTimezoneList().then((data) => {
      let tmp: any = {}

      data.forEach((zone: string) => {
        if (zone.indexOf('/') > 0) {
          const [timeZone, area, sity] = zone.split('/')
          const fullAria = `${area}${sity ? `/${sity}` : ""}`

          tmp[timeZone] = tmp[timeZone]
            ? [...tmp[timeZone], fullAria]
            : [fullAria];
        }
      })
      setTimezoneList(tmp)
    })
  }, [])

  useEffect(() => {
    if (!currentSity) return

    fetchTimeByCityName(currentArea.area, currentSity)
      .then((data) => {
        const datetime = data.datetime
        const timestamp = Date.parse(datetime.split('+', 1))

        setTimestamp(timestamp)
      })

  }, [currentSity, currentArea])

  useEffect(() => {
    if (!timestamp) return

    const timer = setTimeout(() => {
      tick(timestamp + 1000)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timestamp])

  const restartLocation = () => {
    setCurrentArea(null)
    setCurrentSity(null)
    setTimestamp(null)
    setTime(null)
  }

  return (
    <section className={styles.clock}>
      {!currentSity ? (
        <>
          <h2>Выберите {!currentArea ? 'область' : 'город'}</h2>
          <ul className={styles.list}>
            {!currentArea ? (
              Object.keys(timezoneList).map((area) => (
                <li className={styles.item} key={area}>
                  <Button secondary handleClick={() => setCurrentArea({
                    area: area,
                    sitys: timezoneList[area],
                  })}>
                    {area}
                  </Button>
                </li>
              ))
            ) : (
              Object.values(currentArea.sitys).map((sity) => (
                <li className={styles.item} key={sity as string}>
                  <Button secondary handleClick={() => setCurrentSity(sity as string)}>
                    {sity as string}
                  </Button>
                </li>
              ))
            )}
          </ul>
        </>
      ) : time && (
        <>
          <Button primary handleClick={restartLocation}>
            сменить локацию
          </Button>
          <h2>{currentSity}</h2>
          <div className={styles.clockFace}>
            <div className={styles.arrowsGroup}>
              {Object.keys(time).map((item) => (
                <div key={item} style={{ transform: `rotate(${(time as any)[item]}deg)` }} className={`${styles.arrow} ${styles[item]}`}>
                  <span className={styles.rotate} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
