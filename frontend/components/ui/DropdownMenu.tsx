import React, { useState } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';


export const DropdownMenu = ({ children, triggerOnLongPress = false }) => {
  const [visible, setVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState(null);

  return (
    <View style={styles.container}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { visible, setVisible, triggerLayout, setTriggerLayout, triggerOnLongPress })
      )}
    </View>
  );
};

export const DropdownMenuTrigger = ({ children, visible, setVisible, setTriggerLayout, triggerOnLongPress }) => {
  const triggerRef = React.useRef(null);

  const handlePress = () => {
    if (triggerRef.current) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        setTriggerLayout({ x: px, y: py, width, height });
        setVisible(!visible);
      });
    }
  };

  return (
    <Pressable
      ref={triggerRef}
      onPress={triggerOnLongPress ? undefined : handlePress}
      onLongPress={triggerOnLongPress ? handlePress : undefined}
      delayLongPress={triggerOnLongPress ? 1000 : undefined}
      style={styles.trigger}
    >
      {children}
    </Pressable>
  );
};

export const DropdownMenuContent = ({ children, visible, setVisible, triggerLayout, align = 'left' }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  const calculatePosition = () => {
    if (!triggerLayout) return { top: 100, left: 20 };

    const top = triggerLayout.y + triggerLayout.height + 5;
    let left = triggerLayout.x;

    // Align right: position dropdown so its right edge aligns with trigger's right edge
    if (align === 'right') {
      left = triggerLayout.x + triggerLayout.width - 200; // 200 is minWidth of content
    }

    return { top, left };
  };

  const position = calculatePosition();

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setVisible(false)}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
              top: position.top,
              left: position.left,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <ScrollView style={styles.scrollView}>
              {React.Children.map(children, (child) =>
                React.cloneElement(child, { setVisible })
              )}
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export const DropdownMenuItem = ({ children, onSelect, setVisible, icon, disabled }) => {
  const handlePress = () => {
    if (!disabled && onSelect) {
      onSelect();
      setVisible(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.item, disabled && styles.itemDisabled]}
      onPress={handlePress}
      disabled={disabled}
    >
      {icon && <View style={styles.itemIcon}>{icon}</View>}
      <Text style={[styles.itemText, disabled && styles.itemTextDisabled]}>{children}</Text>
    </TouchableOpacity>
  );
};

export const DropdownMenuLabel = ({ children }) => (
  <View style={styles.label}>
    <Text style={styles.labelText}>{children}</Text>
  </View>
);

export const DropdownMenuSeparator = () => <View style={styles.separator} />;

export const DropdownMenuGroup = ({ children }) => (
  <View style={styles.group}>{children}</View>
);

export const DropdownMenuSub = ({ children, trigger }) => {
  const [subVisible, setSubVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.item}
        onPress={() => setSubVisible(!subVisible)}
      >
        <Text style={styles.itemText}>{trigger}</Text>
        <IconSymbol name="chevron.right" size={16} color="#666" />
      </TouchableOpacity>
      {subVisible && (
        <View style={styles.subContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export const DropdownMenuCheckboxItem = ({ children, checked, onCheckedChange, setVisible }) => {
  const handlePress = () => {
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <View style={styles.checkbox}>
        {checked && <IconSymbol name="check" size={16} color="#000" />}
      </View>
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
};

export const DropdownMenuRadioGroup = ({ children, value, onValueChange }) => {
  return (
    <View>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { 
          selectedValue: value, 
          onValueChange 
        })
      )}
    </View>
  );
};

export const DropdownMenuRadioItem = ({ children, value, selectedValue, onValueChange, setVisible }) => {
  const isSelected = value === selectedValue;

  const handlePress = () => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <View style={styles.radio}>
        {isSelected && <IconSymbol name="circle" size={10} color="#000" />}
      </View>
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
};

export const DropdownMenuShortcut = ({ children }) => (
  <Text style={styles.shortcut}>{children}</Text>
);

// Styles
const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  trigger: {
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    position: 'absolute',
    minWidth: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 400,
  },
  scrollView: {
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    minHeight: 40,
  },
  itemIcon: {
    marginRight: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemTextDisabled: {
    color: '#999',
  },
  label: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 4,
    marginHorizontal: -4,
  },
  group: {
    marginVertical: 2,
  },
  subContent: {
    paddingLeft: 20,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 2,
    borderLeftColor: '#e5e5e5',
    marginLeft: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcut: {
    fontSize: 12,
    color: '#999',
    marginLeft: 'auto',
  },
});