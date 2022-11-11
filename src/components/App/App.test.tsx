import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoItem from '../InfoItem';
import InfoBar from '../InfoBar';

test('renders InfoItem with describe', () => {
  render(
    <InfoItem
      data={{ name: '即時更新', type: '即', color: 'text-primary' }}
      showInfoBox
      haveDescribe
    />,
  );
  const type = screen.getAllByText(/即/i);
  expect(type[0]).toBeInTheDocument();
  expect(type[1]).toContainHTML('<div>即時更新</div>');
  expect(type[0]).toHaveClass('text-primary');
});

test('renders InfoItem without describe', () => {
  render(
    <InfoItem
      data={{ name: '即時更新', type: '即', color: 'text-primary' }}
      showInfoBox
      haveDescribe={false}
    />,
  );
  const type = screen.getByText(/即/i);
  expect(type).toBeInTheDocument();
  expect(type).toHaveClass('text-primary');
});

test('renders InfoBar one match', () => {
  render(
    <InfoBar
      parkingLot={{
        id: '001',
        area: '信義區',
        name: '府前廣場地下停車場',
        type: '1',
        type2: '2',
        summary: '為地下二層停車場，計有1998個小型車停車格，1337個機車停車位',
        address: '松壽路1號地下',
        tel: '27057716',
        payex:
          '小型車全日月票4200元，周邊里里民全日月票3360元，所在里里民全日月票2940元，夜間月票1000元(限周一至周五19-8，及周六、日與行政機關放假之紀念日、民俗日)，小型車計時30元(9-18)，夜間計時10元(18-9)；機車計時10元(當日當次上限20元)，機車月票300元。',
        serviceTime: '00:00:00~23:59:59',
        tw97x: '306812.928',
        tw97y: '2769892.95',
        totalcar: 1998,
        totalmotor: 1360,
        totalbike: 0,
        totalbus: 0,
        Pregnancy_First: '40',
        Handicap_First: '45',
        Taxi_OneHR_Free: '0',
        AED_Equipment: '0',
        CellSignal_Enhancement: '0',
        Accessibility_Elevator: '0',
        Phone_Charge: '0',
        Child_Pickup_Area: '0',
        FareInfo: {
          WorkingDay: [
            {
              Period: '00~09',
              Fare: '10',
            },
          ],
          Holiday: [
            {
              Period: '00~09',
              Fare: '10',
            },
          ],
        },
        EntranceCoord: {
          EntrancecoordInfo: [
            {
              Xcod: '25.03648987',
              Ycod: '121.5621068',
              Address: '基隆路一段',
            },
          ],
        },
      }}
    />,
  );
  const infoItem = screen.getAllByText(/地/i);
  expect(infoItem[0]).toBeInTheDocument();
});

test('renders InfoBar multiple conditions', () => {
  render(
    <InfoBar
      parkingLot={{
        id: '001',
        area: '信義區',
        name: '府前廣場地下停車場',
        type: '1',
        type2: '2',
        summary:
          '為地下二層停車場、及機械式立體停車場，計有1998個小型車停車格，1337個機車停車位',
        address: '松壽路1號地下',
        tel: '27057716',
        payex:
          '小型車全日月票4200元，周邊里里民全日月票3360元，所在里里民全日月票2940元，夜間月票1000元(限周一至周五19-8，及周六、日與行政機關放假之紀念日、民俗日)，小型車計時30元(9-18)，夜間計時10元(18-9)；機車計時10元(當日當次上限20元)，機車月票300元。',
        serviceTime: '00:00:00~23:59:59',
        tw97x: '306812.928',
        tw97y: '2769892.95',
        totalcar: 1998,
        totalmotor: 1360,
        totalbike: 0,
        totalbus: 0,
        Pregnancy_First: '40',
        Handicap_First: '45',
        Taxi_OneHR_Free: '0',
        AED_Equipment: '0',
        CellSignal_Enhancement: '0',
        Accessibility_Elevator: '0',
        Phone_Charge: '0',
        Child_Pickup_Area: '0',
        FareInfo: {
          WorkingDay: [
            {
              Period: '00~09',
              Fare: '10',
            },
          ],
          Holiday: [
            {
              Period: '00~09',
              Fare: '10',
            },
          ],
        },
        EntranceCoord: {
          EntrancecoordInfo: [
            {
              Xcod: '25.03648987',
              Ycod: '121.5621068',
              Address: '基隆路一段',
            },
          ],
        },
      }}
    />,
  );
  const infoItem1 = screen.getAllByText(/地/i);
  const infoItem2 = screen.getAllByText(/立/i);
  const infoItem3 = screen.getAllByText(/機/i);
  expect(infoItem1[0]).toBeInTheDocument();
  expect(infoItem2[0]).toBeInTheDocument();
  expect(infoItem3[0]).toBeInTheDocument();
});
