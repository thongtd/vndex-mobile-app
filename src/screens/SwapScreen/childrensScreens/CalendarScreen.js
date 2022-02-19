import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import colors from '../../../configs/styles/colors';
import Layout from '../../../components/Layout/Layout';
import {fullHeight, get, emitEventEmitter, size} from '../../../configs/utils';
import Button from '../../../components/Button/Button';
import {setModalCalendar} from '../../../navigation/Navigation';
const CalendarScreen = ({
  date,
  currentDate,
  isModalCalendar,
  setModalCalendar,
}) => {
  const [ActiveDate, setActive] = useState({
    dateString: currentDate,
  });
  const markedDate = {};
  const handleDone = () => {
    emitEventEmitter(date, {
      api: `${ActiveDate.year}-${
        size(`${ActiveDate.month}`) == 1
          ? '0' + ActiveDate.month
          : ActiveDate.month
      }-${
        size(`${ActiveDate.day}`) == 1 ? `0${ActiveDate.day}` : ActiveDate.day
      }`,
      show: `${
        size(`${ActiveDate.day}`) == 1 ? `0${ActiveDate.day}` : ActiveDate.day
      }-${
        size(`${ActiveDate.month}`) == 1
          ? `0${ActiveDate.month}`
          : ActiveDate.month
      }-${ActiveDate.year}`,
    });

    setModalCalendar();
  };

  markedDate[ActiveDate.dateString] = {
    selected: true,
    selectedColor: colors.iconButton,
  };
  return (
    isModalCalendar && (
      <>
        <Layout
          onStartShouldSetResponder={() => setModalCalendar()}
          style={{
            height: fullHeight,
            backgroundColor: colors.transparent,
          }}
          type={'column'}></Layout>
        <View style={stylest.calendarContainer}>
          <Calendar
            hideDayNames={true}
            monthFormat={'MM/yyyy'}
            markedDates={markedDate}
            // onDayLongPress={(day) => { console.log('selected long day', day) }}
            onDayPress={day => {
              setActive(day);
              console.log('selected day', day);
            }}
          />
          <Layout
            space={20}
            style={{
              justifyContent: 'flex-end',
              paddingTop: 50,
            }}>
            <Button
              onTitle={() => setModalCalendar()}
              spaceHorizontal={10}
              size={16}
              isTitle
              title={'CLOSE'.t()}
              color={colors.subText}
            />
            <Button
              onTitle={handleDone}
              spaceHorizontal={10}
              size={16}
              isTitle
              title={'SUBMIT'.t()}
              color={colors.text}
            />
          </Layout>
        </View>
      </>
    )
  );
};
const stylest = StyleSheet.create({
  calendarContainer: {
    backgroundColor: colors.background,
    marginHorizontal: '5%',
    position: 'absolute',
    width: '90%',
    top: '30%',
  },
});
export default CalendarScreen;
