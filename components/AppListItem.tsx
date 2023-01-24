import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { AppInfoDto } from "../types";
import * as Global from "../Global";

const AppListItem = ({ item }) => {

  const { colors } = useTheme();
  const iconSize = 60;
  const buttonSize = 100;
  const buttonFontSize = 13;
  const [downloading, setDownloading] = React.useState(false);

  function navigateApp(app: AppInfoDto) {
    Global.navigate("AppDetail", {
      app: app
    });
  }

  async function downloadApp() {
    if (!downloading) {
      setDownloading(true);
      await Global.downloadApp(item)
      setDownloading(false);
    }
  }

  async function installApp() {
    if (!downloading)
      await Global.installApp(item);
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8 }}>
      <View style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <TouchableOpacity onPress={() => { navigateApp(item) }}>
            <Image style={{ width: iconSize, height: iconSize, borderRadius: 8 }} source={{ uri: item.icon }}></Image>
          </TouchableOpacity></View>
        <View style={{ flexGrow: 1, marginLeft: 8, marginRight: 12, flex: 1 }}>
          <TouchableOpacity onPress={() => { navigateApp(item) }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text style={{ fontSize: 10, opacity: 0.7 }} numberOfLines={2}>{item.description}</Text>
          </TouchableOpacity>
        </View>
        <View>
          {!item.isDownloaded && <Button loading={downloading} style={{ width: buttonSize }} mode="elevated" onPress={() => downloadApp()}>
            <Text style={{ fontSize: buttonFontSize, color: colors.primary }}>{downloading ? Global.I18N.get("downloading") : Global.I18N.get("get")}</Text>
          </Button>}
          {item.isDownloaded && item.hasUpdate && <Button loading={downloading} style={{ width: buttonSize }} mode="elevated" onPress={() => downloadApp()}>
            <Text style={{ fontSize: buttonFontSize, color: colors.primary }}>{Global.I18N.get("update")}</Text>
          </Button>}
          {item.isDownloaded && !item.hasUpdate && <Button style={{ width: buttonSize }} mode="elevated" onPress={() => installApp()}>
            <Text style={{ fontSize: buttonFontSize, color: colors.primary }}>{Global.I18N.get("install")}</Text>
          </Button>}
        </View>
      </View>
    </View>
  );
};

export default AppListItem;
