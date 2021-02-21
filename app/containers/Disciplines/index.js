/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/**
 *
 * Disciplines
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get, map, orderBy } from 'lodash';

import Loader from 'components/Loader';
import { makeSelectApp } from 'containers/App/selectors';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectDisciplines from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getDisciplines } from './actions';

export function Disciplines({ app }) {
  useInjectReducer({ key: 'disciplines', reducer });
  useInjectSaga({ key: 'disciplines', saga });
  const [disciplineData, setDisciplineData] = useState([]);
  const [direction, setDirection] = useState('asc');
  const {
    disciplines: { data },
  } = app;

  useEffect(() => {
    setDisciplineData(data);
  }, [data]);

  // if (loading && hasMore) {
  //   return <Loader />;
  // }

  function handleSortingByLevel(type) {
    const sortedByLevel = orderBy(disciplineData, [type], [direction]);
    setDisciplineData(sortedByLevel);
    if (direction === 'asc') {
      setDirection('desc');
    } else {
      setDirection('asc');
    }
  }

  function handleSortingByDisc() {
    const sortedByLevel = orderBy(
      disciplineData,
      [user => user.power.toLowerCase(), 'level'],
      [direction, 'desc'],
    );
    setDisciplineData(sortedByLevel);
    if (direction === 'asc') {
      setDirection('desc');
    } else {
      setDirection('asc');
    }
  }

  return (
    <div>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center" style={{ color: '#ffffff' }}>
              DISCIPLINES
            </h1>
          </div>
          <div className="col-md-12">
            <div className="header-disciplines">
              <div className="discipline" onClick={() => handleSortingByDisc()}>
                <span style={{ color: '#ffffff' }}>Discipline</span>
              </div>
              <div
                className="power"
                onClick={() => handleSortingByLevel('title')}
              >
                <span style={{ color: '#ffffff' }}>POWER</span>
              </div>
              <div
                className="foci"
                onClick={() => handleSortingByLevel('foci')}
              >
                <span style={{ color: '#ffffff' }}>Foci</span>
              </div>
              <div
                className="level"
                onClick={() => handleSortingByLevel('level')}
              >
                <span style={{ color: '#ffffff' }}>Level</span>
              </div>
              <div
                className="cost"
                onClick={() => handleSortingByLevel('cost')}
              >
                <span style={{ color: '#ffffff' }}>Cost</span>
              </div>
              <div className="indicator" />
            </div>

            <div className="listing-body">
              <div className="listing">
                {map(disciplineData, (item, index) => (
                  <>
                    <div className={`item discipline-${index + 1}`}>
                      <div className="disc-power">
                        <span>{item.power}</span>
                      </div>
                      <div className="disc-name">
                        <span>{item.title}</span>
                      </div>
                      <div className="disc-foci">
                        <span>{get(item, 'foci', '-')}</span>
                      </div>
                      <div className="disc-level">
                        <span>{get(item, 'level', '-')}</span>
                      </div>
                      <div className="disc-cost">
                        <span>{get(item, 'cost', '-')}</span>
                      </div>
                      <div className="disc-indicator">
                        <a
                          className="btn btn-primary collapsed"
                          data-toggle="collapse"
                          href={`#discipline-${index + 1}`}
                          role="button"
                          aria-expanded="false"
                          aria-controls={`discipline-${index + 1}`}
                        >
                          <i className="fa" />
                        </a>
                      </div>
                    </div>
                    <div className="collapse" id={`discipline-${index + 1}`}>
                      <div className="box-summary">
                        <div className="details">
                          <ul>
                            <li>
                              <span>Power</span>
                              {item.power}
                            </li>
                            <li>
                              <span>Discipline</span>
                              {item.title}
                            </li>
                            <li>
                              <span>Foci</span>
                              {get(item, 'foci', '-')}
                            </li>
                            <li>
                              <span>Level</span>
                              {get(item, 'level', '-')}
                            </li>
                            <li>
                              <span>Cost</span>
                              {get(item, 'cost', '-')}
                            </li>
                          </ul>
                        </div>
                        <h3>SUMMARY</h3>
                        <p>{map(item.summary, dataItem => dataItem)}</p>
                        <Link to={`/Disciplines/${item.power}`}>
                          <a href="" className="btn btn-primary">
                            Details
                          </a>
                        </Link>
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

Disciplines.propTypes = {
  OnRequestDropDownItems: PropTypes.func,
  disciplines: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  disciplines: makeSelectDisciplines(),
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    OnRequestDropDownItems: params => dispatch(getDisciplines(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Disciplines);
