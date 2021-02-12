import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import PageLoader from '../../components/PageLoader';


class ExpandedRowRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        this.props.record && this.props.record.content && (
            document.getElementById('contentDiv').innerHTML = (this.props.record.content.replace(/&gt;/g, ">")).replace(/&lt;/g, "<")
        )
    }
    setStateValues = (e, field) => {
        let value = e.currentTarget.value;
        let state = this.state;
        state[`${field}`] = value;
        this.setState(state);
    };
    uploadedImageData = image_uuid => {
        this.setState({ image_uuid });
    };

    openNotification = (message, description, status) => {
        this.props.onClick(message, description, status);
    };

    render() {
        const data = this.props.record;
        return (
            <div className='provider-information'>
                <div className='row'>
                    <div className='provider-information-column col-12'>
                        <div className='provider-information-wrapper'>
                            <Form className='map-provider-form'>

                                <div className='row'>
                                    <div className='col-12'>
                                        <div className='row'>
                                            <div className="col-sm-6"><Button
                                                className='btn btn-primary'
                                                onClick={() => this.props.onEdit(data)}
                                            >
                                                Edit Post
                                            </Button>
                                            </div>
                                            <div className="col-sm-6"><Button
                                                className='btn btn-primary'
                                                onClick={() => this.props.onDelete(data)}
                                            >
                                                Delete Post
                                        </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <hr />
                        <h5>View Post</h5>
                        <div className='row' >
                            <div className='col-12'>
                                Title: {data.title}
                            </div>
                        </div>
                        <div className='row' >
                            <div className='col-12'>
                                Type: {data.category}
                            </div>
                        </div>
                        <div className='row' >
                            <div className='col-12'>
                                Description: {data.description}
                            </div>
                        </div>
                        {data.category_type === 2 || data.category_type === 2 ? <div>
                            <div className='row' >
                                <div className='col-12'>
                                    Start Date: {data.start_date}
                                </div>
                            </div>
                            <div className='row' >
                                <div className='col-12'>
                                    End Date: {data.end_date}
                                </div>
                            </div>
                        </div> : ''}
                        <div className='row' >
                            <div className='col-12'>
                                Status: {data.statusObj.name}
                            </div>
                        </div>
                        <div className='row' >
                            <div className='col-12'>
                                Author: {data.author}
                            </div>
                        </div>
                        <div className='row' >
                            <div className='col-12'>
                                <img src={data.image_URL} width="300px" height="300px" />
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div className='row' >
                        <div className='col-12' id="contentDiv" style={{ maxWidth: "95%", margin: 10, textAlign: "justify", wordBreak: "break-word" }}>
                        </div>
                    </div>

                </div>
                {this.state.loader ? <PageLoader /> : null}
            </div>
        );
    }
}

const mapsStateToProps = state => ({
    user: state.user.user
});

export default connect(mapsStateToProps, {
})(ExpandedRowRender);
