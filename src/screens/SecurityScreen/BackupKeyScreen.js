import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Clipboard } from 'react-native';
import Container from '../../components/Container';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';
import LayoutCenter from '../../components/Layout/LayoutCenter';
import Icon from '../../components/Icon';
import { pushTabBasedApp, pushSingleScreenApp, SET_UP_CODE } from '../../navigation';
import { get, size, jwtDecode, toast } from '../../configs/utils';
import { authService } from '../../services/authentication.service';
import { TouchablePreview } from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';

const BackupKeyScreen = ({
    componentId,
}) => {
    const [SecretKey, setSecretKey] = useState("");
    const [ManualEntryKey, setManualEntryKey] = useState("");
    const [Disabled, setDisabled] = useState(false)
    useEffect(() => {
        getQrCode();
        return () => {

        };
    }, []);
    const getQrCode = () => {

        jwtDecode().then(user => {
            if (get(user, "Username")) {
                setDisabled(true);
                authService.getQrCode(get(user, "Username")).then(res => {
                    console.log(res,"Ress");
                    setDisabled(false);
                    if (size(get(res, "secretKey")) > 0 && size(get(res, "manualEntryKey")) > 0) {
                        setSecretKey(get(res, "secretKey"));
                        setManualEntryKey(get(res, "manualEntryKey"));
                    }
                }).catch(err => {
                    console.log(err,"Errr");
                    setDisabled(false)
                })
            }
        })

    }
    const handleCopy = (url) => {
        Clipboard.setString(url);
        toast("COPY_TO_CLIPBOARD".t())
    }
    return (
        <Container
            hasBack
            componentId={componentId}
            title={"BACK_UP_KEY".t()}
            onClickRight={() => pushTabBasedApp(3)}
            textRight={"SKIP".t()}
            style={{
                flex: 1,
            }}
            isLoadding={Disabled}
        >
            <View style={{
                height: "93%",
                justifyContent: "space-between",
            }}>
                <LayoutCenter>
                    <TextFnx space={10} align="center" value={"SAVE_CODE_STEP_3".t()} color={colors.text} />
                    <View style={stylest.blockValue}>
                        <TextFnx size={20} align="center" value={ManualEntryKey} color={colors.highlight} />
                    </View>
                    <TouchablePreview
                        onPress={() => handleCopy(ManualEntryKey)}
                    >
                        <View
                            style={stylest.blockBtn}
                        >
                            <Icon size={18} color={colors.description} name={"copy"} />
                            <TextFnx size={15} color={colors.description} value={`  ${"COPY".t()}`} />
                        </View>
                    </TouchablePreview>

                </LayoutCenter>
                <Button
                    disabled={Disabled}
                    isButtonCircle={false}
                    isSubmit
                    textSubmit={"NEXT".t()}
                    onSubmit={() => pushSingleScreenApp(componentId, SET_UP_CODE, { SecretKey })}
                />
            </View>


        </Container>
    );
}
const stylest = StyleSheet.create({
    blockBtn: {
        height: 50,
        borderColor: colors.highlight,
        borderWidth: 0.5,
        width: 150,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    blockValue: {
        height: 60,
        borderWidth: 0.5,
        borderColor: colors.line,
        backgroundColor: colors.background,
        justifyContent: "center",
        width: "100%",
        marginVertical: 10,
    }
})
export default BackupKeyScreen;
