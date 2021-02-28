module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
  pwa: {
    name: "planted",
    themeColor: "#BFB8A3",
    appleMobileWebAppCapable: "yes",
    manifestOptions: {
      background_color: "#BFB8A3",
    },
  },
}
