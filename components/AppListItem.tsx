import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { AppInfoDto } from "../types";
import * as Global from "../Global";

const AppListItem = ({item}) => {

  const iconSize = 60;

  function navigateApp(app: AppInfoDto) {
    Global.navigate("AppDetail", {
        app: app
    });
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
          <Button style={{}} mode="elevated">{Global.I18N.get("get")}</Button>
        </View>
      </View>
    </View>
  );
};

export default AppListItem;
