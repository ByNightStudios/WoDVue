import React from 'react';

import ElderNotes from '../ElderNotes';

import styles from './notes-tab.scss';

class NotesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className='notes-tab' style={styles}>
        <ElderNotes {...this.props} />
      </div>
    );
  }

  componentWillUnmount() {}
}

export default NotesTab;
