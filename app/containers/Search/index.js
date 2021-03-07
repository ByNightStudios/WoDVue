/**
 *
 * Search
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Card } from 'antd';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import get from 'lodash/get';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

import makeSelectSearch from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.css';

export function Search() {
  useInjectReducer({ key: 'search', reducer });
  useInjectSaga({ key: 'search', saga });

  const searchClient = algoliasearch(
    'FLL6X8YRIN',
    'c119ed5ee357491175144486cc23ab97',
    'prod',
  );

  const AntdCard = ({ hit }) => {
    return (
      <Card title={hit.title}>
        {' '}
        <Card.Meta description={get(hit, 'summary[0]')} />
      </Card>
    );
  };

  return (
    <div className="ais-InstantSearch">
      <h1>React InstantSearch e-commerce demo</h1>
      <InstantSearch indexName="prod" searchClient={searchClient}>
        <div className="right-panel">
          <SearchBox />
          <Hits hitComponent={AntdCard} />
        </div>
      </InstantSearch>
    </div>
  );
}

Search.propTypes = {
  ...Search,
};

const mapStateToProps = createStructuredSelector({
  search: makeSelectSearch(),
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

export default compose(withConnect)(Search);
