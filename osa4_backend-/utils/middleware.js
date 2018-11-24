// middleware, hiljennetty testien ajaksi
const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }

  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// middleware errorien käsittelyyn
const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// const tokenExtractor = (request) => {
// //const getTokenFrom = (request) => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }


module.exports = {
  logger,
  error,
  //tokenExtractor
}