import moment from 'moment';

export function ageCalculation(date) {
  if (date === '' || !moment(date).isValid()) return '';

  const yearsDiff = moment().diff(moment(date), 'years');

  if (yearsDiff < 65) return 'under_65';
  else if (yearsDiff >= 65 && yearsDiff <= 74) return 'young_old';
  else if (yearsDiff >= 75 && yearsDiff <= 85) return 'middle_old';
  else return 'old_old';
};
