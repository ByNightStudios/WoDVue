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
import { get, map, orderBy, toLower } from 'lodash';

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
    techniques: { data },
  } = app;

  useEffect(() => {
    setDisciplineData(data);
  }, [data]);

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
      [user => user.technique.toLowerCase()],
      [direction, 'desc'],
    );
    setDisciplineData(sortedByLevel);
    if (direction === 'asc') {
      setDirection('desc');
    } else {
      setDirection('asc');
    }
  }

  function handleSortingBy1() {
    const sortedByLevel = orderBy(
      disciplineData,
      [user => user.prerequisites[0].toLowerCase()],
      [direction, 'desc'],
    );
    setDisciplineData(sortedByLevel);
    if (direction === 'asc') {
      setDirection('desc');
    } else {
      setDirection('asc');
    }
  }

  function handleSortingBy2() {
    const sortedByLevel = orderBy(
      disciplineData,
      [user => user.prerequisites[1].toLowerCase()],
      [direction, 'desc'],
    );
    setDisciplineData(sortedByLevel);
    if (direction === 'asc') {
      setDirection('desc');
    } else {
      setDirection('asc');
    }
  }

  function handleSortingBy3() {
    const sortedByLevel = orderBy(
      disciplineData,
      [user => toLower(get(user, 'prerequisites[2]', '-'))],
      [direction, 'desc'],
    );
    setDisciplineData(sortedByLevel);
    if (direction === 'asc') {
      setDirection('desc');
    } else {
      setDirection('asc');
    }
  }

  function getArray(array){
    return array;
  }

  return (
    <div>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center" style={{ color: '#ffffff' }}>
              TECHNIQUES
            </h1>
          </div>
          <div className="col-md-12">
            <div className="header-disciplines">
              <div className="discipline" onClick={() => handleSortingByDisc()}>
                <span style={{ color: '#ffffff' }}>Techniques</span>
              </div>
              <div className="discipline" onClick={() => handleSortingBy1()}>
                <span style={{ color: '#ffffff' }}>Discipline 1</span>
              </div>
              <div className="discipline" onClick={() => handleSortingBy2()}>
                <span style={{ color: '#ffffff' }}>Discipline 2</span>
              </div>
              <div className="discipline" onClick={() => handleSortingBy3()}>
                <span style={{ color: '#ffffff' }}>Discipline 3</span>
              </div>
              <div className="indicator" />
            </div>

            <div className="listing-body">
              <div className="listing">
                {map(getArray(disciplineData), (item, index) => (
                  <>
                    <div className={`item discipline-${index + 1}`}>
                      <div className="disc-power">
                        <span>{item.technique}</span>
                      </div>
                      <div className="disc-name">
                        <span>{get(item, 'prerequisites[0]', '-')}</span>
                      </div>
                      <div className="disc-foci">
                        <span>{get(item, 'prerequisites[1]', '-')}</span>
                      </div>

                      <div className="disc-foci">
                        <span>{get(item, 'prerequisites[2]', '-')}</span>
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
                              <span>Techniques</span>
                              {item.technique}
                            </li>
                            <li>
                              <span>disciplines</span>
                              {/* {toString(get(item, 'disciplines', '-'))} */}
                            </li>
                            <li>
                              <span>prerequisites</span>
                              {map(get(item, 'prerequisites', '-'), item => (
                                <div style={{ marginRight: 10 }}>{item}</div>
                              ))}
                            </li>
                            <li>
                              <span>SYSTEM</span>
                              {get(item, 'system', '-')}
                            </li>
                          </ul>
                        </div>
                        <h3>SUMMARY</h3>
                        <p>{map(item.description, dataItem => dataItem)}</p>
                        <Link to={`/vampire/Techniques/${item.technique}`}>
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
