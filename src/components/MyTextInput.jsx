// @ts-nocheck
import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { useField, useFormikContext } from "formik";
import { FontAwesome } from "@expo/vector-icons";

const MyTextInput = (props) => {
  const [inputProps, metaProps, helperProps] = useField(props);
  const { handleBlur, handleChange } = useFormikContext();

  return (
    <>
      <Text style={styles.label}>{props.label}</Text>
      <View>
        <TextInput
          style={styles.textInput}
          inputMode={props.inputMode}
          value={inputProps.value}
          onChangeText={handleChange(props.name)}
          onBlur={handleBlur(props.name)}
          placeholder={props.placeholder}
        />
        <View style={styles.icon}>
          <FontAwesome name={props.icon} size={18} color="black" />
        </View>
        {metaProps.touched && metaProps.error ? (
          <Text style={styles.errorText}>{metaProps.error}</Text>
        ) : null}
      </View>
    </>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  label: {
    marginTop: 6,
    color: "black",
    fontWeight: "bold",
  },
  textInput: {
    marginTop: 4,
    paddingVertical: 8,
    paddingLeft: 40,
    fontSize: 14,
    color: "black",
    borderWidth: 1,
    borderColor: "#A8A8A7",
  },
  errorText: {
    color: "#898989",
    fontSize: 12,
    marginTop: 4,
    position: "absolute",
    top: 3,
    right: 3,
    width: 130,
    textAlign: "right"
  },
  icon: {
    position: "absolute",
    top: 17,
    left: 12,
  },
});
