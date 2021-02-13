/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * Flaw
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectFlaw from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.css';

export function Flaw() {
  useInjectReducer({ key: 'flaw', reducer });
  useInjectSaga({ key: 'flaw', saga });

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
              <span className=" list icon-Assamite" />
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
              <input type="text" className="form-control" />
            </div>
            <div className="col-md-4">
              <label>FLAWS LEVEL</label>
              <input type="password" className="form-control" />
            </div>
            <div className="col-md-4">
              <label />
              <button type="submit" className="btn btn-primary">
                filter
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
                <span>Category</span>
              </div>
              <div className="disc-cols3 hideMobile">
                <span>Cost</span>
              </div>
              <div className="indicator" />
            </div>

            <div className="listing-body">
              <div className="listing">
                <div className="item discipline-1">
                  <div className="disc-cols3">
                    <span>Auspex</span>
                  </div>
                  <div className="disc-cols3 hideMobile">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-cols3 hideMobile">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-1"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-1"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-1">
                  <div className="box-summary">
                    <div className="details">
                      <ul>
                        <li>
                          <span>Name</span>Auspex
                        </li>
                        <li>
                          <span>Category</span>Perception & Wits
                        </li>
                        <li>
                          <span>Cost</span>Varies
                        </li>
                      </ul>
                    </div>
                    <h3>SUMMARY</h3>
                    <p>
                      A predator’s senses must be tremendously acute to track
                      prey in the night. The five senses of smell, touch, taste,
                      sight, and hearing can all be sharpened with the use of
                      Auspex. This improved awareness can even go beyond the
                      physical senses, expanding a vampire’s powers of
                      concentration, perception, and consciousness itself beyond
                      the ability of mortals. Such heightened awareness can
                      grasp subtle textures of movement as well as emotional
                      states, transcending ordinary mental acuity. Auspex can
                      also pierce mental distractions and illusions, such as
                      those created by the disciplines of Obfuscate or
                      Chimeristry.
                    </p>
                    <a href="" className="btn btn-primary">
                      Details
                    </a>
                  </div>
                </div>
                <div className="item discipline-2">
                  <div className="disc-cols3">
                    <span>Celerity</span>
                  </div>
                  <div className="disc-cols3 hideMobile">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-cols3 hideMobile">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-2"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-2"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-2">
                  <div className="box-summary">
                    <div className="details">
                      <ul>
                        <li>
                          <span>Name</span>Auspex
                        </li>
                        <li>
                          <span>Category</span>Perception & Wits
                        </li>
                        <li>
                          <span>Cost</span>Varies
                        </li>
                      </ul>
                    </div>
                    <h3>SUMMARY</h3>
                    <p>
                      A predator’s senses must be tremendously acute to track
                      prey in the night. The five senses of smell, touch, taste,
                      sight, and hearing can all be sharpened with the use of
                      Auspex. This improved awareness can even go beyond the
                      physical senses, expanding a vampire’s powers of
                      concentration, perception, and consciousness itself beyond
                      the ability of mortals. Such heightened awareness can
                      grasp subtle textures of movement as well as emotional
                      states, transcending ordinary mental acuity. Auspex can
                      also pierce mental distractions and illusions, such as
                      those created by the disciplines of Obfuscate or
                      Chimeristry.
                    </p>
                    <a href="" className="btn btn-primary">
                      Details
                    </a>
                  </div>
                </div>
                <div className="item discipline-3">
                  <div className="disc-cols3">
                    <span>Presence</span>
                  </div>
                  <div className="disc-cols3 hideMobile">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-cols3 hideMobile">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-3"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-3"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-3">
                  <div className="box-summary">
                    <div className="details">
                      <ul>
                        <li>
                          <span>Name</span>Auspex
                        </li>
                        <li>
                          <span>Category</span>Perception & Wits
                        </li>
                        <li>
                          <span>Cost</span>Varies
                        </li>
                      </ul>
                    </div>
                    <h3>SUMMARY</h3>
                    <p>
                      A predator’s senses must be tremendously acute to track
                      prey in the night. The five senses of smell, touch, taste,
                      sight, and hearing can all be sharpened with the use of
                      Auspex. This improved awareness can even go beyond the
                      physical senses, expanding a vampire’s powers of
                      concentration, perception, and consciousness itself beyond
                      the ability of mortals. Such heightened awareness can
                      grasp subtle textures of movement as well as emotional
                      states, transcending ordinary mental acuity. Auspex can
                      also pierce mental distractions and illusions, such as
                      those created by the disciplines of Obfuscate or
                      Chimeristry.
                    </p>
                    <a href="" className="btn btn-primary">
                      Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item active">
              <span className="page-link">
                2<span className="sr-only">(current)</span>
              </span>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link btn" href="#">
                Next
              </a>
            </li>
          </ul>
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
