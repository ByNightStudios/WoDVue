import React from "react";
import { Button, Form } from "react-bootstrap";
import SideNavigation from "../../components/SideNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { getRenderingHeader } from "../../common/helpers";
import styles from "./shc.scss";
import { connect } from "react-redux";
import requireAuth from "../../hoc/requireAuth";
import hasPermission from "../../hoc/hasPermission";
import { consumerSearchList } from "../../actions/EmergencyActions";
import SHCList from "./shc";

class SHC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationDeployed: true,
    };
  }

  componentDidMount() {}

  handleNavigationToggle = () => {
    this.setState({ navigationDeployed: !this.state.navigationDeployed });
  };

  render() {
    const { navigationDeployed } = this.state;

    return (
      <React.Fragment>
        {getRenderingHeader(this.props.user)}
        <div
          className={
            navigationDeployed
              ? "addelders-page sidebar-page sidebar-page--open position-relative"
              : "addelders-page sidebar-page sidebar-page--closed position-relative"
          }
          style={styles}
        >
          {navigationDeployed ? (
            <SideNavigation handleClose={this.handleNavigationToggle} />
          ) : (
            <Button
              type="button"
              className="btn btn-trigger"
              onClick={this.handleNavigationToggle}
            >
              <FontAwesomeIcon icon={faCaretRight} size="2x" color="#780001" />
            </Button>
          )}

          <main className="sidebar-page-wrapper position-relative">
            <SHCList />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default hasPermission(
  requireAuth(
    connect(mapStateToProps, {
      consumerSearchList,
    })(SHC)
  )
);
