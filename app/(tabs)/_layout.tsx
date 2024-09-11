import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import en from "@/locales/en/en.json";
import ru from "@/locales/ru/ru.json";
import {I18n} from "i18n-js";
import {getLocales} from "expo-localization";

export default function TabLayout() {
  const colorScheme = useColorScheme();
    const translations = {
        en: en,
        ru: ru,
    };
    const i18n = new I18n(translations);
    i18n.locale = getLocales()[0].languageCode ?? 'en';
    i18n.enableFallback = true;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>

        <Tabs.Screen
        name="index"
        options={{
            title:`${i18n.t('tabs.home')}`,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
        <Tabs.Screen
            name="people"
            options={{
                title:`${i18n.t('tabs.people')}`,
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
                ),
            }}
        />
      <Tabs.Screen
        name="explore"
        options={{
            title:`${i18n.t('tabs.chat')}`,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} />
          ),
        }}
      />
        <Tabs.Screen
            name="profile"
            options={{
                title:`${i18n.t('tabs.profile')}`,
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                ),
            }}
        />
    </Tabs>
  );
}
