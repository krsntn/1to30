const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';

console.log(`Using environment config: ${activeEnv}`);

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

module.exports = {
  siteMetadata: {
    title: `1to30 - Game`,
    description: `Click from 1 to 30 as fast as you can`,
    author: `krsntn`,
    profileUrl: 'https://dev.karson.tk',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `1to30 - Game`,
        short_name: `1to30`,
        start_url: `/`,
        background_color: `#007bff`,
        theme_color: `#3498db`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
  ],
};
