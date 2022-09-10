import { StyleSheet, View, Image, Pressable, TextInput, Alert, FlatList } from "react-native";
import { useState } from "react";
import css from '../../commonCss';
import Text from '../../MyText';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { baseName, fileFormat as fFormat } from "../../../helpers/common";
const imgPath = '../../../assets/icons/';

export default function StepAdditionalInfo({
    category,
    prev,
    updateAdditionalData,
    images = [], //images list
    updateImages, //update image
    value,
    isMandatoryAttachment
}) {

    // const [image, setImage] = useState('');
    const [isError, setError] = useState(false);

    const getFileInfo = async (fileURI) => {
        const fileInfo = await FileSystem.getInfoAsync(fileURI)
        return fileInfo
    }

    const getFileSizeMB = (fileSize) => fileSize / 1024 / 1024;

    const isLessThanTheMB = (fileSize, smallerThanSizeMB) => {
        const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB
        return isOk
    }

    const bytesToSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes} ${sizes[i]})`

        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    }

    const getImageObj = async (uri, file) => {

        const fileName = baseName(uri);

        const fileBase64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });

        const fileInfo = await getFileInfo(uri);

        const fileRawSize = fileInfo?.size;

        const fileSize = getFileSizeMB(fileRawSize);

        const isFileSmall = isLessThanTheMB(fileRawSize, 1);

        const fileSizeFormat = bytesToSize(fileRawSize);

        const fileFormat = fFormat(uri);
        // const id = Date.now();

        return {
            name: fileName,
            sizeMB: fileSize,
            size: fileRawSize,
            lessThanMB: isFileSmall,
            base64: fileBase64,
            fileSizeFormat,
            uri,
            format: fileFormat,
            file
        }
    }

    const isValidImageFormats = (format) => {
        return format == "png" || format == "jpg" || format == "jpeg"
    }

    const showImagePicker = async () => {

        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert("You've refused to allow this app to access your photos!");
                return;
            }

            const pickedImage = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                //allowsEditing: true,
                // base64: true,
                aspect: [4, 3],
                quality: 0.6
            });

            console.log("pickedImage lib ", pickedImage)

            if (!pickedImage.cancelled) {
                // setImage(pickedImage);

                const imgObj = await getImageObj(pickedImage?.uri, pickedImage);

                if (imgObj?.lessThanMB) {

                    storeImage(imgObj);

                } else {
                    // over size

                }
            }

        } catch (e) {
            console.log(e)
        }
    }

    const openCamera = async () => {
        try {

            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert("You've refused to allow this appp to access your camera!");
                return;
            }

            const cameraImage = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                //allowsEditing: true,
                // base64: true,
                aspect: [4, 3],
                quality: 0.6,
                base64: true,
            });
            console.log("cameraImage cam ", cameraImage)

            if (!cameraImage.cancelled) {
                // setImage(cameraImage);
                const imgObj = await getImageObj(cameraImage?.uri, cameraImage);

                if (imgObj?.lessThanMB) {

                    storeImage(imgObj);

                } else {
                    // over size

                }

            }

        } catch (e) {
            console.log(e)
        }
    }

    const storeImage = (imgObj) => {

        // check duplicates...
        const exist = images.filter((item, index) => item?.uri == imgObj?.uri);

        // check if valid formats
        const isValid = isValidImageFormats(imgObj?.format?.toLowerCase());

        // check if limit 5 reached
        const isLimit = images?.length < 5;

        console.log("imgObj ", imgObj)
        console.log("isLimit ", images?.length)

        if (!isLimit) {
            setError(true);
            return;
        }

        if (isValid && !(exist?.length > 0) && isLimit) {

            const currentImage = images;
            updateImages(currentImage.concat(imgObj));

            setError(false);
        } else {

        }
    }


    const removeImage = (id) => {
        // const image = images.find(item => item.id ===id );
        // image.blob.close();
        const img = images.filter((item, index) => index !== id);
        updateImages(img);
        setError(false);
    };

    const getTotalSize = () => {
        let size = 0;

        images?.forEach((item) => {
            size = size + item?.size;
        })

        return size ? bytesToSize(size) : "0 KB";
    }

    return (
        <>
            <View style={[styles.titleContainer]}>
                <Text style={[styles.title]}>Add additional information </Text>
                <Text style={[styles.AdditionalText, (isMandatoryAttachment ? css.cMaroon : css.blackC)]}>{isMandatoryAttachment ? '(Mandatory)' : '(optional)'}</Text>
            </View>
            <View style={[css.spaceT5]}>
                <View>
                    <Text style={[css.lGreyC, css.f12, css.fr]}>Tell us in short what is the exact issue you are facing.</Text>
                    <Text style={[css.spaceT5, css.blackC, css.f16, css.fm]}>Upload images</Text>
                    <View>
                        <View style={[styles.buttonContainer]}>
                            <Pressable onPress={openCamera} style={[styles.cameraButton]}>
                                <AntDesign name="camerao" size={24} color="#525252" />
                            </Pressable>
                            <Pressable onPress={showImagePicker} style={[styles.cameraButton,]}>
                                <Text style={[css.lGreyC, css.f18, css.fr, css.textRight]}>| Browse</Text>
                            </Pressable>
                        </View>
                        <View style={[css.flexDRR, css.line10]}>
                            <Text style={[css.blackC, css.f16, css.fm, css.spaceT10,]}>Total Size: {getTotalSize()}</Text>
                        </View>

                        <View>
                            {images?.map((item, index) => {
                                return (
                                    <View key={index} style={[css.flexDR, css.line10, { flex: 1 }]}>
                                        <View style={[{ marginRight: 10 }]}>
                                            <Image source={{ uri: `data:image/jpg;base64,${item?.base64}` }} style={[css.img100]} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    numberOfLines={3}

                                                    style={[css.blackC, css.f16, css.fm, { flexWrap: 'wrap' }]}
                                                >
                                                    {item?.name}
                                                </Text>
                                                <Text style={[css.f12, css.greyC, css.fm]}>size: {item?.fileSizeFormat}</Text>
                                            </View>
                                            <View>
                                                <Pressable
                                                    onPress={() => removeImage(index)}
                                                    style={[styles.removeButton]}
                                                >
                                                    <FontAwesome5 name="times-circle" size={16} color='#d36565' />
                                                    <Text style={[css.cMaroon, css.f14, css.fm, css.marginL5]}>Remove</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>

                    </View>
                    <View>
                        <Text style={[css.spaceT5, css.blackC, css.f14, css.fm]}>Write instructions if any to be followed *</Text>
                        <View
                            style={[styles.textInputContainer]}>
                            <TextInput
                                style={[styles.textInput, css.fm, css.f14, css.padding10]}
                                editable
                                maxLength={400}
                                multiline
                                numberOfLines={4}
                                onChangeText={text => updateAdditionalData(text)}
                                value={value}
                                placeholder="Enter your instruction here."
                            />
                        </View>
                        {isError && <Text style={[css.spaceT5, css.errorText]}>Maximum 5 files only you can upload</Text>}
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row', flexWrap: 'wrap'
    },
    title: { ...css.f16, ...css.fsb, ...css.brandC },
    AdditionalText: {
        ...css.f16,
        ...css.fsb,
    },
    buttonContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        //padding: 15,
        marginTop: 10,
        width: '100%'
    },
    cameraButton: { ...css.width50, ...css.padding20 },
    removeButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end'
        // position: 'absolute', 
        // bottom: 5, right: 0 
    },
    textInputContainer: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 5,
        padding: 5,
        minHeight: 80,
    },
    textInput: { textAlignVertical: 'top' },
})