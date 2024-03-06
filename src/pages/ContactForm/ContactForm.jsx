import React, { useState } from 'react';
import Container from "../../components/Container/Container";
import { ScrollView, TextInput,View,Text,Pressable } from "react-native";
import GoBackButton from "../../components/GoBackButton";
import DropdownComponent from './DropdownComponent';

function ContactForm({ navigation }) {
   
    
    return (

      <Container customClasses="px-4">
        <GoBackButton navigation={navigation} header="İletişime Geçin" />
             <View className="flex-[1]"></View>
          <View className="px-4 flex-[10]">
            <View className="gap-y-4">
              <View className="gap-2">
                <TextInput
                  className="text-[16px] py-2 bg-gray-100 text-left pl-5"
                  placeholderTextColor="gray"
                  placeholder="Ad soyad"
                />
                <TextInput
                  className="text-[16px]  py-2 bg-gray-100 text-left pl-5"
                  placeholderTextColor="gray"
                  placeholder="E-posta adresi"
                />
                <Text className="text-white text-[15px] font-medium">Sorun Tipi</Text>
                <DropdownComponent />
                <TextInput
                  className="text-[16px] py-2 bg-gray-100 text-left pl-5 h-60 "
                  placeholderTextColor="gray"
                  placeholder="İçerik"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </View>
             <View className="flex-[2] py-2">
              <Pressable
                className="items-center justify-center bg-saffronMango rounded-md h-[50px]"
              >
                <Text className="text-white text-[22px] font-medium">
                  Gönder
                </Text>
              </Pressable>
            </View>
          </View>

              </Container>
    );
  }
  
  export default ContactForm;