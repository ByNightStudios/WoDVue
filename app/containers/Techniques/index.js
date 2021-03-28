/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-shadow */
/**
 *
 * Disciplines
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  get,
  isEmpty,
  map,
  orderBy,
  toLower,
  uniq,
  filter,
  includes,
} from 'lodash';
import { Helmet } from 'react-helmet';
import { Row, Select, Button } from 'antd';
import { makeSelectApp } from 'containers/App/selectors';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import makeSelectDisciplines from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getDisciplines } from './actions';

const { Option } = Select;
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

  const rotate = (arr, count = 1) => [
    ...arr.slice(count, arr.length),
    ...arr.slice(0, count),
  ];

  function handleSortingBy2() {
    const sortedByLevel = orderBy(
      disciplineData,
      [user => toLower(user.prerequisites[1], ' ')],
      [direction, 'desc'],
    );
    setDisciplineData(rotate(sortedByLevel));
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

  function getArray(array) {
    return array;
  }

  const prerequisites1 = uniq(
    map(disciplineData, item => item.disciplines[0].fields.power),
  );
  const prerequisites2 = uniq(
    map(disciplineData, item => item.disciplines[1].fields.power),
  );

  const handleChangeFilter = value => {
    const sortedByLevel = filter(disciplineData, o =>
      includes(get(o, 'prerequisites[0]'), value),
    );
    setDisciplineData(sortedByLevel);
  };

  const handleChangeFilter2 = value => {
    const sortedByLevel = filter(disciplineData, o =>
      includes(get(o, 'prerequisites[1]'), value),
    );
    setDisciplineData(sortedByLevel);
  };

  return (
    <div>
      <Helmet>
        <title>World of Darkness - MET - Techniques</title>
        <meta name="description" content="Description of Merits" />
      </Helmet>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center" style={{ color: '#ffffff' }}>
              TECHNIQUES
            </h1>
          </div>
          <Row type="flex" justify="space-between" className="w-100">
            <Select
              placeholder="Filter for Discipline 1"
              style={{ width: '40%' }}
              onChange={handleChangeFilter}
            >
              {map(prerequisites1, item => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>
            <Select
              placeholder="Filter for Discipline 2"
              style={{ width: '40%' }}
              disabled={isEmpty(prerequisites2)}
              onChange={handleChangeFilter2}
            >
              {map(prerequisites2, item => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>

            <Button onClick={() => setDisciplineData(data)}>Reset</Button>
          </Row>
          <div className="col-md-12">
            <div className="header-disciplines">
              <div className="discipline" onClick={() => handleSortingBy2()}>
                <span style={{ color: '#ffffff' }}>Techniques</span>
              </div>
              <div
                className="discipline hideTablet"
                onClick={() => handleSortingBy1()}
              >
                <span style={{ color: '#ffffff' }}>Discipline 1</span>
              </div>
              <div
                className="discipline hideTablet"
                onClick={() => handleSortingByDisc()}
              >
                <span style={{ color: '#ffffff' }}>Discipline 2</span>
              </div>
              <div
                className="discipline hideTablet"
                onClick={() => handleSortingBy3()}
              >
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
                      <div className="disc-name ">
                        <span>{get(item, 'prerequisites[0]', '-')}</span>
                      </div>
                      <div className="disc-foci hideTablet">
                        <span>{get(item, 'prerequisites[1]', '-')}</span>
                      </div>

                      <div className="disc-foci hideTablet">
                        <span>{get(item, 'prerequisites[2]', '-')}</span>
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
  ...Disciplines,
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
