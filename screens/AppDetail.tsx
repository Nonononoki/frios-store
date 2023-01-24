import React from "react";
import { useTheme, Text, Button, Appbar, Menu } from "react-native-paper";
import { View, Image, Dimensions, ScrollView, RefreshControl, TouchableOpacityComponent, TouchableOpacity } from "react-native";
import ImageView from "react-native-image-viewing";
import * as Linking from 'expo-linking';
import * as Global from "../Global";

const AppDetail = ({ route, navigation }) => {

    const { app } = route.params;
    const RED = "#ff867c";
    const GREEN = "#98ee99";
    const ORANGE = "#ffd95b";

    const iconSize = 110;
    const screenshotSize = 400;
    const descriptionHeightCollapsed = 78;

    const buttonSize = 110;
    const buttonFontSize = 16;

    const { colors } = useTheme();
    const window = Dimensions.get("window");

    const [refreshing, setRefreshing] = React.useState(false);
    const [imageViewVisible, setImageViewVisible] = React.useState(false);
    const [imageViewIndex, setImageViewIndex] = React.useState(0);
    const [descriptionCollapsed, setDescriptionCollapsed] = React.useState(true);
    const [descriptionHeight, setDescriptionHeight] = React.useState<string | number>(descriptionHeightCollapsed);
    const [downloading, setDownloading] = React.useState(false);
    const [menuVisible, setMenuVisible] = React.useState(false);

    async function load() {
    }

    React.useEffect(() => {
        navigation.setOptions({
            title: ''
        });
        load();
    }, []);

    React.useEffect(() => {
        if (descriptionCollapsed) {
            setDescriptionHeight(descriptionHeightCollapsed);
        } else {
            setDescriptionHeight('auto');
        }
    }, [descriptionCollapsed]);

    async function openImage(index: number) {
        setImageViewIndex(index);
        setImageViewVisible(true);
    }

    async function downloadApp() {
        if(!downloading) {
            setDownloading(true);
            await Global.downloadApp(app)
            setDownloading(false);
          }
    }

    async function installApp() {
        if (!downloading)
            Global.installApp(app);
    }

    function clearLocalFiles() {
        setMenuVisible(false);
        //TODO
    }

    return (
        <View style={{flex: 1}}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { navigation.goBack() }} />
                <Appbar.Content title="" />
                <Menu
                    visible={menuVisible}
                    onDismiss={() => { setMenuVisible(false) }}
                    anchor={<Appbar.Action icon="dots-vertical" onPress={() => { setMenuVisible(!menuVisible) }} />}>
                    <Menu.Item onPress={clearLocalFiles} title={Global.I18N.get("clear-local-files")} />
                </Menu>
            </Appbar.Header>

            <ScrollView style={[{ flex: 1, paddingLeft: 12, paddingRight: 12, backgroundColor: colors.background }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={{ width: iconSize, height: iconSize, borderRadius: 8 }} source={{ uri: app.icon }}></Image>
                    <View style={{ justifyContent: 'space-between', paddingLeft: 18 }}>
                        <View style={{}}>
                            <Text style={{ fontSize: 22, fontWeight: "700" }}>{app.name}</Text>
                            <Text style={{ fontSize: 12, width: 100, opacity: 0.7 }}>{app.author}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {!app.isDownloaded && <Button loading={downloading} style={{ width: buttonSize }} mode="contained" onPress={() => downloadApp()}>
                                <Text style={{ fontSize: buttonFontSize }}>{Global.I18N.get("get")}</Text>
                            </Button>}
                            {app.isDownloaded && app.hasUpdate && <Button loading={downloading} style={{ width: buttonSize }} mode="contained" onPress={() => downloadApp()}>
                                <Text style={{ fontSize: buttonFontSize }}>{Global.I18N.get("update")}</Text>
                            </Button>}
                            {app.isDownloaded && !app.hasUpdate && <Button style={{ width: buttonSize }} mode="contained" onPress={() => installApp()}>
                                <Text style={{ fontSize: buttonFontSize, color: colors.background }}>{Global.I18N.get("install")}</Text>
                            </Button>}
                            {app.mtx &&
                                <View style={{ alignSelf: 'center' }}>
                                    <Text style={{ paddingLeft: 12, fontSize: 10, width: 90, opacity: 0.7 }}>{Global.I18N.get("mtx")}</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 24 }}>
                    <ScrollView horizontal={true} style={{ paddingBottom: 6 }}>
                        {
                            app.opensource ?
                                <Button style={{ marginRight: 4 }} buttonColor={GREEN} textColor={ useTheme().dark ? colors.background : colors.onBackground} icon="source-branch" mode="contained">
                                    {Global.I18N.get("open-source")}
                                </Button> :
                                <Button style={{ marginRight: 4 }} buttonColor={RED} textColor={ useTheme().dark ? colors.background : colors.onBackground} icon="lock" mode="contained">
                                    {Global.I18N.get("proprietary")}
                                </Button>
                        }
                        {
                            app.ads &&
                            <Button style={{ marginRight: 4 }} buttonColor={RED} textColor={ useTheme().dark ? colors.background : colors.onBackground} icon="advertisements" mode="contained">
                                {Global.I18N.get("ads")}
                            </Button>
                        }
                        {
                            app.official ?
                                <Button style={{ marginRight: 4 }} buttonColor={GREEN} textColor={ useTheme().dark ? colors.background : colors.onBackground} icon="check" mode="contained">
                                    {Global.I18N.get("official")}
                                </Button> :
                                <Button style={{ marginRight: 4 }} buttonColor={ORANGE} textColor={ useTheme().dark ? colors.background : colors.onBackground} icon="alert" mode="contained">
                                    {Global.I18N.get("unofficial")}
                                </Button>
                        }
                        {
                            app.website &&
                            <Button buttonColor={colors.secondary} style={{ marginRight: 4 }} icon="web" mode="contained" onPress={() => Linking.openURL(app.website)}>
                                {Global.I18N.get("website")}
                            </Button>
                        }
                    </ScrollView>
                </View>

                <View style={{ marginTop: 24, paddingBottom: 6 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 4 }}>{Global.I18N.get("description")}</Text>
                    <TouchableOpacity onPress={() => setDescriptionCollapsed(!descriptionCollapsed)}>
                        <Text style={{ height: descriptionHeight }}>{app.description}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 24, paddingBottom: 6 }}>
                    {app.screenshots.length > 0 && <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 4 }}>{Global.I18N.get("screenshots")}</Text>}
                    <ScrollView horizontal={true}>
                        {app.screenshots.map((obj: { uri: string; }, index: number) => {
                            return (
                                <TouchableOpacity onPress={() => openImage(index)} key={index}>
                                    <Image style={{ width: screenshotSize / 2, height: screenshotSize, margin: 4 }} source={{ uri: obj.uri }} />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <ImageView
                    images={app?.screenshots}
                    imageIndex={imageViewIndex}
                    visible={imageViewVisible}
                    onRequestClose={() => setImageViewVisible(false)}
                />
            </ScrollView>
        </View>
    )
};

export default AppDetail;