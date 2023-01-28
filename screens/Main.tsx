import React from "react";
import { useTheme, Searchbar } from "react-native-paper";
import { View, FlatList, Dimensions, RefreshControl, Keyboard } from "react-native";
import * as Global from "../Global";
import { AppInfoDto, AppInfoT } from "../types";
import { AppListItem } from "../components";

const Main = ({ route, navigation }) => {

    const { colors } = useTheme();
    const window = Dimensions.get("window");
    const updateIntervalHours = 24; //When sources should be updated TODO should be able to be changed by user

    const [apps, setApps] = React.useState<Map<string, AppInfoDto>>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [refreshFlatlist, setRefreshFlatList] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    async function load() {
        await Global.initDb();
        await update();
    }

    React.useEffect(() => {
        if (route.params?.changed) {
            load();
        }
    }, [route.params?.changed]);

    async function loadAppsFromDb() {
        if (Global.downloadedApps) {
            for (let [key, value] of Global.downloadedApps) {
                value.isDownloaded = true;
                apps.set(key, value);
            }
            setRefreshFlatList(!refreshFlatlist);
            for (let [key, value] of Global.downloadedApps) {
                value.hasUpdate = await Global.hasAppUpdate(value);
                apps.set(key, value);
            }
            setRefreshFlatList(!refreshFlatlist);
        }
    }

    async function update() {
        setSearchQuery("");
        Keyboard.dismiss();
        var response = await Global.fetch(Global.URL_SOURCE)
        let data: Map<string, AppInfoT> = response.data;

        const map = new Map<string, AppInfoDto>();
        for (let [key, value] of Object.entries(data)) {
            const app: AppInfoDto = {} as AppInfoDto;
            app.url = value.url;
            app.name = value.name;
            app.website = value.website;
            app.source = value.source;
            app.author = value.author;
            app.file = value.file;
            app.category = value.category;
            app.icon = value.icon;
            app.opensource = value.opensource;
            app.ads = value.ads;
            app.mtx = value.mtx;
            app.official = value.official;
            app.nsfw = value.nsfw;
            app.bundleId = key;
            app.visible = true;

            let locale = Global.I18N.locale;
            app.description = value.description[locale] ? value.description[locale] : value.description["en"];

            var imgObjs = [];
            while (value.screenshots.length) {
                let uri = value.screenshots.shift();
                let obj = { uri: uri };
                imgObjs.push(obj);
            }
            app.screenshots = imgObjs;

            app.isDownloaded = false;
            app.hasUpdate = false;
            map.set(key, app);
        }
        setApps(map);
    }

    React.useEffect(() => {
        load();
    }, []);

    React.useEffect(() => {
        loadAppsFromDb();
    }, [apps]);

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
        setRefreshFlatList(!refreshFlatlist);
    }

    return (
        <View style={{ height: window.height, width: window.width, backgroundColor: colors.background }}>
            <Searchbar
                style={{ paddingTop: 24 }}
                onChangeText={onChangeSearch}
                value={searchQuery}>
            </Searchbar>
            <FlatList style={[{ flex: 1, backgroundColor: colors.background, paddingLeft: 12, paddingRight: 12 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
                numColumns={1}
                data={apps ? [...apps.values()] : undefined}
                extraData={refreshFlatlist}
                keyExtractor={(item, index) => { return item.bundleId }}
                renderItem={({ item }) => item.visible ? (
                    <AppListItem item={item} />
                ) : undefined}
            />
        </View>
    )
};

export default Main;