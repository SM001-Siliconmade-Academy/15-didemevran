import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Formik } from "formik";
import MyTextInput from "../../components/MyTextInput";
import * as Yup from "yup";
import MySubmitButton from "../../components/MySubmitButton";
import { FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useFormik } from "formik";
import {
  useGetAllCitiesQuery,
  useGetDistrictsbyPlateQuery,
  useGetTownsbyPlateAndDistrictQuery,
} from "../../apis/adresApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import { useAddCustomerMutation } from "../../apis/customerApi";

const CustomerScreen = () => {
  const [selectedCityPlate, setSelectedCityPlate] = useState(7);
  const [selectedCityName, setSelectedCityName] = useState(7);
  const [selectedDistrict, setSelectedDistrict] = useState("KONYAALTI");
  const [selectedTown, setSelectedTown] = useState("");

  const { data: cities } = useGetAllCitiesQuery();
  const { data: districts } = useGetDistrictsbyPlateQuery(selectedCityPlate);
  
  const [ addCustomer ] = useAddCustomerMutation();
  const { data: towns } = useGetTownsbyPlateAndDistrictQuery({ plate: selectedCityPlate, district: selectedDistrict });
  //console.log("towns", JSON.stringify(towns, null, 2));

  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);
  const [cepTel, setCepTel] = useState();
  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [bankAgreementChecked, setBankAgreementChecked] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSelectCity = (value) => {
    setSelectedCityPlate(Number(value));
    const city = cities.find((city) => city.ID === value);
    setSelectedCityName(city.TEXT);
  };

  const handleSelectDistrict = (value) => {
    setSelectedDistrict(value);
  };

  const handleSelectTown = (value) => {
    setSelectedTown(value);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
  };

  if (Platform.OS === "android" && show) {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Müsteri Ol</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Sizi taniyabilmemiz icin lütfen
            <Text style={styles.boldTitle}> kimlik </Text>
            ve
            <Text style={styles.boldTitle}> telefon </Text>
            bilgilerinizi girin.
          </Text>
        </View>
        <View>
          <Formik
            initialValues={{
              tcKimlikNo: "",
              kimlikSeriNo: "",
              cepTelefonu: "",
            }}
            validationSchema={Yup.object({
              tcKimlikNo: Yup.string()
                .test(
                  "tcKimlikNo",
                  "Geçersiz TC Kimlik Numarası",
                  function (value) {
                    var tek = 0,
                      cift = 0,
                      sonuc = 0;

                    if (value.length !== 11) return false;
                    if (isNaN(Number(value))) return false;
                    if (value[0] === "0") return false;

                    tek =
                      parseInt(value[0]) +
                      parseInt(value[2]) +
                      parseInt(value[4]) +
                      parseInt(value[6]) +
                      parseInt(value[8]);
                    cift =
                      parseInt(value[1]) +
                      parseInt(value[3]) +
                      parseInt(value[5]) +
                      parseInt(value[7]);

                    tek = tek * 7;
                    sonuc = Math.abs(tek - cift);

                    return sonuc % 10 === parseInt(value[9]);
                  }
                )
                .required("Bu alan zorunludur"),
              kimlikSeriNo: Yup.string()
                .min(
                  9,
                  "Kimlik Seri No 9 haneli olmalidir."
                )
                .max(
                  9,
                  "Kimlik Seri No 9 haneli olmalidir."
                )
                .required("Bu alan zorunludur"),
              cepTelefonu: Yup.string()
                .required("Bu alan zorunludur")
                .matches(
                  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                  "Telefon Numarasi gecerli degil"
                )
                .min(10, "Cep telefonu 10 haneli olmalidir")
                .max(10, "Cep telefonu 10 haneli olmalidir"),
            })}
            onSubmit={ async (values) => {
              const today = new Date().getTime();
              if (date.getTime() > today) {
                alert("Girdiginiz dogum tarihi gelecekten bir tarih olamaz.");
              } else if (!kvkkChecked) {
                alert(
                  "Lütfen Kisisel Verilerin Korunmasi Kanunu Aydinlatma Metni'ni okuyup onaylayiniz"
                );
              } else if (!bankAgreementChecked) {
                alert("Lütfen Alternatif A.S'nin erisim onayini kabul ediniz");
              } else {

              await addCustomer({ values, date, selectedCityName, selectedDistrict, selectedTown, kvkkChecked, bankAgreementChecked })
                
                // addDoc(collection(db, "users"), {
                //   tcKimlikNo: values.tcKimlikNo,
                //   kimlikSeriNo: values.kimlikSeriNo,
                //   dogumTarihi: date.toLocaleDateString(),
                //   cepTel: values.cepTelefonu,
                //   city: selectedCityName,
                //   district: selectedDistrict,
                //   town: selectedTown,
                //   kvkkChecked: kvkkChecked,
                //   bankAgreementChecked: bankAgreementChecked,
                // }).then(() => {
                //   console.log("User added to firestore");
                // });

                alert("Merhaba, Bankamiza yapmis oldugunuz müsteri olma talebi basariyla gerceklesmistir. Tesekkür ederiz");
              }
            }}
          >
            {(formik) => (
              <View style={styles.inputsContainer}>
                {/* TC Kimlik No*/}
                <MyTextInput
                  label="T.C. Kimlik No"
                  name="tcKimlikNo"
                  placeholder="11111111111"
                  inputMode="text"
                  icon="user"
                />

                {/* Kimlik Seri No*/}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.label}>Kimlik Seri No</Text>
                  <TouchableOpacity onPress={handlePress} style={styles.icon}>
                    <FontAwesome
                      name="question-circle"
                      size={18}
                      color="#902049"
                    />
                  </TouchableOpacity>
                  <Modal isVisible={modalVisible}>
                    <View
                      style={{ flex: 1, justifyContent: "center", gap: 20 }}
                    >
                      <Text style={styles.modalText}>
                        Çipli kimliklerde seri numarası kartın ön yüzünde
                        bulunmaktadır. Eskiden fotoğrafın hemen altında olan
                        seri numarası, yeni kimliklerde fotoğrafın solunda yer
                        almaktadır.
                      </Text>
                      <Pressable style={styles.modalButton} onPress={handleClose}>
                        <Text style={{color: "white", fontWeight: "700", fontSize: 16}}>Kapat</Text>
                      </Pressable>
                    </View>
                  </Modal>
                </View>
                <View>
                  <TextInput
                    style={styles.textInput}
                    inputMode="text"
                    value={formik.values.kimlikSeriNo}
                    onChangeText={formik.handleChange("kimlikSeriNo")}
                    placeholder="AAAAAAAAA"
                  />
                  <View style={styles.iconInput}>
                    <FontAwesome name="id-card" size={22} color="black" />
                  </View>
                  {formik.touched.kimlikSeriNo &&
                    formik.errors.kimlikSeriNo && (
                      <Text style={styles.errorText}>
                        {formik.errors.kimlikSeriNo}
                      </Text>
                    )}
                </View>

                {/*  Dogum Tarihi */}
                <Text style={styles.label}>Dogum Tarihi</Text>
                <TouchableOpacity
                  style={styles.textInput}
                  onPress={() => setShow(!show)}
                >
                  {!show && <Text>{date.toLocaleDateString()}</Text>}
                  {show && Platform.OS === "ios" && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={"date"}
                      // @ts-ignore
                      is24Hour={true}
                      onChange={onChange}
                      style={styles.datepicker}
                      display="inline"
                    />
                  )}
                  <View style={styles.dateIconInput}>
                    <FontAwesome name="calendar-o" size={18} color="black" />
                  </View>
                </TouchableOpacity>

                {/*  Cep Telefonu No */}
                <Text style={styles.label}>Cep Telefonu No</Text>
                <View>
                  <TextInput
                    style={styles.textInput}
                    value={cepTel}
                    onChangeText={formik.handleChange("cepTelefonu")}
                    placeholder="55..."
                  />
                  <View style={styles.iconInput}>
                    <FontAwesome name="mobile-phone" size={22} color="black" />
                  </View>
                  {formik.touched.cepTelefonu && formik.errors.cepTelefonu && (
                    <Text style={styles.errorText}>
                      {formik.errors.cepTelefonu}
                    </Text>
                  )}
                </View>

                {/*  İl Seciniz */}
                <Text style={styles.label}>İl</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={selectedCityPlate}
                    onValueChange={(value) => handleSelectCity(value)}
                  >
                    <Picker.Item key={0} label="Seciniz" value="Seciniz" />
                    {cities &&
                      cities.map((city) => (
                        <Picker.Item
                          key={city.ID}
                          label={city.TEXT}
                          value={city.ID}
                        />
                      ))}
                  </Picker>
                  <View style={styles.iconInput}>
                    <FontAwesome name="map-o" size={22} color="black" />
                  </View>
                </View>

                {/*  İlce Seciniz */}
                <Text style={styles.label}>İlce</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={selectedDistrict}
                    onValueChange={(value) => handleSelectDistrict(value)}
                  >
                    <Picker.Item key={0} label="Seciniz" value="Seciniz" />
                    {districts &&
                      districts.map((d) => (
                        <Picker.Item
                          key={d.DISTRICT}
                          label={d.DISTRICT}
                          value={d.DISTRICT}
                        />
                      ))}
                  </Picker>
                  <View style={styles.iconInput}>
                    <FontAwesome name="map-marker" size={24} color="black" />
                  </View>
                </View>

                {/*  Mahalle Seciniz */}
                <Text style={styles.label}>İlce</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={selectedTown}
                    onValueChange={(value) => handleSelectTown(value)}
                  >
                    <Picker.Item key={0} label="Seciniz" value="Seciniz" />
                    {towns &&
                      towns.map((t) => (
                        <Picker.Item
                          key={t.TOWN}
                          label={t.TOWN}
                          value={t.TOWN}
                        />
                      ))}
                  </Picker>
                  <View style={styles.iconInput}>
                    <FontAwesome name="map-pin" size={24} color="black" />
                  </View>
                </View>

                {/*  Kisisel verileri koruma metni */}
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    style={styles.checkbox}
                    value={kvkkChecked}
                    onValueChange={setKvkkChecked}
                    color={kvkkChecked ? "#902049" : undefined}
                  />
                  <Text
                    style={[
                      { ...styles.description },
                      { fontSize: 13, textAlign: "left", width: "90%" },
                    ]}
                  >
                    Kisisel Verilerin Korunmasi Kanunu Aydinlatma Metni
                    <Text style={{ color: "#000" }}>
                      'ni okudum ve bilgilendirildim.
                    </Text>
                  </Text>
                </View>

                {/*  Banka Yönetmeligi */}
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    style={styles.checkbox}
                    value={bankAgreementChecked}
                    onValueChange={setBankAgreementChecked}
                    color={bankAgreementChecked ? "#902049" : undefined}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: "left",
                      width: "90%",
                      color: "#000",
                    }}
                  >
                    Alternatif Bank A.S.'nin ve/veya is ortaklarinin ürün,
                    hizmet ve kampanyalarini tanitmaya ve pazarlamaya yönelik
                    yazili, sesli ve görsel mesajlar ile bilgilendirilmeyi beyan
                    ve kabul ediyorum.
                  </Text>
                </View>

                <MySubmitButton title={"Devam Et"} />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerScreen;

