function toQueryString(queryObject) {
  return Object.entries(queryObject).reduce((accumulator, [key, val], idx, {length}) => {
    idx === 0 && (accumulator = '?' + accumulator)
    idx !== length - 1 && (val = val + '&')
    if (val === undefined) return accumulator
    return accumulator + key + '=' + val
  }, '')
}

function goTo({name = '', query = {}, type = ''} = {}) {
  const params = toQueryString(query)
  const url = `${process.env.BASE_URL}${name}${params}`
  type === 'replace' ? location.replace(url) : (location.href = url)
}

function setRemCb(){
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px'
}
function setRem() {
  setRemCb()
  window.onresize = setRemCb
}

export {
  goTo,
  setRem,
}