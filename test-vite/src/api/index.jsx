import axios from "axios";

const ApiCustomer = axios.create({
    baseURL: 'http://localhost:3000'
})

export default ApiCustomer;