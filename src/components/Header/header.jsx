import PropTypes from 'prop-types';
import React from 'react';
import css from './header.module.scss';

const Header = ({ siteTitle }) => (
  <header className={`${css.header} bg-primary`}>
    <div className={css.container}>
      <h1 className={`${css.h1} text-light`}>{siteTitle}</h1>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
