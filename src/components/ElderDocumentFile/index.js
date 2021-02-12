import React, { Component } from 'react';
import ElderDocumentFileDataManager from './dataManager';

const ElderDocumentsDataManager = new ElderDocumentFileDataManager();

export default class ElderDocumentFile extends Component {
  constructor(props) {
    super(props);
    this.state = { directoryFile: [] };
  }
  componentDidMount() {
    this.getDirectory();
  }
  getDirectory = () => {
    // GetDirectory method defined with datapayload and get hit
    const { directoryFile } = this.state;
    const dataPayload = {
      currentElderIdentifier: this.props.currentElderIdentifier,
    };
    ElderDocumentsDataManager.getDirectory(dataPayload).then((responseData) =>
      this.setState({ directoryFile: responseData.data })
    );
    //   .catch((errorData) => {
    //     // this.props.stopLoader();
    //     this.props.openNotification(
    //       'Error!',
    //       errorData.response.data.message,
    //       0
    //     );
    //   }
    // );
  };
  render() {
    return <div>Hello</div>;
  }
}
