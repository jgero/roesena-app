import * as admin from "firebase-admin";
admin.initializeApp();

export * from "./image-storage-management/image-editing";
export * from "./image-storage-management/storage-cleanup";

export * from "./aggregation-denormalization/persons";
export * from "./aggregation-denormalization/articles";
export * from "./aggregation-denormalization/images";

export * from "./rest-endpoints/event-responder";
