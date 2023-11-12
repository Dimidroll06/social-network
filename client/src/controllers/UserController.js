import axios from "axios";
import { jwtDecode } from "jwt-decode";

class UserController {
    #access_token = null
    data = {}

    constructor() {
        this.load();
    }

    load() {
        this.setAccessToken(localStorage.getItem('access_token'));
        this.data = localStorage.getItem('userdata') ? JSON.parse(localStorage.getItem('userdata')) : {};
    }

    save() {
        if (!this.#access_token) return;
        localStorage.setItem("access_token", this.#access_token);
        localStorage.setItem("userdata", JSON.stringify(this.data));
    }

    setAccessToken(v) {
        if (v) {
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

    async login(username, password) {
        const res = await axios.post('/auth/login', {
            username, password
        });

        if (res.status === 200) this.setAccessToken(res.data.data.token);
        
        return res.data;
    }

    async register(username, password, repeat_password){
        const res = await axios.post('/auth/register', {
            username, password, repeat_password
        });

        return res.data;
    }

    get isAuthorized() { return !!this.#access_token }
}

export default new UserController();