import PropTypes from 'prop-types';
import React from 'react';
import PublicHeader from '../components/Common/PublicHeader';
import Footer from '../Layout/VerticalLayout/Footer';

const PublicLayout = (props) => {
  return (
    <React.Fragment>
      <div id="layout-wrapper" className="public-layout">
        <PublicHeader />
        <div className="main-content">
          {props.children}
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
};

PublicLayout.propTypes = {
  children: PropTypes.any,
};

export default PublicLayout;
