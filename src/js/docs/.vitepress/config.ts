// https://vitepress.dev/reference/site-config
export default {
  base: "/stream-deck-time-tracker/",
  title: "Stream Deck Time Tracker",
  description: "A plugin for Elgato Stream Deck",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentation", link: "/documentation" },
      { text: "Support", link: "/support" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Documentation", link: "/documentation" },
          { text: "Support", link: "/support" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/b263/stream-deck-time-tracker",
      },
    ],

    footer: {
      message:
        '<a href="https://ko-fi.com/M4M3SNODI" rel="noopener,nofollow"><img style="display: inline" src="https://ko-fi.com/img/githubbutton_sm.svg"></a>',
      copyright: "Copyright © 2023-present Bastian Bräu",
    },
  },
};
