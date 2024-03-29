import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import Main from '../components/Main';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Main />
  </Layout>
);

export default IndexPage;
