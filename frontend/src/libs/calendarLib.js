import {
  get
} from "./http";

export function getMonthName(month) {
  switch (month) {
    case 0:
      return "Januar";
    case 1:
      return "Februar";
    case 2:
      return "März";
    case 3:
      return "April";
    case 4:
      return "Mai";
    case 5:
      return "Juni";
    case 6:
      return "Juli";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "Oktober";
    case 10:
      return "November";
    case 11:
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
    // hour has to be set to 0 - timezone offset, because otherwise wrong day would be used
    const startString = new Date(date.getFullYear(), date.getMonth(), 1, 0 - date.getTimezoneOffset() / 60).toISOString();
    const endString = new Date(date.getFullYear(), date.getMonth(), 0, 0 - date.getTimezoneOffset() / 60).toISOString();
    let uri = `/api/event?start=${startString}&end=${endString}`;
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
