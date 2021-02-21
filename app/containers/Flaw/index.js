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
import { map, slice, filter, orderBy, get } from 'lodash';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { makeSelectApp } from 'containers/App/selectors';

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
    const meritFilterData = filter(meritsData, { flaw: merit });
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
    <div className="page-white">
      <Helmet>
        <title>Flaw</title>
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
          <div className="list-icons justify-content-center">
            <a className="box-icon" href="#">
              <span className="list icon-skull">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
                <span className="path5" />
                <span className="path6" />
              </span>
              All Flaws
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Assamites" />
              Assamite
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Brujah" />
              Brujah
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Caitiff" />
              Caitiff
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Cappadocians" />
              Cappadocians
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-DaughtersofCacophony" />
              Daughters of Cacophony
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-FollowersofSet" />
              Followers of Set
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Gangrel" />
              Gangrel
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Gargoyle" />
              Gargoyle
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Giovanni" />
              Giovanni
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Lasombra" />
              Lasombra
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Malkavian" />
              Malkavian
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Nosferatu" />
              Nosferatu
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Ravnos" />
              Ravnos
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Salubri" />
              Salubri
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Toreador" />
              Toreador
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Tremere" />
              Tremere
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Tzimisce" />
              Tzimisce
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Ventrue" />
              Ventrue
            </a>
          </div>
          <form className="form-inline ">
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
              <li className="page-item">
                <a className="page-link" href="#">
                  {1 + page}
                </a>
              </li>
              <li className="page-item active">
                <span className="page-link">{2 + page}</span>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  {3 + page}
                </a>
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
                {map(slice(meritsData, page, page + 10), (item, index) => (
                  <>
                    <div className={`item discipline-${index}`}>
                      <div className="disc-cols3">
                        <span>{item.flaw}</span>
                      </div>
                      <div className="disc-cols3 hideMobile">
                        <span>{get(item,'flawType[0]','-')}</span>
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
                        <h3>SUMMARY</h3>
                        <p>{item.flawDescription[0]}</p>
                        <a href="" className="btn btn-primary">
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
