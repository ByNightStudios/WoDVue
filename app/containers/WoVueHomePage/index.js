/**
 *
 * WoVueHomePage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectWoVueHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';

export function WoVueHomePage() {
  useInjectReducer({ key: 'woVueHomePage', reducer });
  useInjectSaga({ key: 'woVueHomePage', saga });

  return (
    <div>
      <div className="container main-content">
        <div className="row rowBox">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="box clans">
              <h4>Clans & Blodlines</h4>
              <a
                href="/WoDVue/monsters/vampire/clan/"
                className="btn btn-primary"
              >
                Explore
              </a>
            </div>
          </div>
          <div className="col">
            <div className="box disciplines">
              <h4>Disciplines</h4>
              <a href="/Disciplines" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>
          <div className="col">
            <div className="box techniques">
              <h4>Techniques</h4>
              <a href="/Techniques/" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>
          <div className="col">
            <div className="box skills">
              <h4>Skills</h4>
              <a href="/Skills" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>
        </div>
        {/* <div className="fullWidth">
          <div className="boxBanner">
            <a href="" className="btn btn-primary">
              Register Now
            </a>
          </div>
        </div> */}

        <div className="row rowMiniBox">
          <div className="col-md-6">
            <div className="box merits">
              <h4>MERITS</h4>
              <a href="/MERITS" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box flaws">
              <h4>Flaws</h4>
              <a href="/Flaws" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box attributes">
              <h4>Attributes</h4>
              <a href="/Attributes" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box bgs">
              <h4>Backgrounds</h4>
              <a href="/Backgrounds" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>

          <div className="col-md-6">
            <div className="box bgs">
              <h4>RITUALS</h4>
              <a href="/Rituals" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>

          <div className="col-md-6">
            <div className="box bgs">
              <h4>QUICK START</h4>
              <a href="/QuickStart" className="btn btn-primary">
                Explore
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

WoVueHomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  woVueHomePage: makeSelectWoVueHomePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(WoVueHomePage);
