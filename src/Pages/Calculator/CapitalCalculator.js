import React from "react";
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const CapitalCalculator = () => {
  document.title = "Capital Calculator";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="F&O Calculator" breadcrumbItem="Capital Calculator" />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CapitalCalculator;