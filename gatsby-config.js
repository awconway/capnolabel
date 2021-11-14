require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
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
    },
    'gatsby-plugin-remove-serviceworker',
],
};
