import React, {memo} from 'react';
import Button from '../../../components/Button/Button';
import Layout from '../../../components/Layout/Layout';
import { BUY, SELL } from '../../../configs/constant';
import colors from '../../../configs/styles/colors';
import BlockSwap from '../../SwapScreen/components/BlockSwap';

const arrMenu = [
  {
    name: 'Tất cả',
    id: '',
  },
  {
    name: 'Mua',
    id: BUY,
  },
  {
    name: 'Bán',
    id: SELL,
  },
];
const ButtonTop = ({onSelect, onChangeActive, activeMenu}) => {
  return (
    <Layout
      isSpaceBetween
      isLineCenter
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.app.lineSetting,
        paddingBottom: 10,
      }}>
      {arrMenu.map((_item, ind) => (
        <Button
          key={String(`key-menu-top-command-${ind}`)}
          title={_item?.name || ''}
          onPress={() => onChangeActive({..._item})}
          isNormal
          width={73}
          height={40}
          bgButtonColor={
            activeMenu == _item?.id
              ? colors.navigation
              : colors.app.bgTransparent
          }
          colorTitle={
            activeMenu == _item?.id
              ? colors.greyLight
              : colors.app.textContentLevel3
          }
          style={{borderRadius: 8}}
        />
      ))}

      <BlockSwap
        value={[]}
        onSelect={onSelect}
        hiddenTitle
        hiddenInpu
        // icon={icons.icMomo}
        textIcon="VND"
        colorIc={colors.greyLight}
        styleBlockLeft={{
          width: 100,
          height: 40,
          backgroundColor: colors.navigation,
          borderRadius: 8,
        }}
      />
    </Layout>
  );
};

export default memo(ButtonTop);
