require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    siteUrl: "https://capnolabel.gatsbyjs.io",
    title: "capnolabel",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: { prefixes: ['/*'] },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: `${__dirname}/src/images/svg`
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Capnography waveform labelling app`,
        short_name: `capnoaudit`,
        description: `Labelling app for capnography waveforms`,
        lang: `en`,
        display: `standalone`,
        icon: `src/images/icon.png`,
        start_url: `/`,
        background_color: `#403f53`,
        theme_color: `#403f53`,
      },
    },
    {
      resolve: 'gatsby-plugin-webfonts',
      options: {
        fonts: {
          google: [
            {
              family: "Fira+Code",
              variants: ["300", "400", "500"],
            },
          ],
        },
      },
    }
],
};
