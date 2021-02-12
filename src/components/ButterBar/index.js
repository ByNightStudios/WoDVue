import React from 'react';
import propTypes from 'prop-types';

import styles from './ButterBar.scss';

const ButterBar = (props) => {
  return (
    <div
      className={
        props.highPriority
          ? 'butter-bar butter-bar-red d-flex align-items-center justify-content-center animated slideInDown'
          : 'butter-bar d-flex align-items-center justify-content-center animated slideInDown'
      }
      style={styles}
    >
      <div className='flex-wrapper d-flex align-items-center justify-content-center'>
        <p className='butter-bar-text text-margined'>{props.contentText}</p>
        <button
          type='button'
          className='butter-bar-action'
          onClick={() => props.actionDestination(props.notificationType)}
        >
          View
        </button>
      </div>
    </div>
  );
};

ButterBar.defaultProps = {
  highPriority: false,
  actionDestination: () => {},
};

ButterBar.propTypes = {
  highPriority: propTypes.bool,
  contentText: propTypes.string.isRequired,
  actionDestination: propTypes.func.isRequired,
  notificationType: propTypes.string.isRequired,
};

export default ButterBar;
