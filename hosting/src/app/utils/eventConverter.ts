import { QuerySnapshot, DocumentData, DocumentSnapshot, DocumentChangeAction } from "@angular/fire/firestore/interfaces";

import { appEvent } from "./interfaces";

export function convertEventsFromDocuments(snapshot: QuerySnapshot<DocumentData[]>): appEvent[] {
  let data: any[] = snapshot.docs.map(doc => {
    let data: any = doc.data();
    data.id = doc.id;
    data.startDate = new Date(data.startDate.toDate());
    data.endDate = new Date(data.endDate.toDate());
    return data;
  });
  return data;
}

export function convertEventFromDocument(snapshot: DocumentSnapshot<DocumentData>): appEvent {
  let data = snapshot.data();
  data.id = snapshot.id;
  data.startDate = new Date(data.startDate.toDate());
  data.endDate = new Date(data.endDate.toDate());
  return data as appEvent;
}

export function convertEventFromChangeActions(snapshot: DocumentChangeAction<appEvent>[]): appEvent[] {
  return snapshot.map(action => {
    let data: any = action.payload.doc.data();
    data.id = action.payload.doc.id;
    data.startDate = new Date(data.startDate.toDate());
    data.endDate = new Date(data.endDate.toDate());
    return data;
  });
}
