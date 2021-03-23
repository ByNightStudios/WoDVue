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

  function getItems(item) {
    if (item.title) {
      return item.title;
    }
    if (item.merit) {
      return item.merit;
    }
    if (item.flaw) {
      return item.flaw;
    }

    if (item.technique) {
      return item.technique;
    }
    return item.attribute;
  }

  const AntdCard = ({ hit }) => (
    <Card title={getItems(hit)}>
      <Card.Meta
        description={get(hit, 'summary[0]', get(hit, 'meritDescription[0]'))}
      />
    </Card>
  );

  return (
    <div className="ais-InstantSearch">
      <InstantSearch indexName="datajson" searchClient={searchClient}>
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
