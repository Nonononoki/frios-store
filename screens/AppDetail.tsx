import React from "react";
import { useTheme, Text, Button } from "react-native-paper";
import { View, Image, Dimensions, ScrollView, RefreshControl, TouchableOpacityComponent, TouchableOpacity } from "react-native";
import ImageView from "react-native-image-viewing";
import * as Linking from 'expo-linking';
import * as Global from "../Global";

const AppDetail = ({ route, navigation }) => {

    const { app } = route.params;
    const RED = "#ba000d";
    const GREEN = "#087f23";
    const ORANGE = "#c66900";

    const iconSize = 110;
    const screenshotSize = 400;

    const { colors } = useTheme();
    const window = Dimensions.get("window");

    const [refreshing, setRefreshing] = React.useState(false);
    const [imageViewVisible, setImageViewVisible] = React.useState(false);
    const [imageViewIndex, setImageViewIndex] = React.useState(0);


    async function load() {
    }

    React.useEffect(() => {
        navigation.setOptions({
            title: ''
        });
        load();
    }, []);

    async function openImage(index: number) {
        setImageViewIndex(index);
        setImageViewVisible(true);
    }

    return (
        <ScrollView style={[{ flex: 1, padding: 12, backgroundColor: colors.background }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
            <View style={{ flexDirection: 'row' }}>
                <Image style={{ width: iconSize, height: iconSize, borderRadius: 8 }} source={{ uri: app.icon }}></Image>
                <View style={{ justifyContent: 'space-between', paddingLeft: 18 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 22, fontWeight: "700" }}>{app.name}</Text>
                        <Text style={{ fontSize: 12, width: 100, opacity: 0.7 }}>{app.author}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button mode="contained" style={{}}>{Global.I18N.get("get")}</Button>
                        {!app.mtx &&
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={{ paddingLeft: 12, fontSize: 10, width: 90, opacity: 0.7 }}>{Global.I18N.get("mtx")}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>

            <ScrollView horizontal={true} style={{ marginTop: 24, paddingBottom: 6 }}>
                {
                    app.opensource ?
                        <Button style={{ marginRight: 4, backgroundColor: GREEN }} icon="source-branch" mode="contained">
                            {Global.I18N.get("open-source")}
                        </Button> :
                        <Button style={{ marginRight: 4, backgroundColor: RED }} icon="lock" mode="contained">
                            {Global.I18N.get("proprietary")}
                        </Button>
                }
                {
                    app.ads &&
                    <Button style={{ marginRight: 4, backgroundColor: RED }} icon="advertisements" mode="contained">
                        {Global.I18N.get("ads")}
                    </Button>
                }
                {
                    app.official ?
                        <Button style={{ marginRight: 4, backgroundColor: GREEN }} icon="check" mode="contained">
                            {Global.I18N.get("official")}
                        </Button> :
                        <Button style={{ marginRight: 4, backgroundColor: ORANGE }} icon="alert" mode="contained">
                            {Global.I18N.get("unofficial")}
                        </Button>
                }
                {
                    app.website &&
                    <Button style={{ marginRight: 4 }} icon="web" mode="contained" onPress={() => Linking.openURL(app.website)}>
                        {Global.I18N.get("website")}
                    </Button>
                }
            </ScrollView>

            <ScrollView horizontal={true} style={{ marginTop: 24, paddingBottom: 6, marginRight: 8 }}>
                {app.screenshots.map((obj: { uri: string; }, index: number) => {
                    return (
                        <TouchableOpacity onPress={() => openImage(index)}>
                            <Image style={{ width: screenshotSize / 2, height: screenshotSize, margin: 4 }} source={{ uri: obj.uri }} />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <ImageView
                images={app?.screenshots}
                imageIndex={imageViewIndex}
                visible={imageViewVisible}
                onRequestClose={() => setImageViewVisible(false)}
            />
        </ScrollView>
    )
};

export default AppDetail;