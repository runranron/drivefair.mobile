import React, {Component} from 'react';
import {Layout} from '@ui-kitten/components';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import {screenStyles} from '../theme/styles';
import {receivePushNotification} from '../actions/messages';
import Axios from 'axios';

export class MessagesScreen extends Component {
  componentDidMount = async () => {
    const settings = await messaging().requestPermission();
    if (settings) {
      messaging().onMessage((message) => {
        this.props.receivePushNotification(message);
      });
      messaging().onNotificationOpenedApp((message) => {
        this.props.receivePushNotification(message);
      });
      const token = await messaging().getToken();
      await Axios.post('/drivers/addDeviceToken', {
        deviceToken: token,
      });
    }
  };

  render() {
    return (
      <Layout style={screenStyles.container}>
        <Layout style={screenStyles.body}></Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.session.profile,
});

const mapDispatchToProps = {
  receivePushNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesScreen);
