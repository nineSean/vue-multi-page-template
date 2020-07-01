const common = {

}

const ENV_VARIABLE = {
  production: {
    ...common,
    baseUrl: '/',
    url: '/',
  },
  development: {
    ...common,
    baseUrl: '/',
    url: process.env.MOCK ? '/' : '/',
  },
}

export default ENV_VARIABLE[process.env.NODE_ENV]
