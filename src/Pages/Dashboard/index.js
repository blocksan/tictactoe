import React from "react";
import { Container, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { DashboardStats } from "./DashboardStats";
import OverView from './OverView'
const Dashboard = () => {
  document.title = "Dashboard";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Trrader" breadcrumbItem="Dashboard" />
        </Container>
        <Row>
          <DashboardStats />
        </Row>
        <Row>
            {/* Overview Chart */}
            <OverView />
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
