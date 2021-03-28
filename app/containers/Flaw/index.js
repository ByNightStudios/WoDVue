/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * Flaw
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
  uniq,
  without,
  isEmpty,
  includes,
  toLower,
  concat,
  remove,
  toNumber,
} from 'lodash';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { message, Select } from 'antd';
import { makeSelectApp } from 'containers/App/selectors';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectFlaw from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.css';

export function Flaw({ app }) {
  useInjectReducer({ key: 'flaw', reducer });
  useInjectSaga({ key: 'flaw', saga });

  const [meritsData, setMeritsData] = useState([]);
  const [page, setPage] = useState(0);
  const [merit, setMerit] = useState('');
  const [level, setMeritLevel] = useState('');
  const [direction, setDirection] = useState('asc');

  const {
    flaws: { data },
    clans: { data: meritData },
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

  function handleFilter(type) {
    if (!isEmpty(merit)) {
      const meritFilterData = filter(data, o => {
        if (includes(toLower(o.flaw), toLower(merit))) {
          return o;
        }
        return undefined;
      });
      setMeritsData(meritFilterData);
    }

    if (!isEmpty(level)) {
      const meritFilterData = filter(data, o => o.flawCost === toNumber(level));
      setMeritsData(meritFilterData);
    }

    if (isEmpty(merit) && isEmpty(level)) {
      setMeritsData(data);
      if (
        includes(['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat'], type)
      ) {
        const filterClans = filter(data, o =>
          includes(get(o, 'flawType[0]'), type),
        );
        setMeritsData(filterClans);
        window.scrollTo({ top: 8500, behavior: 'smooth' });
      }
      if (
        !includes(['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat'], type)
      ) {
        const filterClans = filter(data, o =>
          includes(get(o, 'clanFlaw'), type),
        );
        if (!isEmpty(filterClans)) {
          setMeritsData(filterClans);
          window.scrollTo({ top: 8500, behavior: 'smooth' });
        } else {
          setMeritsData(data);
        }
      }
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

  const clanNames = uniq(
    without(map(data, o => get(o, 'flawType[0]')), undefined),
  );

  const meritClanNames = uniq(
    without(
      map(meritData, o => {
        if (!o.parentClan) {
          return o.title;
        }
        return undefined;
      }),
      undefined,
    ),
  );

  const clanItemsDataOfFlaws = [];

  const filterList = concat(clanNames, meritClanNames);
  filterList.sort();

  function aclean(arr) {
    const unique = new Map();

    arr.forEach(word => {
      const sorted = word
        .toLowerCase()
        .split('')
        .sort()
        .join('');
      if (!unique.has(sorted)) {
        unique.set(sorted, word);
      }
    });

    return [...unique.values()];
  }

  return (
    <div className="page-white">
      <Helmet>
        <title>World of Darkness - MET - Vampire - Flaw</title>
        <meta name="description" content="Description of Flaw" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center" style={{ color: '#fff' }}>
              FLAWS
            </h1>
            <hr />
          </div>
          <div className="list-icons justify-content-center w-100">
            <Select
              allowClear
              style={{
                width: '70vw',
                paddingBottom: 20,
              }}
              showSearch
              placeholder="Search to Filter Flaws"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onSelect={handleFilter}
            >
              {map(filterList, item => (
                <Select.Option value={item}>{item}</Select.Option>
              ))}
              {/* {map(uniq(meritClanNames), item => (
                <Select.Option value={item}>{item}</Select.Option>
              ))} */}
            </Select>
          </div>
          <form className="form-inline">
            <div className="col-md-4">
              <label>FLAWS NAME</label>
              <input
                type="text"
                className="form-control"
                onChange={handleOnChange}
              />
            </div>
            <div className="col-md-4">
              <label>FLAWS LEVEL</label>
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
                  disabled={page === meritsData.length - 10}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>

          <div className="col-md-12">
            <div className="header-disciplines">
              <div
                className="disc-cols3 sort-down"
                onClick={() => handleSortingByLevel('flaw')}
              >
                <span>NAME</span>
              </div>
              <div
                className="disc-cols3 hideMobile"
                onClick={() => handleSortingByLevel('flawType')}
              >
                <span>Type</span>
              </div>
              <div
                className="disc-cols3 hideMobile"
                onClick={() => handleSortingByLevel('flawCost')}
              >
                <span>Cost</span>
              </div>
              <div className="indicator" />
            </div>

            <div className="listing-body">
              <div className="listing">
                {map(
                  slice(
                    concat(meritsData, clanItemsDataOfFlaws),
                    page,
                    page + 10,
                  ),
                  (item, index) => (
                    <>
                      <div className={`item discipline-${index}`}>
                        <div className="disc-cols3">
                          <span>{get(item, 'flaw', '-')}</span>
                        </div>
                        <div className="disc-cols3 hideMobile">
                          <span>
                            {get(item, 'clanFlaw') ? (
                              <>
                                {' '}
                                {get(item, 'flawType[0]')} -{' '}
                                {get(item, 'clanFlaw')}
                              </>
                            ) : (
                              get(item, 'flawType[0]', '-')
                            )}
                          </span>
                        </div>
                        <div className="disc-cols3 hideMobile">
                          <span>{item.flawCost}</span>
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
                                {item.flaw}
                              </li>
                              <li>
                                <span>Cost</span>
                                {item.flawCost}
                              </li>
                            </ul>
                          </div>
                          <div
                            /* eslint-disable-next-line react/no-danger */
                            dangerouslySetInnerHTML={{
                              __html: documentToHtmlString(
                                item.flawDescription_html,
                              ),
                            }}
                          />
                          {!isEmpty(item.sourceBook) ? (
                            <p>
                              <h3>SOURCE BOOK</h3>
                              <p>
                                <p>{item.sourceBook[0].fields.bookTitle}</p>
                                <p>{item.sourceBook[0].fields.system[0]}</p>
                              </p>
                            </p>
                          ) : null}
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

Flaw.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  flaw: makeSelectFlaw(),
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
)(Flaw);
