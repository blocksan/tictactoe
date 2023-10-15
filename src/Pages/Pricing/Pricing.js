import React from 'react'
import Header from '../../Layout/VerticalLayout/Header'
import Footer from '../../Layout/VerticalLayout/Footer'

function Pricing() {
  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header />
        Pricing
        {/* <div className="main-content" style={{background:"#F5F7FF"}}>{props.children}</div> */}
        <Footer />
      </div>
      {/* {showRightSidebar ? <RightSidebar /> : null} */}
    </React.Fragment>
  )
}

export default Pricing