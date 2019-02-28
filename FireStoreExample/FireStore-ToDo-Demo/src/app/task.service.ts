import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Task } from "./Task";
import { config } from "./app.config";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: AngularFirestoreCollection<Task>;
  private taskDoc: AngularFirestoreDocument<Task>;
  collectionEndpoint: string = config.collection_endpoint;

  setCollection(endpoint: string) {
    this.collectionEndpoint = endpoint;
    this.tasks = this.db.collection<Task>(this.collectionEndpoint);
  }

  constructor(private db: AngularFirestore) {
    //Get the tasks collection
    this.tasks = db.collection<Task>(this.collectionEndpoint);
  }


  private queryDb(collection: string,
    fieldName: string,
    operator: firebase.firestore.WhereFilterOp,
    value: string) {
    const query = this.db.firestore.collection(collection).where(fieldName, operator, value);
    query.get().then(
      querySnapshot => {
        querySnapshot.docs.map(
          documentSnapshot => {
            const id = documentSnapshot.id;
            console.log({ id, ...documentSnapshot.data() });
          }
        )
      }
    );
  }

  printClientDoc(name: string) {
    this.queryDb("clients", "userName", "==", name);
  }

  printUserDoc(name: string) {
    this.queryDb("users", "name", "==", name);
  }

  addTask(task) {
    //Add the new task to the collection
    this.tasks.add(task);
  } //addTask

  updateTask(id, update) {
    //Get the task document
    this.taskDoc = this.db.doc<Task>(`${this.collectionEndpoint}/${id}`);
    console.warn(`trying to update doc at: ${this.collectionEndpoint}/${id}`);
    this.taskDoc.update(update);
  } //updateTask

  deleteTask(id) {
    //Get the task document
    this.taskDoc = this.db.doc<Task>(`${this.collectionEndpoint}/${id}`);
    //Delete the document
    this.taskDoc.delete();
  } //deleteTask
}
