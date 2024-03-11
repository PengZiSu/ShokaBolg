import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";
import router from "./router";
import "@/permission";
import SvgIcon from "@/components/SvgIcon.vue";
import "nprogress/nprogress.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "virtual:svg-icons-register";
import "element-plus/dist/index.css";
import "@/assets/styles/index.scss";
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import createEmojiPlugin from "@kangc/v-md-editor/lib/plugins/emoji/index";
import "@kangc/v-md-editor/lib/plugins/emoji/emoji.css";
import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";
import Prism from "prismjs";
import * as echarts from "echarts";
import { LegendComponent } from "echarts/components";
import VueCalendarHeatmap from "vue3-calendar-heatmap";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const pinia = createPinia();

echarts.use([LegendComponent]);
VueMarkdownEditor.use(vuepressTheme, { Prism })
  .use(createEmojiPlugin())
  .use(createTodoListPlugin());

app.use(VueCalendarHeatmap);
pinia.use(piniaPersist);
app.use(VueMarkdownEditor);
app.use(pinia);
app.component("svg-icon", SvgIcon);
app.use(router).mount("#app");
