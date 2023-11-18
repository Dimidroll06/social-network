import { jwtDecode } from "jwt-decode";
import axios from "axios";

class ApiController {
    #access_token

    constructor() {
        this.load();
    }

    save() {
        localStorage.setItem("access_token", this.#access_token);
    }

    load() {
        this.setAccessToken(localStorage.getItem('access_token'));
    }

    // установка токена
    setAccessToken(v) {
        if (v !== null) {
            this.#access_token = v;
            axios.defaults.headers.common.Authorization = v;
            this.data = jwtDecode(v.split('Bearer ')[1]);
        }
        else {
            this.#access_token = null;
            delete axios.defaults.headers.common.Authorization;
            this.data = {};
        }

        this.save();
    }

    // ОСНОВНЫЕ МЕТОДЫ RESTAPI

    async post(method, data) {
        const res = await axios.post(method, data);
    }

    async get(method, data) {
        const res = await axios.get(method, data);
    }

    async put(method, data) {
        const res = await axios.put(method, data);
    }

    async delete(method, data) {
        const res = await axios.delete(method, data);
    }

    //

    // проверка авторизации
    get isAuthorized() { return !!this.#access_token }
}

export default new ApiController()