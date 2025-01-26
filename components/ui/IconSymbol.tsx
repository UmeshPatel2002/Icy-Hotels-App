import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

const MAPPING = {
  home: 'home',
  explore: 'search1',
  user: 'user',
} as const;

type IconSymbolName = keyof typeof MAPPING; // Restrict the name to MAPPING keys

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName; // Restrict to MAPPING keys
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  const iconName = MAPPING[name];

  if (!iconName) {
    console.warn(`Icon "${name}" is not mapped to a valid AntDesign icon name.`);
    return null; // Fallback if the name is invalid
  }

  return <AntDesign color={color} size={size} name={iconName} style={style} />;
}
