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
import { map, slice, filter, orderBy, get } from 'lodash';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectApp } from 'containers/App/selectors';
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
    const meritFilterData = filter(meritsData, { merit });
    setMeritsData(meritFilterData);
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

  return (
    <div>
      <Helmet>
        <title>Merits</title>
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
            <a className="box-icon" href="#">
              <span className="list icon-skull">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
                <span className="path5" />
                <span className="path6" />
              </span>
              All Merits
            </a>
            <a className="box-icon" href="#">
            <span className="list icon-skull">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
                <span className="path5" />
                <span className="path6" />
              </span>
              Camarilla
            </a>
            <a className="box-icon" href="#">
            <span className="list icon-skull">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
                <span className="path5" />
                <span className="path6" />
              </span>
              Anarch
            </a>
            <a className="box-icon" href="#">
            <span className="list icon-skull">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
                <span className="path5" />
                <span className="path6" />
              </span>
              Sabbat
            </a>
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
              <input className="form-control" onChange={handleOnChangeLevel} />
            </div>
            <div className="col-md-2">
              <label />
              <button className="btn btn-primary" onClick={handleFilter}>
                filter
              </button>
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
                <span className="page-link">{2 + page}</span>
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
                {map(slice(meritsData, page, page + 10), (item, index) => (
                  <>
                    <div className={`item discipline-${index}`}>
                      {console.log(item)}
                      <div className="disc-cols3">
                        <span>{item.merit}</span>
                      </div>
                      <div className="disc-cols3 hideMobile">
                        <span>{get(item ,'meritType[0]')} - {get(item, 'clanSpecific[0]')}</span>
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
                        <h3>SUMMARY</h3>
                        <p>{item.meritDescription[0]}</p>
                        <a href={`/Merits/${item.merit}`} className="btn btn-primary">
                          Details
                        </a>
                      </div>
                    </div>
                  </>
                ))}
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
