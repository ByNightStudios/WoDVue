/**
 *
 * ClanPage
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
import Header from 'components/Header_1';
import Footer from 'components/Footer_1';

import ToDoReader from 'images/toreador.png';

import makeSelectClanPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import './style.css';

export function ClanPage() {
  useInjectReducer({ key: 'clanPage', reducer });
  useInjectSaga({ key: 'clanPage', saga });

  return (
    <div className="clan-page">
      <Helmet>
        <title>ClanPage</title>
        <meta name="description" content="Description of ClanPage" />
      </Helmet>
      <Header />
      <FormattedMessage {...messages.header} />
      <div className="container main-content">
        <div className="row">
          <div className="col-md-8 order-md-12">
            <div className="header-single icon-Toreador">
              <h1>TOREADOR</h1>
              <h4>Degenerates</h4>
            </div>
            <div className="boxWhite">
              <div className="row">
                <div className="col-lg-6 col-md-12 order-lg-12 boxThumb">
                  <img className="thumbClan" src={ToDoReader} />
                </div>
                <div className="col-lg-6 col-md-12 order-lg-1">
                  <p>
                    Magniﬁcent roses in a garden of evening stars. A lilting
                    aria in a drowsy twilight. The sweet brush of a lover’s
                    kiss. These images evoke the Toreador, as these vampires are
                    the most beautiful of all. <br />
                    Toreador are artists, writers, and creators: artisans
                    enjoying an immortal life of pageantry and sensuality.
                    Unlike other clans, Toreador plunge themselves into the
                    mortal world. Often, they will pretend to be mortal, living
                    as glitterati and giving patronage to inﬂuential mortal
                    artists. From city to city, passion to passion, the Toreador
                    ﬂ it about, inspiring the ﬁnest art and leaving a trail of
                    broken hearts.
                  </p>
                </div>
              </div>
              <blockquote className="blockquote">
                <p className="mb-0">
                  “Le spine della rosa sono nacoste dal ﬁore: the thorns of the
                  rose are hidden by the bloom.”
                </p>
                <footer className="blockquote-footer text-right">
                  Lynda La Plante, Bella Maﬁa{' '}
                </footer>
              </blockquote>
              <p>
                With such reﬁned tastes, it is easy for a member of the Toreador
                clan to become jaded and bitter, ﬁlled with ennui. Surrounded by
                excess, they quickly lose interest, seizing prize after prize —
                the sweetest of which are those stolen from another. The oldest
                Toreador often become depraved, sinking into debauchery simply
                so they can feel anything at all. Toreador love politics and
                live for hierarchy, so long as they can remain at the top. They
                develop cults of personality, gathering followers captivated by
                their beauty or begging for their patronage. They are always at
                the cutting edge of arts, culture, and society. They pride
                themselves on their beauty and poise, hosting salons and
                gatherings to show off their wealth and style. Those who cannot
                keep up are mocked and ridiculed. Vampires who are ugly,
                uncivilized, or show no respect for the arts are torn apart by a
                Toreador’s metaphorical claws. For this reason, there is an
                eternal enmity between the Nosferatu and Toreador clans, a
                hatred that will never be reconciled.
              </p>
              <h2>ORGANIZATION</h2>
              <p>
                The Toreador hierarchy is based around an elaborate system of
                guilds and patrons, with rising stars shooting to the fore — and
                discarded just as quickly when their moment of glory has faded.
                Cliques of powerful elders snipe one another, engaging in subtle
                politics as they shred reputations and destroy lives. Young
                Toreador thrown into this pool of sharks must quickly learn to
                sink or swim.
              </p>

              <h2>Disciplines</h2>
              <p>
                Disciplines1, Disciplines2, Disciplines3, Disciplines4,
                Disciplines5
              </p>

              <h2>WEAKNESS</h2>
              <p>
                {' '}
                Toreador are often entranced by beauty and art. When you
                encounter a piece of art, a performance, or something beautiful
                that you are particularly interested in or that you have never
                seen before, you must give it your undivided attention for a
                scene. Toreador can resist this urge by expending a point of
                Willpower. Although distractions like loud voices or a nearby
                scufﬂe can divert your attentions, Toreador dislike being
                interrupted while experiencing art and beauty, and will respond
                with anger — even violence or frenzy.
              </p>

              <h2>FLAWS</h2>
              <p>
                Addiction, <a href="">Childlike</a>, Careless, Curiosity,
                Intolerance
              </p>

              <h2>MERITS</h2>
              <p>
                <a href="">Artist’s Blessing</a>, Ishtarri, Volgirre, Absent
                Sway, Dancer’s Grace
              </p>
            </div>
          </div>
          <div className="col-md-4 order-md-1">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">
                    <span className="icon-skull">
                      <span className="path1" />
                      <span className="path2" />
                      <span className="path3" />
                      <span className="path4" />
                      <span className="path5" />
                      <span className="path6" />
                    </span>
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#">Clans & Bloodlines</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Toreador
                </li>
              </ol>
            </nav>

            <div className="boxWhite">
              <h3>CLANS & BLOODLINES</h3>
              <ul className="nav flex-column nav-clans">
                <li className="nav-item">
                  <a className="nav-link icon-BanuqHaqim" href="#">
                    Banu Haqim
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Baali" href="#">
                    Baali
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Brujah" href="#">
                    Brujah
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Caitiff" href="#">
                    Caitiff
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Cappadocians" href="#">
                    Cappadocians
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-DaughtersofCacophony" href="#">
                    Daughters of Cacophony
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-FollowersofSet" href="#">
                    Followers of Set
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Gangrel" href="#">
                    Gangrel
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Gargoyle" href="#">
                    Gargoyle
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Giovanni" href="#">
                    Giovanni
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Lasombra" href="#">
                    Lasombra
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Malkavian" href="#">
                    Malkavian
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Nosferatu" href="#">
                    Nosferatu
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Ravnos" href="#">
                    Ravnos
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Salubri" href="#">
                    Salubri
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Toreador active" href="#">
                    Toreador
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Tremere" href="#">
                    Tremere
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Tzimisce" href="#">
                    Tzimisce
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link icon-Ventrue" href="#">
                    Ventrue
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

ClanPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  clanPage: makeSelectClanPage(),
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
)(ClanPage);
