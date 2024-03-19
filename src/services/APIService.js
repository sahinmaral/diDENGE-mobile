import axios from "axios"

const fetchRegisterUser = async (values) => {
    return axios.post("http://localhost:5178/api/Auth/Register", values)
}

const fetchLoginUser = async (values) => {
    return axios.post("http://localhost:5178/api/Auth/Login", values)
}


export { fetchRegisterUser, fetchLoginUser }