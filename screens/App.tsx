import React from "react";
import { useTheme, Text, Button, Dialog, Portal, Provider, TextInput, IconButton } from "react-native-paper";
import { View, Platform, StyleSheet, Image, Dimensions, ScrollView, RefreshControl } from "react-native";
import * as Global from "../Global";
import * as I18N from "../i18n";

const App = () => {

    const { colors } = useTheme();
    const window = Dimensions.get("window");
    const updateIntervalHours = 24; //TODO When sources should be updated


    const [refreshing, setRefreshing] = React.useState(false);

    async function load() {
        
    }

    React.useEffect(() => {
        load();
      }, []);

    return (
        <ScrollView style={[{ flex: 1, padding: 12, backgroundColor: colors.background }]} keyboardShouldPersistTaps={true}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
            <View style={{ height: window.height }}>
            </View>
        </ScrollView>
    )
};

export default App;