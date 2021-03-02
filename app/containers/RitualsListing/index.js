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
import { get, map, orderBy, toLower, filter } from 'lodash';
import { Select } from 'antd';
import Loader from 'components/Loader';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
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
    rituals: { data },
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
      [user => user.title.toLowerCase()],
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
      [user => getBooleanValue(user)],
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
      [user => user.level],
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

  function getArray(array) {
    return array;
  }

  function getBooleanValue(item) {
    const { thaumaturgy, abyssal, necromancy } = item;
    if (thaumaturgy) {
      return 'Thaumaturgy';
    }
    if (abyssal) {
      return 'Abyssal';
    }
    if (necromancy) {
      return 'Necromancy';
    }
    return false;
  }

  function handleFilterType(type) {
    const filterClans = filter(
      disciplineData,
      o => getBooleanValue(o) === type,
    );
    setDisciplineData(filterClans);
  }

  const clanNames = ['Thaumaturgy', 'Necromancy', 'Abyssal'];
  return (
    <div>
      <div className="container main-content">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center" style={{ color: '#ffffff' }}>
              RITUALS
            </h1>
          </div>
          <Select
            allowClear
            style={{ width: '100vw', paddingBottom: 20 }}
            showSearch
            placeholder="Search to Filter Rituals"
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
            {map(clanNames, item => (
              <Select.Option value={item}>{item}</Select.Option>
            ))}
          </Select>
          <div className="col-md-12">
            <div className="header-disciplines">
              <div className="discipline" onClick={() => handleSortingByDisc()}>
                <span style={{ color: '#ffffff' }}>Rituals</span>
              </div>
              <div className="discipline" onClick={() => handleSortingBy1()}>
                <span style={{ color: '#ffffff' }}>Ritual Type</span>
              </div>
              <div className="discipline" onClick={() => handleSortingBy2()}>
                <span style={{ color: '#ffffff' }}>Level</span>
              </div>
              <div className="indicator" />
            </div>

            <div className="listing-body">
              <div className="listing">
                {map(getArray(disciplineData), (item, index) => (
                  <>
                    <div className={`item discipline-${index + 1}`}>
                      <div className="disc-power">
                        <span>{item.title}</span>
                      </div>
                      <div
                        className="disc-name"
                        style={{
                          marginLeft: '71px',
                          marginRight: '118px',
                        }}
                      >
                        <span>{getBooleanValue(item)}</span>
                      </div>
                      <div className="disc-foci">
                        <span>{get(item, 'level', '-')}</span>
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
                              {item.title}
                            </li>
                            <li>
                              <span>disciplines</span>
                              {/* {toString(get(item, 'disciplines', '-'))} */}
                            </li>
                            <li>
                              <span>prerequisites</span>
                              {get(item, 'prerequisites', '-')}
                            </li>
                            <li>
                              <span>SYSTEM</span>
                              {get(item, 'system', '-')}
                            </li>
                          </ul>
                        </div>
                        <h3>SUMMARY</h3>
                        <div
                          /* eslint-disable-next-line react/no-danger */
                          dangerouslySetInnerHTML={{
                            __html: documentToHtmlString(item.summary_html),
                          }}
                        />
                        <p>
                          <h3>SYSTEM</h3>
                          <div
                            /* eslint-disable-next-line react/no-danger */
                            dangerouslySetInnerHTML={{
                              __html: documentToHtmlString(item.system_html),
                            }}
                          />
                        </p>
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
