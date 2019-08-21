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
    let uri = `/api/event?start=${date.year}-${date.month}-1&end=${date.year}-${date.month}-${new Date(date.year, date.month, 0).getDate()}`;
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
