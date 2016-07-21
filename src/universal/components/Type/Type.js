import React, {Component, PropTypes} from 'react';
// import lazyStyleUpdate from 'universal/decorators/lazyStyleUpdate/lazyStyleUpdate';
import look, {StyleSheet} from 'react-look';
import * as t from 'universal/styles/theme';

const colors = {
  cool: t.palette.cool,
  warm: t.palette.warm,
  dark: t.palette.dark,
  mid: t.palette.mid,
  light: t.palette.light,
  white: '#fff'
};

// @lazyStyleUpdate
@look
export default class Type extends Component {
  static propTypes = {
    align: PropTypes.oneOf([
      'left',
      'center',
      'right'
    ]),
    children: PropTypes.any,
    display: PropTypes.oneOf([
      'block',
      'inline',
      'inline-block'
    ]),
    family: PropTypes.oneOf([
      'sansSerif',
      'serif'
    ]),
    marginBottom: PropTypes.string,
    marginTop: PropTypes.string,
    scale: PropTypes.oneOf([
      'sBase', // 16px
      's1',    // 12px
      's2',    // 13px
      's3',    // 14px
      's4',    // 18px
      's5',    // 20px
      's6',    // 24px
      's7',    // 36px
      's8',    // 48px
    ]),
    shouldUpdate: PropTypes.bool,
    style: PropTypes.oneOf([
      'normal',
      'italic',
    ]),
    theme: PropTypes.oneOf([
      'cool',
      'warm',
      'dark',
      'mid',
      'light',
      'white'
    ]),
    weight: PropTypes.oneOf([
      '400', // normal
      '700'  // bold
    ]),
    width: PropTypes.oneOf([
      'auto',
      '100%'
    ])
  }

  // TODO: shouldUpdate prop and initiated prop?

  static defaultProps = {
    align: 'left',
    display: 'block',
    family: 'sansSerif',
    marginBottom: '0px',
    marginTop: '0px',
    scale: 'sBase',
    shouldUpdate: false,
    style: 'normal',
    theme: 'dark',
    weight: '400',
    width: '100%'
  }

  constructor(props) {
    super(props);
    this.state = {
      styles: false
    };
  }

  render() {
    if (!this.state.styles && !this.props.shouldUpdate) {
      const {
        align,
        // children,
        display,
        family,
        marginBottom,
        marginTop,
        scale,
        style,
        theme,
        weight,
        width
      } = this.props;

      this.setState({
        styles: StyleSheet.create({
          root: {
            color: colors[theme],
            display,
            fontFamily: t.typography[family],
            fontSize: t.typography[scale],
            fontStyle: style,
            fontWeight: weight,
            textAlign: align,
            marginBottom,
            marginTop,
            width
          }
        })
      });
    }

    return (
      <div className={this.state.styles.root}>
        {this.props.children}
      </div>
    );
  }
}
