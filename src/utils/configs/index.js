const common = {

}

const ENV_VARIABLE = {
  production: {
    ...common,
    baseUrl: '/',
    url: '',
  },
  development: {
    ...common,
    baseUrl: '/',
    url: '',
  },
}

export default ENV_VARIABLE[process.env.NODE_ENV]

