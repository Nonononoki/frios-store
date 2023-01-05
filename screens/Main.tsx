import React from "react";
import { useTheme, Text, Button, Dialog, Portal, Provider, TextInput, IconButton, Searchbar } from "react-native-paper";
import { View, FlatList, Platform, StyleSheet, Image, Dimensions, ScrollView, RefreshControl, TouchableOpacity, Keyboard } from "react-native";
import * as Global from "../Global";
import { AppInfoDto, AppInfoT } from "../types";

const Main = () => {

    const { colors } = useTheme();
    const window = Dimensions.get("window");
    const updateIntervalHours = 24; //When sources should be updated TODO should be able to be changed by user
    const iconSize = 60;

    const [apps, setApps] = React.useState(Array<AppInfoDto>);
    const [refreshing, setRefreshing] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    async function load() {
        update();
    }

    async function update() {
        setSearchQuery("");
        Keyboard.dismiss();
        var response = await Global.fetch(Global.URL_SOURCE_IOS)
        let data: Map<string, AppInfoT> = response.data;

        const arr: AppInfoDto[] = [];
        for (let [key, value] of Object.entries(data)) {
            const app: AppInfoDto = {} as AppInfoDto;
            app.url = value.url;
            app.name = value.name;
            app.website = value.website;
            app.source = value.source;
            app.file = value.file;
            app.category = value.category;
            app.icon = value.icon;
            app.screenshots = value.screenshots;
            app.description = value.description["en"]; //TODO
            app.opensource = value.opensource;
            app.ads = value.ads;
            app.mtx = value.mtx;
            app.official = value.official;
            app.nsfw = value.nsfw;
            app.bundleId = key;
            app.installed = false; //TODO
            app.version = "value.name"; //TODO
            app.hasUpdate = false; //TODO
            app.visible = true;
            arr.push(app);
        }
        setApps(arr);
    }

    React.useEffect(() => {
        load();
    }, []);

    function onChangeSearch(text: string) {
        setSearchQuery(text);
        filter(text);
    }

    function filter(text: string) {
        const query = text.toLowerCase();
        if (query) {
            apps.forEach(function (app) {
                app.visible = app.name.toLowerCase().includes(query) || app.description.toLowerCase().includes(query);
            });
        } else {
            Keyboard.dismiss();
            apps.forEach(function (app) {
                app.visible = true;
            });
        }
    }

    function navigateApp(app: AppInfoDto) {
        Global.navigate("App", {
            app: app
        });
    }

    return (
        <View style={{ height: window.height, width: window.width, backgroundColor: colors.background }}>
            <Searchbar
                style={{ paddingTop: 24 }}
                onChangeText={onChangeSearch}
                value={searchQuery}>
            </Searchbar>
            <FlatList style={[{ flex: 1, backgroundColor: colors.background, paddingLeft: 12, paddingRight: 12 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={update} />}
                numColumns={1}
                data={apps}
                keyExtractor={(item, index) => { return item.bundleId }}
                renderItem={({ item }) => item.visible ? (
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
                ) : undefined}
            />
        </View>
    )
};

export default Main;