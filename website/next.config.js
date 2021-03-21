module.exports = {
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiEndpoint: process.env.DOCKER_API_ROOT_ENDPOINT,
    },
    publicRuntimeConfig: {
      apiEndpoint: process.env.PUBLIC_API_ROOT_ENDPOINT,
    },
  }
  