import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerDefinition = {
  info: {
    title: 'Rides API',
    version: '1.0.0',
    description: 'Rides API Information',
  },
  host: `localhost:8010`,
}
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ['./src/routes/*.ts'],
}
const swaggerDocs = swaggerJsDoc(options)

export default swaggerDocs
