import {
  includes,
  filter,
  get,
  find,
  isEmpty,
  intersectionWith,
  toLower,
  isEqual,
} from 'lodash';

function getClanType(type) {
  if (type === 'Tzimisce - Carpathian') {
    return 'Tzimisce - Carpathians';
  }
  if (type === 'Ventrue - Crusader') {
    return 'Ventrue - Crusaders';
  }
  if (type === 'Cappadocian - Lamia') {
    return 'Cappadocians - Lamia';
  }
  if (type === 'Cappadocian - Samedi') {
    return 'Cappadocians - Samedi';
  }
  if (type === 'Assamite - Sorcerer') {
    return 'Assamite Sorcerer';
  }
  if (type === 'Assamite - Vizier') {
    return 'Assamite Vizier';
  }
  return type;
}

function compareFunc(a, b) {
  if (isEqual(get(a, 'merit'), get(b, 'fields.merit'))) {
    return b;
  }
  return false;
}

const handleClanFilter = (disc, filterClanItems, clansDataWithMerits) => {
  if (disc && disc !== 'filter by Clan') {
    if (
      includes(
        ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
        disc,
      )
    ) {
      return filter(filterClanItems, o =>
        includes(get(o, 'meritType[0]'), disc),
      );
    }
    if (
      !includes(
        ['Anarch', 'Camarilla', 'Clan', 'General', 'Sabbat', 'Morality'],
        disc,
      )
    ) {
      let clanItems = [];
      const filterItems = find(
        clansDataWithMerits,
        o => o.title === getClanType(disc),
      );

      if (!isEmpty(filterItems)) {
        clanItems = filter(filterClanItems, o => {
          let discName = disc;
          if (disc.includes(':')) {
            discName = disc.replace(' : ', ' ');
          }
          if (disc.includes('-')) {
            discName = disc.replace(' - ', ' ');
          }

          const brand = toLower(get(o, 'clanSpecific[0]'));

          let brandName = brand;
          if (brand.includes(':')) {
            brandName = brand.replace(': ', ' ');
          }
          if (brand.includes('-')) {
            brandName = brand.replace(' - ', ' ');
          }

          const updatedKey = toLower(discName);
          return brandName.indexOf(updatedKey) > -1;
        });
      } else {
        const filterItems1 = find(
          filterClanItems,
          o => o.title === getClanType(disc),
        );

        if (!isEmpty(filterItems1)) {
          console.log('===========2');
          clanItems = intersectionWith(
            filterClanItems,
            filterItems.inClanMerits,
            compareFunc,
          );
        } else {
          console.log('===========3');
          clanItems = filter(filterClanItems, o => {
            const brand = toLower(get(o, 'clanSpecific[0]'));
            const updatedKey = toLower(disc);
            return brand.indexOf(updatedKey) > -1;
          });
        }
      }
      return clanItems;
    }
  }
};

export default handleClanFilter;
