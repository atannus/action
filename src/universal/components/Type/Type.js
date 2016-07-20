import React, {PropTypes} from 'react';
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

const Type = (props) => {
  const {
    align,
    children,
    display,
    family,
    marginBottom,
    marginTop,
    scale,
    style,
    theme,
    weight,
    width
  } = props;

  const s = StyleSheet.create({
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
  });

  return (
    <div className={s.root}>
      {children}
    </div>
  );
};

Type.propTypes = {
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
};

Type.defaultProps = {
  align: 'left',
  display: 'block',
  family: 'sansSerif',
  marginBottom: '0px',
  marginTop: '0px',
  scale: 'sBase',
  style: 'normal',
  theme: 'dark',
  weight: '400',
  width: '100%'
};

export default look(Type);
