import React from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { bool, string, number } from 'prop-types';

export default function getTabBarIcon(route) {
  function IconComponent({ focused, color, size }) {
    let iconName;

    if (route.name === 'メニュー') {
      iconName = focused ? 'home' : 'home-outline';
      return <MaterialIcons name="menu-book" size={size} color={color} />;
    } if (route.name === 'クーポン') {
      iconName = focused ? 'ticket' : 'ticket-outline';
      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    } if (route.name === 'ランキング') {
      iconName = focused ? 'trophy' : 'trophy-outline';
    } else if (route.name === 'フレンド') {
      iconName = focused ? 'people' : 'people-outline';
    } else if (route.name === 'ホーム') {
      iconName = focused ? 'home' : 'home-outline';
    }
    return <Ionicons name={iconName} size={size} color={color} />;
  }

  IconComponent.propTypes = {
    focused: bool.isRequired,
    color: string.isRequired,
    size: number.isRequired,
  };

  return IconComponent;
}
