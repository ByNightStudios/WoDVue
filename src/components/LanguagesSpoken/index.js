import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Checkbox } from 'antd';
import { getResponderConfig } from '../../actions/ConfigActions';
import { connect } from 'react-redux';
import './languages-spoken.scss';

class LanguagesSpoken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languagesTypes: [],
    };
  }
  componentDidMount() {
    this.getResponderConfig();
  }
  getResponderConfig() {
    this.props
      .getResponderConfig('languages')
      .then((result) => {
        console.log(result, 'Result');
        this.setState({
          languagesTypes: result.languages,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { label } = this.props;
    return (
      <div className='row languages-spoken'>
        <div className='col-12 col-sm-12'>
          <Form.Group controlId='languagesSpoken'>
            <Form.Label>{label ? label : 'Languages Spoken'}</Form.Label>
            <div className='form-multicheck'>
              <Checkbox.Group
                options={this.state.languagesTypes}
                value={this.props.option}
                onChange={this.props.onChange}
              />
            </div>
          </Form.Group>
        </div>
      </div>
    );
  }
}
const mapsStateToProps = (state) => ({
  user: state.user.user,
});
const mapDispatchToProps = {
  getResponderConfig,
};
export default connect(mapsStateToProps, mapDispatchToProps)(LanguagesSpoken);
