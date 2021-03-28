/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * Merits
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  map,
  slice,
  filter,
  orderBy,
  get,
  without,
  uniq,
  sortBy,
  isEmpty,
  toLower,
  trim,
  includes,
  concat,
  uniqBy,
  toNumber,
} from 'lodash';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Select } from 'antd';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectApp } from 'containers/App/selectors';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import makeSelectMerits from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.css';

export function Merits({ app }) {
  useInjectReducer({ key: 'merits', reducer });
  useInjectSaga({ key: 'merits', saga });
  const [meritsData, setMeritsData] = useState([]);
  const [page, setPage] = useState(0);
  const [merit, setMerit] = useState('');
  const [level, setMeritLevel] = useState('');
  const [direction, setDirection] = useState('asc');

  const {
    merits: { data },
  } = app;

  useEffect(() => {
    setMeritsData(data);
  }, [data]);

  function handleOnChange(e) {
    const {
      target: { value },
    } = e;

    setMerit(value);
  }

  function handleOnChangeLevel(e) {
    const {
      target: { value },
    } = e;
    setMeritLevel(value);
  }

  function handleFilter() {
    if (!isEmpty(level)) {
      const filterData = filter(
        data,
        o => toNumber(o.meritCost) === toNumber(level),
      );
      setMeritsData(filterData);
    } else {
      const meritFilterData = filter(data, o => {
        if (includes(toLower(o.merit), toLower(merit))) {
          return o;
        }
        return undefined;
      });
      setMeritsData(meritFilterData);
    }
  }

  function handleSortingByLevel(type) {
    const sortedByLevel = orderBy(meritsData, [type], [direction]);
    setMeritsData(sortedByLevel);
    if (direction === 'asc') {
      setDirection('desc');
    } else {
      setDirection('asc');
    }
  }

  function handleFilterType(type) {
    setMeritsData(data);
    if (
      includes(
        ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
        type,
      )
    ) {
      const filterClans = filter(data, o =>
        includes(get(o, 'meritType[0]'), type),
      );
      setMeritsData(filterClans);
    }
    if (
      !includes(
        ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
        type,
      )
    ) {
      const filterClans = filter(data, o =>
        includes(get(o, 'clanSpecific[0]'), type),
      );
      setMeritsData(filterClans);
    }

    window.scrollTo({ top: 8500, behavior: 'smooth' });
  }

  let clanNames = uniq(
    without(map(data, o => get(o, 'clanSpecific[0]')), undefined),
  );

  clanNames = concat(
    ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
    clanNames,
  ).sort();

  return (
    <div>
      <Helmet>
        <title>World of Darkness - MET - Vampire - Merits</title>
        <meta name="description" content="Description of Merits" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center" style={{ color: '#fff' }}>
              MERITS
            </h1>
            <hr />
          </div>
          <div className="list-icons justify-content-center w-100">
            <Select
              allowClear
              style={{ width: '70vw', paddingBottom: 20 }}
              showSearch
              placeholder="Search to Filter Merits"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onSelect={handleFilterType}
            >
              {map(uniq(clanNames), item => (
                <Select.Option value={item}>{item}</Select.Option>
              ))}
            </Select>
          </div>
          <form className="form-inline ">
            <div className="col-md-4">
              <label>MERITS NAME</label>
              <input
                type="text"
                className="form-control"
                onChange={handleOnChange}
              />
            </div>
            <div className="col-md-4">
              <label>MERIT COST</label>
              <input
                type="number"
                className="form-control"
                onChange={handleOnChangeLevel}
              />
            </div>
            <div className="col-md-2">
              <label />
              <span className="btn btn-primary" onClick={handleFilter}>
                filter
              </span>
            </div>
            <div className="col-md-2">
              <label />
              <button
                className="btn btn-primary"
                onClick={() => setMeritsData(data)}
              >
                Clear
              </button>
            </div>
          </form>
          <hr />

          <div className="page w-100">
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  className="page-link btn"
                  onClick={() => setPage(page - 10)}
                  style={{ marginLeft: 10 }}
                  disabled={page === 0}
                >
                  Previous
                </button>
              </li>
              <li className="page-item active">
                <span className="page-link" style={{ width: 100 }}>
                  {page / 10 + 1}
                </span>
              </li>

              <li className="page-item">
                <button
                  className="page-link btn"
                  onClick={() => setPage(page + 10)}
                  disabled={page > meritsData.length}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>

          <div className="col-md-12">
            <div className="header-disciplines">
              <div
                className="disc-cols3 "
                onClick={() => handleSortingByLevel('merit')}
              >
                <span>NAME</span>
              </div>
              <div
                className="disc-cols3 hideMobile"
                onClick={() => handleSortingByLevel('clanSpecific')}
              >
                <span>Type</span>
              </div>
              <div
                className="disc-cols3 hideMobile"
                onClick={() => handleSortingByLevel('meritCost')}
              >
                <span>Cost</span>
              </div>
              <div className="indicator" />
            </div>

            <div className="listing-body">
              <div className="listing">
                {map(
                  uniqBy(slice(meritsData, page, page + 10), 'merit'),
                  (item, index) => (
                    <>
                      <div className={`item discipline-${index}`}>
                        <div className="disc-cols3">
                          <span>{item.merit}</span>
                        </div>
                        <div className="disc-cols3 hideMobile">
                          <span>
                            {get(item, 'meritType[0]')}{' '}
                            {get(item, 'clanSpecific[0]')}
                          </span>
                        </div>
                        <div className="disc-cols3 hideMobile">
                          <span>{item.meritCost}</span>
                        </div>
                        <div className="disc-indicator">
                          <a
                            className="btn btn-primary collapsed"
                            data-toggle="collapse"
                            href={`#discipline-${index}`}
                            role="button"
                            aria-expanded="false"
                            aria-controls={`discipline-${index}`}
                          >
                            <i className="fa" />
                          </a>
                        </div>
                      </div>
                      <div className="collapse" id={`discipline-${index}`}>
                        <div className="box-summary">
                          <div className="details">
                            <ul>
                              <li>
                                <span>Name</span>
                                {item.merit}
                              </li>
                              <li>
                                <span>Category</span>
                                {item.meritType[0]}
                              </li>
                              <li>
                                <span>Cost</span>
                                {item.meritCost}
                              </li>
                            </ul>
                          </div>
                          <div
                            /* eslint-disable-next-line react/no-danger */
                            dangerouslySetInnerHTML={{
                              __html: documentToHtmlString(
                                item.meritDescription_html,
                              ),
                            }}
                          />
                          <p>
                            <h3>SOURCE BOOK</h3>
                            {!isEmpty(item.sourceBook) ? (
                              <p>
                                <p>
                                  <p>{item.sourceBook[0].fields.bookTitle}</p>
                                  <p>{item.sourceBook[0].fields.system[0]}</p>
                                </p>
                              </p>
                            ) : (
                              <p>MET - VTM - Main Source Book</p>
                            )}
                          </p>
                        </div>
                      </div>
                    </>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Merits.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  merits: makeSelectMerits(),
  app: makeSelectApp(),
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
)(Merits);
