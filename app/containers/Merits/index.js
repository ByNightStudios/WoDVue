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
import { map, slice, filter } from 'lodash';
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
              All Merits
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-BanuqHaqim" />
              Banu Haqim
            </a>
            <a className="box-icon" href="#">
              <span className=" list icon-Baali" />
              Baali
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
            <a className="box-icon" href="#">
              <span className="list icon-skull">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
                <span className="path5" />
                <span className="path6" />
              </span>
              Common Merits
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

          <div className="col-md-12">
            <div className="header-disciplines">
              <div className="disc-cols3 sort-down">
                <span>NAME</span>
              </div>
              <div className="disc-cols3 hideMobile">
                <span>Cost</span>
              </div>
              <div className="indicator" />
            </div>

            <div className="listing-body">
              <div className="listing">
                {map(slice(meritsData, page, page + 3), (item, index) => (
                  <>
                    <div className={`item discipline-${index}`}>
                      <div className="disc-cols3">
                        <span>{item.merit}</span>
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
        <div className="page">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <button
                className="page-link btn"
                onClick={() => setPage(page - 1)}
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
                onClick={() => setPage(page + 1)}
                disabled={page === meritsData.length - 1}
              >
                Next
              </button>
            </li>
          </ul>
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
