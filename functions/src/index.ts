import * as admin from 'firebase-admin';
admin.initializeApp();

export * from './image-storage-management/generate-convert-image';
export * from './image-storage-management/storage-cleanup';

export * from './aggregation-denormalization/persons';
export * from './aggregation-denormalization/articles';
export * from './aggregation-denormalization/images';
export * from './aggregation-denormalization/events';
export * from './aggregation-denormalization/meta-tags';

export * from './rest-endpoints/event-responder';
export * from './rest-endpoints/change-seen-marker';
export * from './rest-endpoints/confirm-person';
export * from './rest-endpoints/delete-person';
export * from './rest-endpoints/update-person-name';
export * from './rest-endpoints/edit-groups';
export * from './rest-endpoints/send-contact-mail';
