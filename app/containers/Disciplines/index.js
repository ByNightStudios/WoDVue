/**
 *
 * Disciplines
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectDisciplines from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function Disciplines() {
  useInjectReducer({ key: 'disciplines', reducer });
  useInjectSaga({ key: 'disciplines', saga });

  return (
    <div>
      <Helmet>
        <title>Disciplines</title>
        <meta name="description" content="Description of Disciplines" />
      </Helmet>
      <FormattedMessage {...messages.header} />
      <div className="container main-content">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center">DISCIPLINES</h1>
          </div>
          <div className="col-md-12">
            <div className="header-disciplines">
              <div className="power sort-up">
                <span>POWER</span>
              </div>
              <div className="discipline sort-down">
                <span>Discipline</span>
              </div>
              <div className="foci">
                <span>Foci</span>
              </div>
              <div className="level">
                <span>Level</span>
              </div>
              <div className="cost">
                <span>Cost</span>
              </div>
              <div className="indicator" />
            </div>

            <div className="listing-body">
              <div className="listing">
                <div className="item discipline-1">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>Auspex</span>
                  </div>
                  <div className="disc-foci">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
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
                          <span>Power</span>Hightened Senses
                        </li>
                        <li>
                          <span>Discipline</span>Auspex
                        </li>
                        <li>
                          <span>Foci</span>Perception & Wits
                        </li>
                        <li>
                          <span>Level</span>0
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
                <div className="item">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>Celerity</span>
                  </div>
                  <div className="disc-foci">
                    <span>Dexterity</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
                    <span>1 Blood</span>
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
                <div className="item">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>Thaumaturgy</span>
                  </div>
                  <div className="disc-foci">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
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
                <div className="item">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>The Bone Path</span>
                  </div>
                  <div className="disc-foci">
                    <span>Dexterity</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
                    <span>1 Blood</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-4"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-4"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-4">
                  <div className="box-summary">
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
                <div className="item discipline-5">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>The Movement of the Mind</span>
                  </div>
                  <div className="disc-foci">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-5"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-5"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-5">
                  <div className="box-summary">
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
                <div className="item">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>The Path of Corruption</span>
                  </div>
                  <div className="disc-foci">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-6"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-6"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-6">
                  <div className="box-summary">
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
                <div className="item">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>The Path of Elemental Mastery</span>
                  </div>
                  <div className="disc-foci">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-7"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-7"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-7">
                  <div className="box-summary">
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
                <div className="item">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>The Path of Weather Mastery</span>
                  </div>
                  <div className="disc-foci">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-8"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-8"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-8">
                  <div className="box-summary">
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
                <div className="item">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>The Sepulchre Path</span>
                  </div>
                  <div className="disc-foci">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-9"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-9"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-9">
                  <div className="box-summary">
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
                <div className="item">
                  <div className="disc-power">
                    <span>Hightened Senses</span>
                  </div>
                  <div className="disc-name">
                    <span>Visceratika</span>
                  </div>
                  <div className="disc-foci">
                    <span>Perception & Wits</span>
                  </div>
                  <div className="disc-level">
                    <span>0</span>
                  </div>
                  <div className="disc-cost">
                    <span>Varies</span>
                  </div>
                  <div className="disc-indicator">
                    <a
                      className="btn btn-primary collapsed"
                      data-toggle="collapse"
                      href="#discipline-10"
                      role="button"
                      aria-expanded="false"
                      aria-controls="discipline-10"
                    >
                      <i className="fa" />
                    </a>
                  </div>
                </div>
                <div className="collapse" id="discipline-10">
                  <div className="box-summary">
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
      </div>
    </div>
  );
}

Disciplines.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  disciplines: makeSelectDisciplines(),
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
)(Disciplines);
