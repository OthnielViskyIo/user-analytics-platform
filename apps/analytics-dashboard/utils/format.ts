export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const formatPageName = (name: string) => {
  if (name === '/') {
    return 'Home'
  }

  if (name.indexOf('biome') > -1) {
    const biome = name.split('/')[2]

    if (biome) {
      return capitalize(biome)
    }
    return name
  }

  return capitalize(name.split('/').pop() || '')
}

export const formatTime = (seconds: number) => {
  if (seconds < 60) return seconds === 1 ? `${seconds} sec` : `${seconds} secs`

  const mins = Math.ceil(seconds / 60)
  if (mins < 60) return mins === 1 ? `${mins} min` : `${mins} mins`

  const hours = Math.ceil(mins / 60)
  if (hours < 24) return hours === 1 ? `${hours} hour` : `${hours} hours`

  const days = Math.ceil(hours / 24)
  if (days < 365) return days === 1 ? `${days} day` : `${days} days`

  const years = Math.ceil(days / 365)
  return years === 1 ? `${years} year` : `${years} years`
}
