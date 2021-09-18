import { Asset } from "react-native-image-picker";

export type RootStackParamList = {
  Home: undefined;
  Recipe: {
    ingredients: string[];
  };

  Ingredients: {
    images: Asset[];
  };
};
