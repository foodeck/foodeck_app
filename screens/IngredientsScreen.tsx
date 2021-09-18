import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SERVER_URL } from "../config";
import { RootStackParamList } from "../RootStackParamList";
import styles from "../styles";

type IngredientScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Ingredients"
>;

const IngredientsScreen: React.FC<IngredientScreenProps> = ({
  navigation,
  route,
}) => {
  const { images } = route.params;

  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [ingredientNames, setIngredientNames] = useState<string[][]>([]);

  const [confirmIngredientNames, setConfirmIngredientNames] = useState<
    string[]
  >([]);

  // fetch props
  useEffect(() => {
    const formData = new FormData();

    images.forEach((x, i) => {
      formData.append(`image${i}`, {
        uri: x.uri,
        name: x.fileName,
        type: "image/*",
      });
    });

    axios({
      method: "post",
      url: SERVER_URL + "/upload/",
      data: formData,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "multipart/form-data",
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    })
      .then((res) => {
        const { result } = res.data;
        if (result) {
          // console.info(result);
          let ingredientNames_: string[][] = [];

          result.forEach((x: any[], i: number) => {
            if (x.length) {
              let ingredientNames__: string[] = [];

              x.forEach((y) => {
                ingredientNames__.push(y.description);
              });

              ingredientNames_.push(ingredientNames__);
            } else {
              ingredientNames_.push([]);
            }
          });

          setIngredientNames(ingredientNames_);
          setReady(true);
        }
      })
      .catch((err) => {
        Alert.alert("Error", "Network Error", [{ text: "OK" }]);
        return;
      });
  }, []);

  const handleNext = () => {
    if (confirmIngredientNames[index] === "") {
      Alert.alert("Error", "Ingredient name must not be empty", [
        { text: "OK" },
      ]);
      return;
    }

    if (index + 1 >= images.length) {
      navigation.navigate("Recipe", {
        ingredients: [...new Set(confirmIngredientNames)],
      });

      // console.info([...new Set(confirmIngredientNames)]);
    } else {
      setIndex(index + 1);
    }
  };

  const handleSelect = (option: number) => {
    let confirmIngredientNames_ = confirmIngredientNames.slice();
    confirmIngredientNames_[index] = ingredientNames[index][option];
    setConfirmIngredientNames(confirmIngredientNames_);

    handleNext();
  };

  return (
    <View style={styles.container}>
      <Text>Confirm the ingredients</Text>

      {ready ? (
        <ScrollView style={styles.scrollContainer}>
          <Image source={{ uri: images[index].uri }} style={styles.image} />
          {ingredientNames[index].length > 0 ? (
            <React.Fragment>
              <Text>
                Select the word that best matches the ingredient in the image:
              </Text>

              {ingredientNames[index].map((x, i) => {
                return (
                  <Button
                    key={i}
                    title={x}
                    onPress={() => {
                      handleSelect(i);
                    }}
                  />
                );
              })}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Text>
                Unfortunatly we were not able to recongnize the ingredient in
                the picture, please enter it manually below:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ingredient Name"
                value={confirmIngredientNames[index]}
                onChangeText={(text) => {
                  let confirmIngredientNames_ = confirmIngredientNames.slice();
                  confirmIngredientNames_[index] = text;
                  setConfirmIngredientNames(confirmIngredientNames_);
                }}
              />

              <Button title="Next" onPress={handleNext} />
            </React.Fragment>
          )}
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default IngredientsScreen;
