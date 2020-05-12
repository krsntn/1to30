import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import Header from '../Header';
import css from './layout.module.scss';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          profileUrl
        }
      }
    }
  `);

  const { title, profileUrl } = data.site.siteMetadata;

  return (
    <>
      <Header siteTitle={title} />
      <div className={css.main}>
        <main>{children}</main>
        <footer className={`${css.footer} text-center mb-5`}>
          © 2020, Built by
          {` `}
          <a href={profileUrl}>karson</a>
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
