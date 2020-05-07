import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

function SEO({ description, lang, meta, title }) {
  const { file } = useStaticQuery(
    graphql`
      query {
        file(name: { eq: "icon" }) {
          childImageSharp {
            fluid {
              src
            }
          }
        }
      }
    `
  );

  let src = null;
  if (
    file &&
    file.childImageSharp &&
    file.childImageSharp.fluid &&
    file.childImageSharp.fluid.src
  ) {
    src = file.childImageSharp.fluid.src;
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
    >
      {/* <!-- Primary Meta Tags --> */}
      <title>1to30 - Game</title>
      <meta name="title" content="1to30 - Game" />
      <meta
        name="description"
        content="Clicking from 1 to 30 as fast as you can. Challenge your friends"
      />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://1to30.tk" />
      <meta property="og:title" content="1to30 - Game" />
      <meta
        property="og:description"
        content="Clicking from 1 to 30 as fast as you can. Challenge your friends"
      />
      <meta property="og:image" content={src} />

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://1to30.tk" />
      <meta property="twitter:title" content="1to30 - Game" />
      <meta
        property="twitter:description"
        content="Clicking from 1 to 30 as fast as you can. Challenge your friends"
      />
      <meta property="twitter:image" content={src} />
    </Helmet>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
