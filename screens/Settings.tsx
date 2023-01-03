import React from "react";
import { useTheme, Text, Button, Dialog, Portal, Provider, TextInput, IconButton } from "react-native-paper";
import { View, Platform, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import { Buffer } from "buffer";
import * as Global from "../Global";
import * as I18N from "../i18n";

const Settings = () => {

    const { colors } = useTheme();

    return (
        <ScrollView style={[{ flex: 1, padding: 12, backgroundColor: colors.background }]} keyboardShouldPersistTaps={true}>
            <View style={{ height: Dimensions.get("window").height }}>
            </View>
        </ScrollView>
    )
};

export default Settings;