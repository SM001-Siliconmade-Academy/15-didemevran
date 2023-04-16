import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useFormikContext } from "formik";

const MySubmitButton = ({ title }) => {
  const { handleSubmit } = useFormikContext();
  return (
    <Pressable style={styles.pressable} 
// @ts-ignore
    onPress={handleSubmit}>
      <Text style={styles.pressableText}>{title}</Text>
    </Pressable>
  );
};

export default MySubmitButton;

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: "#902049",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 20,
    marginTop: 20,
    alignItems: "center",
  },
  pressableText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
