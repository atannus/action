import React, {Component, PropTypes} from 'react';
import look, {StyleSheet} from 'react-look';
import theme from 'universal/styles/theme';

let styles = {};

@look
// eslint-disable-next-line react/prefer-stateless-function
export default class SetupHeader extends Component {
  static propTypes = {
    heading: PropTypes.string,
    subHeading: PropTypes.object
  }

  render() {
    const {heading, subHeading} = this.props;

    return (
      <div className={styles.setupHeader}>
        <h1 className={styles.setupHeading}>
          {heading}
        </h1>
        {subHeading &&
          <h2 className={styles.setupSubHeading}>{subHeading}</h2>
        }
      </div>
    );
  }
}

styles = StyleSheet.create({
  setupHeader: {
    // Define container
  },

  setupHeading: {
    color: theme.palette.warm,
    // TODO: Check font assets, font weight of Werrimeather (TA)
    fontFamily: theme.typography.serif,
    fontSize: theme.typography.s7,
    margin: '2rem 0 1rem',
    textAlign: 'center'
  },

  setupSubHeading: {
    color: theme.palette.dark10d,
    fontSize: theme.typography.s6,
    margin: '0 0 2rem',
    textAlign: 'center'
  }
});
