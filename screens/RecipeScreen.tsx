import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SERVER_URL } from "../config";
import { RootStackParamList } from "../RootStackParamList";
import styles from "../styles";

type RecipeScreenProps = NativeStackScreenProps<RootStackParamList, "Recipe">;

const RecipeScreen = () => {
  const navigation = useNavigation<RecipeScreenProps>();
  const route = useRoute<RouteProp<RootStackParamList, "Recipe">>();

  const { ingredients } = route.params;

  type RecipeData = {
    name: string;
    img: string;
  };

  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // console.info(ingredients);

    axios
      .post(SERVER_URL + "/spoon", ingredients)
      .then((res) => {
        if (res.data.length) {
          let recipes_: RecipeData[] = [];
          res.data.map((x: string[]) => {
            recipes_.push({
              name: x[0],
              img: x[1],
            });
          });

          setRecipes(recipes_);
          // console.info(recipes_);
          setReady(true);
        }
      })
      .catch((err) => {
        Alert.alert("Error", "Network Error", [{ text: "OK" }]);
        return;
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Available Recipes</Text>
      {ready ? (
        <ScrollView style={styles.scrollContainer}>
          {recipes.map((x, i) => {
            return (
              <React.Fragment key={i}>
                <Image style={styles.image} source={{ uri: x.img }} />
                <Text>{x.name}</Text>
                <View style={styles.space} />
                <View style={styles.space} />
              </React.Fragment>
            );
          })}
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default RecipeScreen;
