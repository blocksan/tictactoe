import React from "react";
import { Col, Row } from "reactstrap";

const Breadcrumbs = (props) => {
  return (
    <React.Fragment>
      <Row>
        <Col xs="12">
          {/* <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h1 className="mb-0 font-size-18 fw-bold text-dark">
              {props.breadcrumbItem}
            </h1>
            <div className="page-title-right">
              <Breadcrumb listClassName="m-0">
                <BreadcrumbItem>
                  <Link to="#">{props.title}</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                  <Link to="#">{props.breadcrumbItem}</Link>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div> */}
        </Col>
      </Row>
    </React.Fragment>
  );
}



export default Breadcrumbs;