const styles = StyleSheet.create({
  modalButton: {
    backgroundColor: "#902049",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    gap: 5,
  },
  checkbox: {
    marginTop: 3,
  },
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
  picker: {
    marginTop: 4,
    paddingLeft: 40,
    color: "black",
    borderWidth: 1,
    borderColor: "#A8A8A7",
  },
  titleContainer: {
    backgroundColor: "#902049",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 18,
  },
  descriptionContainer: {
    backgroundColor: "#F4F4F4",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  description: {
    color: "#902049",
    fontSize: 15,
    textAlign: "center",
  },
  boldTitle: {
    fontWeight: "800",
  },
  inputsContainer: {
    padding: 20,
  },
  icon: {
    alignSelf: "flex-end",
  },
  modalText: {
    color: "white",
    textAlign: "center",
    fontSize: 15
  },
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
  iconInput: {
    position: "absolute",
    top: 17,
    left: 12,
  },
  datepicker: {
    alignSelf: "flex-start",
  },
  dateIconInput: {
    position: "absolute",
    top: 7,
    left: 12,
  },
  errorText: {
    color: "#898989",
    fontSize: 12,
    marginTop: 4,
    position: "absolute",
    top: 3,
    right: 3,
    width: 130,
    textAlign: "right",
  },
});
