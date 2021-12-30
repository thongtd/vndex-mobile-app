import React, {useState, useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import Button from '../../components/Button/Button';
import Container from '../../components/Container';
import Input from '../../components/Input';
import ItemList from '../../components/Item/ItemList';
import {constant, fontSize, spacingApp} from '../../configs/constant';
import {dismissAllModal} from '../../navigation/Navigation';
import {isEmpty} from "lodash";
import {
  PICKER_SEARCH,
  pushSingleScreenApp,
  STEP2KYC_SCREEN,
} from '../../navigation';
import {
  hiddenModal,
  createAction,
  get,
  toast,
  validateEmail,
  size,
} from '../../configs/utils';
import {Navigation} from 'react-native-navigation';
import DatePicker from 'react-native-date-picker';
import {authService} from '../../services/authentication.service';
import moment from 'moment';
import { useActionsAuthen } from '../../redux/modules/authentication';
import colors from '../../configs/styles/colors';
import StepIndicator from "react-native-step-indicator";
import Layout from '../../components/Layout/Layout';
import TextFnx from '../../components/Text/TextFnx';
const KycScreen = ({componentId}) => {
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const userKyc = useSelector(state => state.authentication.userKyc);
  // const Districts = [{name: 'Ha Noi'}, {name: 'Viet Nam'}];
  const Sexes = [
    {name: 'Female'.t(), value: '0'},
    {name: 'Male'.t(), value: '1'},
  ];
  // useSelector(state => state.authentication.countries);
  // const [district, setDistrict] = useState({
  //   name: 'Viet Nam',
  // });
  const [open, setOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date(get(userKyc,"birthDate")));
  // const [birthDate, setBirthDate] = useState("");
  const [firstName, setFirstName] = useState(get(userKyc,"firstName") || "");
  const [lastName, setLastName] = useState(get(userKyc,"lastName") || "");
  const [city, setCity] = useState(get(userKyc,"city") || "");
  const [postalCode, setPostalCode] = useState(get(userKyc,"postalCode") || "");
  const [identityCard, setIdentityCard] = useState(get(userKyc,"identityCard") || "");
  const [sex, setSex] = useState(get(userKyc,"sex")== 1?{
    name: 'Male'.t(),
    value: '1',
  }:{
    name: 'Female'.t(),
    value: '0',
  } );
  // const handleActiveDistrict = districtActived => {
  //   setDistrict(districtActived);
  //   dismissAllModal();
  // };
  // const handleSelectDistrict = () => {
  //   let propsData = {
  //     data: Districts,
  //     renderItem: ({item, key}) => {
  //       return (
  //         <ItemList
  //           onPress={() => handleActiveDistrict(item)}
  //           value={item.value}
  //           checked={item.name === district.name}
  //         />
  //       );
  //     },
  //     keywords: ['name'],
  //   };
  //   Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
  // };
  const handleActiveSex = sex => {
    setSex(sex);
    dismissAllModal();
  };
  const handleNext = (data) => {
    console.log(get(data,"sex"),"bir");
    if(isEmpty(get(data,"lastName"))){
      return toast("Please enter".t().replace("{0}",'LastName'.t()));
    }else if(isEmpty(get(data,"firstName"))){
      return toast("Please enter".t().replace("{0}",'FirstName'.t()));
    }else if(isEmpty(get(data,"birthDate"))){
      return toast("Please enter".t().replace("{0}",'Date of birth'.t()));
    }else if(isEmpty(get(data,"identityCard"))){
      return toast("Please enter".t().replace("{0}",'Citizen identification number'.t()));
    }else if(isEmpty(get(data,"postalCode"))){
      return toast("Please enter".t().replace("{0}",'Area code'.t()));
    }else if(isEmpty(get(data,"city"))){
      return toast("Please enter".t().replace("{0}",'City'.t()));
    }else{
      return pushSingleScreenApp(componentId, STEP2KYC_SCREEN, {...data})
    }
    
  };
  
  const handleSelectSex = () => {
    let propsData = {
      data: Sexes,
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActiveSex(item)}
            value={item.name}
            checked={item.name === sex.name}
          />
        );
      },
      keywords: ['name'],
    };
    Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
  };
  // console.log(date,"date");
  return (
    <Container
      title={'Personal Information'.t()}
      isScroll={true}
      componentId={componentId}
      hasBack
      space={20}
      spaceHorizontal={0}
      >
        <View style={{
          marginBottom:20
        }} >
          <TextFnx size={fontSize.f16} weight='bold' spaceBottom={20} spaceLeft={spacingApp} color={colors.app.yellowHightlight}>
          {'Personal Information'.t()}
          </TextFnx>
        <StepIndicator 
        customStyles={customStyles}
        currentPosition={0}
        stepCount={3}
        />
        </View>
        
      <View  style={{
        backgroundColor:colors.app.backgroundLevel2,
        paddingHorizontal:spacingApp,
        paddingTop:20,
        borderTopLeftRadius:20,
        borderTopRightRadius:20
      }}>
      <Input
        spaceVertical={10}
        value={lastName}
        onChangeText={text => setLastName(text)}
        placeholder={'LastName'.t()}
      />
      <Input
        spaceVertical={10}
        value={firstName}
        onChangeText={text => setFirstName(text)}
        placeholder={'FirstName'.t()}
      />
      <Button
        
        placeholder={'Date of birth'.t()}
        isPlaceholder={false}
        spaceVertical={10}
        onInput={() => setOpen(true)}
        isInput
        iconRight="caret-down"
        // iconLeft="globe-americas"
        placeholder={moment(birthDate).format('YYYY-MM-DD')}
      />
      <Button
        isPlaceholder={false}
        spaceVertical={10}
        onInput={handleSelectSex}
        isInput
        iconRight="caret-down"
        // iconLeft="globe-americas"
        placeholder={get(sex, 'name')}
      />
      <Input
        spaceVertical={10}
        value={identityCard}
        onChangeText={text => setIdentityCard(text)}
        placeholder={'Citizen identification number'.t()}
      />
      <Input
        spaceVertical={10}
        value={postalCode}
        onChangeText={text => setPostalCode(text)}
        placeholder={'Area code'.t()}
      />
      <Input
        editable={false}
        spaceVertical={10}
        placeholder={'Country'.t()}
        hasValue
        value="Việt Nam"
      />
      <Input
        spaceVertical={10}
        placeholder={'City'.t()}
        value={city}
        onChangeText={text => setCity(text)}
      />

      <DatePicker
        mode="date"
        modal
        open={open}
        date={birthDate}
        onConfirm={date => {
          setOpen(false);
          setBirthDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <Button
        textSubmit={'NEXT'.t()}
        textClose={'Cancel'.t()}
        onSubmit={() =>
          handleNext({
            birthDate:moment(birthDate).format('YYYY-MM-DD'),
            city,
            countryCode:"VN",
            firstName,
            lastName,
            identityCard,
            postalCode,
            sex:get(sex, 'value'),
            identityUserId: get(UserInfo, 'id'),
          })
        }
        isButtonCircle={false}
        isSubmit
        isClose
        spaceVertical={10}
      />
      </View>
    </Container>
  );
};
const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: colors.app.yellowHightlight,
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: colors.app.yellowHightlight,
  stepStrokeUnFinishedColor: colors.app.backgroundLevel2,
  separatorFinishedColor: colors.app.yellowHightlight,
  separatorUnFinishedColor: colors.app.backgroundLevel2,
  stepIndicatorFinishedColor: colors.app.yellowHightlight,
  stepIndicatorUnFinishedColor: colors.app.backgroundLevel2,
  stepIndicatorCurrentColor: colors.app.backgroundLevel2,
  stepIndicatorLabelFontSize: 14,
  stepIndicatorLabelCurrentColor:colors.app.yellowHightlight,
  currentStepIndicatorLabelFontSize: 14,
}
export default KycScreen;
