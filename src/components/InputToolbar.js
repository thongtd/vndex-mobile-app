import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
// import Composer from './Composer';
// import Send from './Send';
// import Actions from './Actions';
// import Color from './Color';

import Send from 'react-native-gifted-chat/lib/Send';
import Color from 'react-native-gifted-chat/lib/Color';
import Actions from 'react-native-gifted-chat/lib/Actions';
import {StylePropType} from 'react-native-gifted-chat/lib/utils';
import Composer from './ComposerVndex';
// import { StylePropType } from './utils';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
});

export default function InputToolbar(props) {
  const [position, setPosition] = useState('absolute');
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setPosition('relative'); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setPosition('absolute'); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener && keyboardDidHideListener.remove();
      keyboardDidShowListener && keyboardDidShowListener.remove();
    };
  }, []);

  const renderActions = () => {
    if (props.renderActions) {
      return props.renderActions(props);
    } else if (props.onPressActionButton) {
      return <Actions {...props} />;
    }
    return null;
  };
  const renderSend = () => {
    if (props.renderSend) {
      return props.renderSend(props);
    }
    return <Send {...props} />;
  };
  const renderComposer = () => {
    if (props.renderComposer) {
      return props.renderComposer(props);
    }
    return <Composer {...props} />;
  };
  const renderAccessory = () => {
    if (props.renderAccessory) {
      return (
        <View style={[styles.accessory, props.accessoryStyle]}>
          {props.renderAccessory(props)}
        </View>
      );
    }
    return null;
  };
  return (
    <View
      style={[styles.container, {position: position}, props.containerStyle]}>
      <View style={[styles.primary, props.primaryStyle]}>
        {renderActions()}
        {renderComposer()}
        {renderSend()}
      </View>
      {renderAccessory()}
    </View>
  );
}

// export default class InputToolbar extends React.Component {
//     constructor() {
//         super(...arguments);
//         this.state = {
//             position: 'absolute',
//         };
//         this.keyboardWillShowListener = undefined;
//         this.keyboardWillHideListener = undefined;
//         this.keyboardWillShow = () => {
//             if (this.state.position !== 'relative') {
//                 this.setState({
//                     position: 'relative',
//                 });
//             }
//         };
//         this.keyboardWillHide = () => {
//             if (this.state.position !== 'absolute') {
//                 this.setState({
//                     position: 'absolute',
//                 });
//             }
//         };
//     }
//     componentDidMount() {
//         this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
//         this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
//     }
//     componentWillUnmount() {
//         if (this.keyboardWillShowListener) {
//             this.keyboardWillShowListener.remove();
//         }
//         if (this.keyboardWillHideListener) {
//             this.keyboardWillHideListener.remove();
//         }
//     }
//     renderActions() {
//         const { containerStyle, ...props } = this.props;
//         if (this.props.renderActions) {
//             return this.props.renderActions(props);
//         }
//         else if (this.props.onPressActionButton) {
//             return <Actions {...props}/>;
//         }
//         return null;
//     }
//     renderSend() {
//         if (this.props.renderSend) {
//             return this.props.renderSend(this.props);
//         }
//         return <Send {...this.props}/>;
//     }
//     renderComposer() {
//         if (this.props.renderComposer) {
//             return this.props.renderComposer(this.props);
//         }
//         return <Composer {...this.props}/>;
//     }
//     renderAccessory() {
//         if (this.props.renderAccessory) {
//             return (<View style={[styles.accessory, this.props.accessoryStyle]}>
//           {this.props.renderAccessory(this.props)}
//         </View>);
//         }
//         return null;
//     }
//     render() {
//         return (<View style={[
//             styles.container,
//             { position: this.state.position },
//             this.props.containerStyle,
//         ]}>
//         <View style={[styles.primary, this.props.primaryStyle]}>
//           {this.renderActions()}
//           {this.renderComposer()}
//           {this.renderSend()}
//         </View>
//         {this.renderAccessory()}
//       </View>);
//     }
// }
InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  onPressActionButton: () => {},
};
InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: StylePropType,
  primaryStyle: StylePropType,
  accessoryStyle: StylePropType,
};
//# sourceMappingURL=InputToolbar.js.map
