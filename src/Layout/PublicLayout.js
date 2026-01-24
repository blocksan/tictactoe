import PropTypes from 'prop-types';
import React from 'react';
import PublicHeader from '../components/Common/PublicHeader';
import Footer from '../Layout/VerticalLayout/Footer';

const PublicLayout = (props) => {
  return (
    <React.Fragment>
      <PublicHeader />
      {props.children}
      <Footer />
    </React.Fragment>
  );
};

PublicLayout.propTypes = {
  children: PropTypes.any,
};

export default PublicLayout;
