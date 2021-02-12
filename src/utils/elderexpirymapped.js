import { map, get, filter, toLower } from 'lodash';
import moment from 'moment';

const mappedElderData = data =>
  map(data, item => {
    const mappedItem = {
      ...item,
      customer_id: get(item, 'zoho_object[0].Customer_ID', 'N/A'),
      contact_number: `${get(item, 'country_code', 'N/A')}-${get(get(item, 'mobile_number', 'N/A'))}`,
      full_address: get(item, 'full_address') && !isEmpty('elder.full_address') ? get(item, 'full_address') : 'N/A',
      erm_name: get(
        item,
        'adminData.admin_user.first_name',
        'not assigned',
      ),
      plan_name: get(item, 'plan.name', 'N/A'),
      plan_status: get(item, 'plan_status', 'N/A'),
      full_name: `${item.first_name ? item.first_name : ''}${' '}${item.last_name? item.last_name: ''}`,
      how_old_user: moment().diff(moment(item.created_at), 'days'),
    };
    return mappedItem;
  });

const mappedMyElders = (data, user) => {
  const mappedErm = filter(data, item => toLower(get(item, 'superviser[0].first_name')) === toLower(user.first_name));
  return mappedErm;
}

export default mappedElderData;
export  {
  mappedMyElders
};
