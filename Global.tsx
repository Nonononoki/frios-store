import React from "react";
import { Linking, Platform, ToastAndroid } from 'react-native';
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
import * as Sharing from 'expo-sharing';
import moment from "moment";

export const navigationRef = createNavigationContainerRef();
export const TYPE_IOS = "ios";
export const TYPE_TVOS = "tvos";
export const FILE_IPA = "ipa";
export const FILE_DEB = "deb";

export const DIR_ALOVOA = FileSystem.documentDirectory;

export var TYPE = TYPE_IOS;

export const STORAGE_INSTALLED_APPS = "INSTALLED_APPS";
export const I18N = i18n.getI18n();
export const URL_SOURCE_IOS = "https://raw.githubusercontent.com/Nonononoki/frios-sources/master/apps-ios.json";
export const URL_SOURCE_TVOS = "https://raw.githubusercontent.com/Nonononoki/frios-sources/master/apps-tvos.json";
export const URL_SOURCE = URL_SOURCE_IOS;

export var appsDownloadingSet: Set<string> = new Set<string>();
export var appDetailDoneDownload = null;

export var downloadedApps: Map<string, AppInfoDto> = new Map<string, AppInfoDto>();

export async function initDb() {
  let dbString = (await getStorage(STORAGE_INSTALLED_APPS));
  if (dbString) {
    downloadedApps = new Map(JSON.parse(dbString));
  }
  //TODO check local storage and removeAppFromDb()
}

export async function deleteAppFromDb(bundleId: string) {
  downloadedApps.delete(bundleId);
  let json = JSON.stringify([...downloadedApps]);
  await setStorage(STORAGE_INSTALLED_APPS, json);
}

export async function saveAppToDb(appInfo: AppInfoDto) {
  downloadedApps.set(appInfo.bundleId, appInfo);
  let json = JSON.stringify([...downloadedApps]);
  await setStorage(STORAGE_INSTALLED_APPS, json);
}

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
  return await AsyncStorage.getItem(key);
  /*
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
  */
}

export async function setStorage(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
  /*
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
  */
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
  appsDownloadingSet.add(app.bundleId);

  let appDb = await getAppDownloadLink(app);

  if (appDb.remoteLocation) {
    let path = DIR_ALOVOA + app.bundleId + "_" + appDb.updateDate.getTime() + "." + app.file;
    await FileSystem.downloadAsync(appDb.remoteLocation, path);
    console.log("Download finished!")
    app.isDownloaded = true;
    app.updateDate = appDb.updateDate;
    app.localLocation = path;
    await installApp(app);
    await saveAppToDb(app);
  }
  appsDownloadingSet.delete(app.bundleId);
}

export async function getAppDownloadLink(app: AppInfoDto): Promise<AppInfoDto> {
  let uri: string;
  let date: Date;
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
      date = new Date(data.created_at);
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
    let dateString = dateCol.textContent;
    date = moment(dateString, 'YYYY-MM-DD hh:mm').toDate();
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
        let dateString = dateCol.textContent;
        date = moment(dateString, 'YYYY-MMM-DD').toDate();
        uri = app.url + dlLink;
      }
    }
  }
  app.updateDate = date;
  app.remoteLocation = uri;
  return app;
}

export async function hasAppUpdate(app: AppInfoDto): Promise<boolean> {
  let installedApp = downloadedApps.get(app.bundleId)
  let remoteApp = await getAppDownloadLink(app);
  if (remoteApp && remoteApp.updateDate > installedApp.updateDate) {
    return true;
  }
  return false;
}

export async function installApp(app: AppInfoDto) {
  if (await Sharing.isAvailableAsync()) {
    Sharing.shareAsync(app.localLocation);
  }
}

export async function clearLocalFiles(bundleId: string) {
  var files = await FileSystem.readDirectoryAsync(DIR_ALOVOA);
  for (const file of files) {
    if (file.startsWith(bundleId)) {
      await FileSystem.deleteAsync(DIR_ALOVOA + file);
    }
  }
  deleteAppFromDb(bundleId);
}

export const format = (str: string, ...args: any[]) => args.reduce((s, v) => s.replace('%s', v), str);
