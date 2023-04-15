const getDefine = () => {
    if (process.argv.includes("generate") || process.argv.includes("build"))
        return {};
    return {
        global: {},
    };
};
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    head: {
        script: [
            {
                src: "https://cdn.polyfill.io/v3/polyfill.min.js?features=DynamicImport",
            },
            { src: "/path/to/dynamic-import-polyfill.js" },
        ],
    },
    ssr: false,
    vite: {
        define: getDefine(),
    },
    serverMiddleware: {
        "/api": "~/server/api",
    },
    css: ["~/assets/css/main.css", "vue-final-modal/style.css"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    typescript: {
        strict: true,
    },
    buildModules: ["@nuxtjs/tailwindcss"],
    modules: ["nuxt-icon"],
    axios: {
        proxy: true,
        baseURL: "https://127.0.0.1:3000/"
      },
});
