import React from "react";
import { Platform, ToastAndroid } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNavigationContainerRef, useRoute } from '@react-navigation/native';
import Toast from 'react-native-root-toast';
import * as i18n from "./i18n";
import * as FileSystem from 'expo-file-system';
import { AppInfoDto, AppSourceE, GithubReleasesAssetT, GithubReleasesT } from "./types";
const { DOMParser } = require('react-native-html-parser')
import { URL } from 'react-native-url-polyfill';

export const navigationRef = createNavigationContainerRef();
export const TYPE_IOS = "ios";
export const TYPE_TVOS = "tvos";
export const FILE_IPA = "ipa";
export const FILE_DEB = "deb";

export const DIR_ALOVOA = FileSystem.documentDirectory;

export var TYPE = TYPE_IOS;

export const STORAGE_UPDATE_DATE = "UPDATE_DATE";
export const I18N = i18n.getI18n();
export const URL_SOURCE_IOS = "https://raw.githubusercontent.com/Nonononoki/frios-sources/master/apps-ios.json";
export const URL_SOURCE_TVOS = "https://raw.githubusercontent.com/Nonononoki/frios-sources/master/apps-tvos.json";

export var appsDownloadingSet: Set<string> = new Set<string>();

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

export function getHostname(uri: string) {
  let url = new URL(uri);
  return url.hostname;
}

export async function downloadApp(app: AppInfoDto) {
  let uri: string;
  let date: string;
  appsDownloadingSet.add(app.bundleId);

  if (app.source == AppSourceE.GITHUB) {
    let url = getGithubApiUrl(app.url);
    let response = await fetch(url);
    let data: GithubReleasesT = response.data;
    let downloadUrl: string;
    for (let i = 0; i < data.assets.length; i++) {
      let obj: GithubReleasesAssetT = data.assets[i];
      if (obj.name.endsWith("." + app.file)) {
        if (TYPE == TYPE_IOS && !obj.name.toLowerCase().includes(TYPE_TVOS) ||
          TYPE == TYPE_TVOS && obj.name.toLowerCase().includes(TYPE_TVOS)) {
          downloadUrl = obj.browser_download_url;
          break;
        }
      }
    }
    if (downloadUrl) {
      uri = downloadUrl;
      date = new Date(data.created_at).toISOString().split('T')[0];
    }
  } else if (app.source == AppSourceE.RETROARCH) {
    let response = await fetch(app.url);
    let data: string = response.data;
    const doc = new DOMParser().parseFromString(data, 'text/html');
    const table = doc.getElementById("fallback").firstChild;
    const lastRow = table.lastChild;
    const imageCol = lastRow.firstChild;
    const linkCol = imageCol.nextSibling;
    const dateCol = linkCol.nextSibling;
    uri = getHostname(app.url) + linkCol.firstChild.getAttribute("href");
    date = dateCol.textContent;
  } else if (app.source == AppSourceE.KODI) {
    let response = await fetch(app.url);
    let data: string = response.data;
    const doc = new DOMParser().parseFromString(data, 'text/html');
    const table: Node = doc.getElementById("list");
    const tableHead: Node = table.firstChild;
    const tableBody: Node = tableHead.nextSibling.nextSibling;
    let node: Node = tableBody.firstChild.nextSibling; //ignore first 2 rows: /parent and /old
    let found = false;
    while (node.nextSibling.nextSibling && !found) {
      node = node.nextSibling.nextSibling;
      let dataCol = node.firstChild;
      let dlLink = dataCol.firstChild.getAttribute("href");
      if (!dlLink.includes("~rc") && !dlLink.includes("~b")) { //ignore non-stable releases
        found = true;
        let sizeCol = dataCol.nextSibling;
        let dateCol = sizeCol.nextSibling;
        date = dateCol.textContent;
        uri = app.url + dlLink;
      }
    }
  }

  if (uri) {
    let path = DIR_ALOVOA + app.bundleId + "_" + date + "." + app.file;
    console.log(uri)
    console.log(path)
    //await FileSystem.downloadAsync(uri, path);
  }

  appsDownloadingSet.delete(app.bundleId);
}

//TODO
export async function hasAppUpdate(app: AppInfoDto): Promise<boolean> {
  if (app.source == AppSourceE.GITHUB) {
    let url = getGithubApiUrl(app.url);
    let response = await fetch(url);
    let data: GithubReleasesT = response.data;
  } else if (app.source == AppSourceE.RETROARCH) {
  } else if (app.source == AppSourceE.KODI) {
  }
  return false;
}

export const format = (str: string, ...args: any[]) => args.reduce((s, v) => s.replace('%s', v), str);