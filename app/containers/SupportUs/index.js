/**
 *
 * QuickStart
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get } from 'lodash';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectQuickStart from './selectors';
import reducer from './reducer';
import saga from './saga';

import { defaultAction } from './actions';
import './style.css';

export function QuickStart({ getContentPage, quickStart }) {
  useInjectReducer({ key: 'quickStart', reducer });
  useInjectSaga({ key: 'quickStart', saga });

  useEffect(() => {
    getContentPage();

  }, []);

  return (
    <div>
      <Helmet>
        <title>World of Darkness - MET - Vampire - SupportUs</title>
        <meta name="description" content="Description of Merits" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-12 order-md-12">
            <div className="boxWhite">
              <div className="row">
                <h1
                  style={{
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {get(quickStart, 'data.title')}
                </h1>
                <div
                  className="content-page-content"
                  /* eslint-disable-next-line react/no-danger */
                  dangerouslySetInnerHTML={{
                    __html: get(quickStart, 'data.description'),
                  }}
                />
                <div
                  className="content-page-content"
                  /* eslint-disable-next-line react/no-danger */
                  dangerouslySetInnerHTML={{
                    __html: get(quickStart, 'data.quote'),
                  }}
                />
                <div
                  className="content-page-content"
                  /* eslint-disable-next-line react/no-danger */
                  dangerouslySetInnerHTML={{
                    __html: get(quickStart, 'data.system'),
                  }}
                />
              </div>
              <form
                action="https://www.paypal.com/donate"
                method="post"
                target="_top"
              >
                <input
                  type="hidden"
                  name="hosted_button_id"
                  value="8PUS5TKR868YA"
                />
                <input
                  type="image"
                  src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
                  border="0"
                  name="submit"
                  title="PayPal - The safer, easier way to pay online!"
                  alt="Donate with PayPal button"
                />
                <img
                  alt="nightStudio"
                  border="0"
                  src="https://www.paypal.com/en_US/i/scr/pixel.gif"
                  width="1"
                  height="1"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

QuickStart.propTypes = {
  ...QuickStart,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  quickStart: makeSelectQuickStart(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getContentPage: () => dispatch(defaultAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(QuickStart);
