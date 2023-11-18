import axios from "axios";

class AuthController {
    data = {}
    #login_form = null

    constructor() {
        this.load();
    }

    // загрузка данных из localstorage
    load() {
        this.data = localStorage.getItem('userdata') ? JSON.parse(localStorage.getItem('userdata')) : {};
        this.#login_form = localStorage.getItem('login_form')?JSON.parse(localStorage.getItem('login_form')):null;
    }

    // сохранение данных в localstorage
    save() {
        if (!ApiController.isAuthorized) return;
        localStorage.setItem("userdata", JSON.stringify(this.data));
        localStorage.setItem("login_form", JSON.stringify(this.#login_form));
    }

    // вход
    async login(username, password) {
        const res = await axios.post('/auth/login', {
            username, password
        });

        if (res.status === 200) {
            ApiController.setAccessToken(res.data.data.token);
            this.#login_form = {
                username,
                password
            };

            this.save();
        };
        
        return res.data;
    }

    // регистрация
    async register(username, password, repeat_password){
        const res = await axios.post('/auth/register', {
            username, password, repeat_password
        });

        return res.data;
    }

    // Обновить access token
    async refreshAccessToken() {
        const { username, password } = this.#login_form;
        const res = await axios.post('/auth/login', {
            username, password
        });

        if (res.status === 200) ApiController.setAccessToken(res.data.data.token);

        return res.data;
    }
}

export default new AuthController();