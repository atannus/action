import React, {Component, PropTypes} from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {cashay} from 'cashay';
import Auth0ShowLock from 'universal/components/Auth0ShowLock/Auth0ShowLock';
import LoadingView from 'universal/components/LoadingView/LoadingView';
import {getAuthQueryString, authedOptions} from 'universal/redux/getAuthedUser';
import {setWelcomeActivity} from 'universal/modules/userDashboard/ducks/settingsDuck';
import {
  error as showError,
  success as showSuccess,
  warning as showWarning
} from 'universal/modules/notifications/ducks/notifications';

const mapStateToProps = (state, props) => {
  const {params: {id}} = props;
  return {
    authToken: state.authToken,
    inviteToken: id,
    user: cashay.query(getAuthQueryString, authedOptions).data.user,
  };
};

@connect(mapStateToProps)
export default class Invitation extends Component {
  static propTypes = {
    authToken: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    inviteToken: PropTypes.string.isRequired,
    user: PropTypes.object
  };

  componentDidMount() {
    this.stateMachine(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.stateMachine(nextProps);
  }

  stateMachine = (props) => {
    const {authToken, dispatch, user} = props;

    if (authToken) {
      if (user && user.profile.isNew === false) {
        // If user already has an account, let them accept the new team via the UI:
        dispatch(push('/me'));
      } else if (user && user.profile.isNew === true) {
        // If the user is new let's process their invite:
        this.processInvitation();
      }
    }
  }

  processInvitation = () => {
    const {dispatch, inviteToken} = this.props;
    const options = {
      variables: {
        inviteToken
      }
    };
    cashay.mutate('acceptInvitation', options).then(({data, error}) => {
      if (error) {
        if (error.subtype === 'alreadyJoined') {
          /*
           * This should be *very* difficult to have occur:
           */
          dispatch(showError({
            title: 'Team already joined',
            message: `
              Hey, we think you already belong to this team.
            `,
            action: {
              label: 'Ok',
            },
            autoDismiss: 0
          }));
          dispatch(push('/settings/me'));
          return;
        } else if (error.subtype === 'invalidToken') {
          dispatch(showError({
            title: 'Invitation invalid',
            message: `
              We had difficulty with that link. Did you paste it correctly?
            `,
            action: {
              label: 'Ok',
            },
            autoDismiss: 10
          }));
        } else if (error.subtype === 'notFound') {
          dispatch(showWarning({
            title: 'Invitation not found, but don\'t worry',
            message: `
              Hey we couldn't find that invitation. If you'd like to
              create your own team, you can start that process here.
            `,
            action: {
              label: 'Got it',
            },
            autoDismiss: 0
          }));
        } else {
          console.warn('unable to accept invitation:');
          console.warn(error);
        }
        // TODO: pop them a toast and tell them what happened?
        dispatch(push('/welcome'));
      } else if (data) {
        const {id} = data.acceptInvitation.meeting;
        dispatch(setWelcomeActivity(`/team/${id}`));
        dispatch(showSuccess({
          title: 'You\'re in!',
          message: `
            Welcome to Action. Let's get you set up.
          `
        }));
        dispatch(push('/me/settings'));
      }
    }).catch(console.warn.bind(console));
  };

  renderLogin = () => {
    return (
      <div>
        <LoadingView />
        <Auth0ShowLock {...this.props} />
      </div>
    );
  };

  render() {
    const {authToken} = this.props;

    if (!authToken) {
      // Authenticate the user, then let's find out what else to do:
      return this.renderLogin();
    }

    // TODO this would be a nice place for a spinner:
    return <div/>;
  }
}
