import React from 'react';
import {Text, View} from 'react-native';
import Layout from '../../../components/Layout/Layout';
import ItemChildrenFilter from './ItemChildrenFilter';
import Button from '../../../components/Button/Button';

const ItemFilter = ({
  iconFirst,
  LabelFirst,
  LabelSecond,
  iconSecond,
  placeholderFirst,
  placeholderSecond,
  onPressFirst,
  onPressSecond,
  valueFirst,
  valueSecond,
  buttonRight,
  onSubmit,
  isColumn,
  hiddenFirst
}) => {
  return (
    <Layout
      isRightColumn
      type={isColumn ? 'column' : 'row'}
      isSpaceBetween
      >
      {isColumn ? (
        <>
        {!hiddenFirst &&  <ItemChildrenFilter
            isValue={valueFirst ? true : false}
            icon={iconFirst}
            placeholder={valueFirst ? valueFirst : placeholderFirst}
            onPress={onPressFirst}
            isColumn
            label={LabelFirst}
          />}
         
          <ItemChildrenFilter
          isColumn
          label={LabelSecond}
            isSubmit={buttonRight ? true : false}
            isValue={valueSecond ? true : false}
            icon={iconSecond}
            placeholder={valueSecond ? valueSecond : placeholderSecond}
            onPress={onPressSecond}
          />
        </>
      ) : (
        <>
          <ItemChildrenFilter
            label={LabelFirst}
            isValue={valueFirst ? true : false}
            icon={iconFirst}
            placeholder={valueFirst ? valueFirst : placeholderFirst}
            onPress={onPressFirst}
          />
          <ItemChildrenFilter
             label={LabelSecond}
            isSubmit={buttonRight ? true : false}
            isValue={valueSecond ? true : false}
            icon={iconSecond}
            placeholder={valueSecond ? valueSecond : placeholderSecond}
            onPress={onPressSecond}
          />
        </>
      )}
    </Layout>
  );
};

export default ItemFilter;
