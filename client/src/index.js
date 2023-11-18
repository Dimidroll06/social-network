import '@riotjs/hot-reload'
import { component } from 'riot'
import App from './app.riot'
import axios from 'axios'
import registerGlobalComponents from './register-global-components'

import ApiController from './controllers/ApiController'
import AuthController from './controllers/AuthController'

// axios init
axios.defaults.baseURL = 'http://localhost:8080/api';
axios.defaults.validateStatus = ()=>(true); // don't throw errors plz
window.ApiController = ApiController;
window.AuthController = AuthController;

// register
registerGlobalComponents()

// mount the root tag
component(App)(document.getElementById('root'))
