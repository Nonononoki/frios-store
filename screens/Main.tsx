import React from "react";
import { useTheme, Text, Button, Dialog, Portal, Provider, TextInput, IconButton } from "react-native-paper";
import { View, FlatList, Platform, StyleSheet, Image, Dimensions, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import * as Global from "../Global";
import { AppInfoT } from "../types";

const Main = () => {

    const { colors } = useTheme();
    const window = Dimensions.get("window");
    const updateIntervalHours = 24; //When sources should be updated TODO should be able to be changed by user
    const iconSize = 60;

    const [apps, setApps] = React.useState(Array<AppInfoT>);
    const [refreshing, setRefreshing] = React.useState(false);

    async function load() {
        update();
    }

    async function update() {
        var response = await Global.fetch(Global.URL_SOURCE_IOS)
        let data: Map<string, AppInfoT> = response.data;

        const arr: AppInfoT[] = [];
        for (let [key, value] of Object.entries(data)) {
            const app: AppInfoT = {} as AppInfoT;
            app.url = value.url;
            app.name = value.name;
            app.website = value.website;
            app.source = value.source;
            app.file = value.file;
            app.category = value.category;
            app.icon = value.icon;
            app.screenshots = value.screenshots;
            app.description = value.description["en"]; //TODO
            app.opensource = value["open-source"];
            app.ads = value.ads;
            app.mtx = value.mtx;
            app.official = value.official;
            app.nsfw = value.nsfw;
            app.bundleId = key;
            app.installed = false; //TODO
            app.version = "value.name"; //TODO
            app.hasUpdate = false; //TODO
            arr.push(app);
        }
        setApps(arr);
    }

    React.useEffect(() => {
        load();
    }, []);

    //numberOfLines={2} {item.description}

    return (
        <View style={{ height: window.height, width: window.width, backgroundColor: colors.background }}>
            <FlatList style={[{ flex: 1, backgroundColor: colors.background, paddingLeft: 12, paddingRight: 12 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={update} />}
                numColumns={1}
                data={apps}
                keyExtractor={(item, index) => { return item.bundleId }}
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8 }}>
                            <View style={{flexGrow: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                <Image style={{ width: iconSize, height: iconSize, borderRadius: 8 }} source={{ uri: item.icon }}></Image>
                                </View>
                                <View style={{flexGrow: 1, marginLeft: 8, marginRight: 12, flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                                    <Text style={{ fontSize: 10, opacity: 0.7 }} numberOfLines={2}>{item.description}</Text>
                                </View>
                                <View>
                                <Button style={{}} mode="elevated">{Global.I18N.get("get")}</Button>
                                </View>
                            </View>
                            
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
};

export default Main;