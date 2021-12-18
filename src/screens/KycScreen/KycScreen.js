import React, {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import Button from '../../components/Button/Button';
import Container from '../../components/Container';
import Input from '../../components/Input';
import ItemList from '../../components/Item/ItemList';
import {constant} from '../../configs/constant';
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
import moment from 'moment';
const KycScreen = ({componentId}) => {
  const UserInfo = useSelector(state => state.authentication.userInfo);
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
  const [birthDate, setBirthDate] = useState(new Date());
  // const [birthDate, setBirthDate] = useState("");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [identityCard, setIdentityCard] = useState('');
  const [sex, setSex] = useState({
    name: 'Male'.t(),
    value: '1',
  });
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
      return toast("Vui lòng nhập họ đệm của bạn");
    }else if(isEmpty(get(data,"firstName"))){
      return toast("Vui lòng nhập tên của bạn");
    }else if(isEmpty(get(data,"birthDate"))){
      return toast("Vui lòng nhập ngày sinh của bạn");
    }else if(isEmpty(get(data,"identityCard"))){
      return toast("Vui lòng nhập giấy CMTND/Hộ chiếu của bạn");
    }else if(isEmpty(get(data,"postalCode"))){
      return toast("Vui lòng nhập mã vùng của bạn");
    }else if(isEmpty(get(data,"city"))){
      return toast("Vui lòng nhập thành phố của bạn");
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
      // nameRight={"search"}
      // nameLeft={"bars"}
      // typeLeft={constant.TYPE_ICON.AntDesign}
      // sizeIconLeft={19}
      // onClickRight={() => alert("kaka")}
      // onClickLeft={() => alert("left")}
      componentId={componentId}
      hasBack>
      <Input
        isLabel
        value={lastName}
        onChangeText={text => setLastName(text)}
        label={'LastName'.t()}
      />
      <Input
        isLabel
        value={firstName}
        onChangeText={text => setFirstName(text)}
        label={'FirstName'.t()}
      />
      <Button
        isLabel
        label={'Date of birth'.t()}
        isPlaceholder={false}
        spaceVertical={10}
        onInput={() => setOpen(true)}
        isInput
        iconRight="caret-down"
        // iconLeft="globe-americas"
        placeholder={moment(birthDate).format('YYYY-MM-DD')}
      />
      <Button
        isLabel
        label={'Sex'.t()}
        isPlaceholder={false}
        spaceVertical={10}
        onInput={handleSelectSex}
        isInput
        iconRight="caret-down"
        // iconLeft="globe-americas"
        placeholder={get(sex, 'name')}
      />
      <Input
        isLabel
        value={identityCard}
        onChangeText={text => setIdentityCard(text)}
        label={'Citizen identification number'.t()}
      />
      <Input
        isLabel
        value={postalCode}
        onChangeText={text => setPostalCode(text)}
        label={'Area code'.t()}
      />
      <Input
        editable={false}
        isLabel
        label={'Country'.t()}
        hasValue
        value="Việt Nam"
      />
      {/* <Button
        isLabel
        label={'District'.t()}
        isPlaceholder={false}
        spaceVertical={10}
        onInput={handleSelectDistrict}
        isInput
        iconRight="caret-down"
        // iconLeft="globe-americas"
        placeholder={get(district, 'name')}
      /> */}
      <Input
        isLabel
        label={'City'.t()}
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
        spaceVertical={30}
      />
    </Container>
  );
};

export default KycScreen;
