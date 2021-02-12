import { map, orderBy } from 'lodash';
import moment from 'moment';

const planTableMappedData = data => {
  const mappedData = map(data, item => {
    const elderDataMapped = {
      days_left: moment(item.expiry_date).diff(moment(), 'days'),
      ...item,
    };
    return elderDataMapped;
  });
  const orderByData = orderBy(mappedData, ['days_left'], ['asc']);
  return orderByData;
};

export default planTableMappedData;
