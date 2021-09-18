import { useNavigation } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Alert, Button, Image, ScrollView, Text, View } from "react-native";
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import { RootStackParamList } from "../RootStackParamList";
import styles from "../styles";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [imgList, setImgList] = useState<Asset[]>([]);

  const refRBSheet = useRef<RBSheet>(null);

  const handleAnalyze = () => {
    if (imgList.length === 0) {
      Alert.alert("Error", "Please add at least one image", [{ text: "OK" }]);
      return;
    }

    navigation.navigate("Ingredients", { images: imgList });
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: "photo", cameraType: "back" }, (res) => {
      if (res.didCancel) {
        return;
      }

      const { assets } = res;
      if (assets) {
        setImgList(imgList.concat(assets));
      }

      if (refRBSheet.current) refRBSheet.current.close();
    });
  };

  const handleUseExisting = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res.didCancel) {
        return;
      }

      const { assets } = res;
      if (assets) {
        setImgList(imgList.concat(assets));
      }
      if (refRBSheet.current) refRBSheet.current.close();
    });
  };

  return (
    <View style={styles.container}>
      <Text>Add some images to get started:</Text>
      {/* <Text>Num image: {imgList.length}</Text> */}
      <ScrollView style={styles.scrollContainer}>
        {imgList.map((img, i) => {
          return (
            <Image key={i} style={styles.image} source={{ uri: img.uri }} />
          );
        })}
      </ScrollView>

      <Button
        title="Add Image"
        onPress={() => {
          if (refRBSheet.current) refRBSheet.current.open();
        }}
      />

      <Button
        title="Reset"
        onPress={() => {
          setImgList([]);
        }}
      />

      <Button title="Find Recipes" onPress={handleAnalyze} />
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={160}
      >
        <Button title="Take a Photo" onPress={handleTakePhoto} />
        <Button title="Use Existing Photo" onPress={handleUseExisting} />
      </RBSheet>
    </View>
  );
};

export default HomeScreen;
