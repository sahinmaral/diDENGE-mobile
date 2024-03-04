import React, { useState } from 'react';
import Container from "../../components/Container/Container";
import { ScrollView, TextInput,View,Text,Pressable } from "react-native";
import GoBackButton from "../../components/GoBackButton";
import { Formik } from "formik";
import DropdownComponent from './DropdownComponent';

function ContactForm({ navigation }) {
   

  const formInitialValues = {
    nameAndSurname: "",
    email: "",
  };
    
    return (

      <Container customClasses="px-2">
        <GoBackButton navigation={navigation} header="İletişime Geçin" />
             <View className="flex-[1]"></View>
             <Formik
        initialValues={formInitialValues}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View className="px-4 flex-[10]">
            <View className="gap-4 flex-[10]">
              <View className="gap-2">
                <TextInput
                  className="text-[16px] pt-2 pb-4 bg-gray-100 text-left pl-5"
                  placeholderTextColor="gray"
                  placeholder="Ad soyad"
                  onChangeText={handleChange("nameAndSurname")}
                  onBlur={handleBlur("nameAndSurname")}
                  value={values.nameAndSurname}
                />
                <TextInput
                  className="text-[16px] pt-2 pb-4 bg-gray-100 text-left pl-5"
                  placeholderTextColor="gray"
                  placeholder="E-posta adresi"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                <Text className="text-white text-[15px] font-light">Sorun Tipi</Text>
                <DropdownComponent />
                <TextInput
                  className="text-[16px] pt-2 pb-4 bg-gray-100 text-left pl-5 pt-10 h-60 "
                  placeholderTextColor="gray"
                  placeholder="İçerik"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </View>
             <View className="flex-[2]">
              <Pressable
                onPress={handleSubmit}
                className="items-center justify-center bg-saffronMango rounded-md h-[50px]"
              >
                <Text className="text-white text-[22px] font-light">
                  Gönder
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
              </Container>
    );
  }
  
  export default ContactForm;