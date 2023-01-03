import React from "react";
import { Platform, ToastAndroid } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNavigationContainerRef } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import * as i18n from "./i18n";

export const navigationRef = createNavigationContainerRef();

export const STORAGE_UPDATE_DATE = "UPDATE_DATE";
export const I18N = i18n.getI18n();
export const URL_SOURCE_IOS = "https://raw.githubusercontent.com/Nonononoki/frios-sources/master/apps-ios.json";
export const URL_SOURCE_TVOS = "https://raw.githubusercontent.com/Nonononoki/frios-sources/master/apps-tvos.json";

export async function fetch(url: string = "", method: string = "get", data: any = {},
  contentType: string = "application/json"): Promise<AxiosResponse<any, any>> {
  try {
    let res = await axios({
      withCredentials: true,
      method: method,
      url: url,
      headers: {
        'Content-Type': contentType
      },
      data: data,
    })
    return res;
  } catch (e) {
    throw e;
  }
}

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export async function getStorage(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export async function setStorage(key: string, value: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export function showToast(text: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(text, ToastAndroid.LONG);
  } else {
    Toast.show(text, {
      duration: Toast.durations.LONG,
      backgroundColor: "#424242"
    });
  }
}

export function getGithubApiUrl(url: string): string {
  const githubApiUrl = "https://api.github.com/repos/%s/releases/latest";
  const path = getLast2Paths(url);
  return format(githubApiUrl, path);
}

export function getLast2Paths(url: string): string {
  return url.split('/').slice(-2).join('/');;
}

export function getHostname (url: string) {
  return new URL(url).hostname;
}

export const format = (str: string, ...args: any[]) => args.reduce((s, v) => s.replace('%s', v), str);