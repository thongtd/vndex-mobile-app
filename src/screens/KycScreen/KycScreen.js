import React, {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import Button from '../../components/Button/Button';
import Container from '../../components/Container';
import Input from '../../components/Input';
import ItemList from '../../components/Item/ItemList';
import {constant} from '../../configs/constant';
import {dismissAllModal} from '../../navigation/Navigation';
import {PICKER_SEARCH, pushSingleScreenApp, STEP2KYC_SCREEN} from '../../navigation';
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
const KycScreen = ({componentId}) => {
  const Districts = [{name: 'Ha Noi'}, {name: 'Viet Nam'}];
  const Sexes = [{name: 'Female'.t()}, {name: 'Male'.t()}];
  // useSelector(state => state.authentication.countries);
  const [district, setDistrict] = useState({
    name: 'Viet Nam',
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date())
  const [sex, setSex] = useState({
    name: 'Male'.t(),
  });
  const handleActiveDistrict = districtActived => {
    setDistrict(districtActived);
    dismissAllModal();
  };
  const handleSelectDistrict = () => {
    let propsData = {
      data: Districts,
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActiveDistrict(item)}
            value={item.name}
            checked={item.name === district.name}
          />
        );
      },
      keywords: ['name'],
    };
    Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
  };
  const handleActiveSex = sex => {
    setSex(sex);
    dismissAllModal();
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
  console.log(date,"date");
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
      <Input isLabel label={'LastName'.t()} />
      <Input isLabel label={'FirstName'.t()} />
      <Button
        isLabel
        label={'Date of birth'.t()}
        isPlaceholder={false}
        spaceVertical={10}
        onInput={()=>setOpen(true)}
        isInput
        iconRight="caret-down"
        // iconLeft="globe-americas"
        placeholder={date.toDateString()}
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
      <Input isLabel label={'Citizen identification number'.t()} />
      <Input isLabel label={'Area code'.t()} />
      <Button
        isLabel
        label={'City'.t()}
        isPlaceholder={false}
        spaceVertical={10}
        onInput={handleSelectDistrict}
        isInput
        iconRight="caret-down"
        // iconLeft="globe-americas"
        placeholder={get(district, 'name')}
      />
      <Button
        isLabel
        label={'District'.t()}
        isPlaceholder={false}
        spaceVertical={10}
        onInput={handleSelectDistrict}
        isInput
        iconRight="caret-down"
        // iconLeft="globe-americas"
        placeholder={get(district, 'name')}
      />
      <DatePicker
        mode='date'
        modal
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <Button textSubmit={"NEXT".t()} textClose={"Cancel".t()} onSubmit={()=>pushSingleScreenApp(componentId,STEP2KYC_SCREEN)} isButtonCircle={false} isSubmit isClose spaceVertical={30} />
    </Container>
  );
};

export default KycScreen;
