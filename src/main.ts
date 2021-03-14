import {createApp} from "vue"
import App from "./App.vue"
import installElementPlus from "./plugins/element"
import i18n from "./i18n"

const app = createApp(App).use(i18n).use(i18n)
installElementPlus(app)
app.mount("#app")
