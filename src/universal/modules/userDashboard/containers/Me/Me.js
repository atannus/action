import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
// import {cashay} from 'cashay';

const mapStateToProps = () => { // eslint-disable-line arrow-body-style
  return {
    // meetingAndTeam: cashay.query(graphQuery, cashayOpts)
  };
};
@connect(mapStateToProps)
// TODO: make stateless
// eslint-disable-next-line react/prefer-stateless-function
export default class Me extends Component {
  static propTypes = {
    meetingAndTeam: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func
  }

  render() {
    const {userId} = this.props.params;
    return (
      <div>
        It's the Me show! starring: {userId}
      </div>
    );
  }
}