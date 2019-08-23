import {
  get
} from "./http";

export function getMonthName(month) {
  switch (month) {
    case 1:
      return "Januar";
    case 2:
      return "Februar";
    case 3:
      return "März";
    case 4:
      return "April";
    case 5:
      return "Mai";
    case 6:
      return "Juni";
    case 7:
      return "Juli";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "Oktober";
    case 11:
      return "November";
    case 12:
      return "Dezember";
  }
}

//  days have to be mapped like that because sunday is day with index 0 normally
export function makeMondayFirst(day) {
  if (day > 0) {
    day--;
    return day;
  } else {
    return 6;
  }
}

export function getEvents(date) {
  return new Promise((resolve, reject) => {
    let uri = `/api/event?start=${toDBDateString({year: date.year, month: date.month, day: 1})}&end=${toDBDateString({year: date.year, month: date.month, day: new Date(date.year, date.month, 0).getDate()})}`;
    get(uri).then(res => {
      const result = JSON.parse(res);
      if (result.length > 0) {
        resolve(result);
      } else {
        reject("alarm");
        return;
      }
    }).catch(err => {
      reject(err);
    });
  });
}

export function toDBDateString(date) {
  let m = date.month > 9 ? date.month : '0' + date.month;
  let d = date.day > 9 ? date.day : '0' + date.day;
  return `${date.year}${m}${d}`;
}

export function fromDBDateString(datenum) {
  let dateString = datenum.toString();
  let year = parseInt(dateString.slice(0, 4));
  let month = parseInt(dateString.slice(4, 6));
  let day = parseInt(dateString.slice(6, 8));
  let date = {
    year: year,
    month: month,
    day: day
  };
  return date;

}
