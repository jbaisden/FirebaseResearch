
//Project based off of demo app at https://medium.com/@coderonfleek/firebase-firestore-and-angular-todo-list-application-d0fe760f6bca
//The Firestore setup for angular is taken from https://github.com/angular/angularfire2

import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
import { config } from "./app.config";
import { TaskService } from './task.service';
import { Task } from './Task';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { database } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  // tasks: Observable<Task[]>;
  tasks: Observable<Task[]>;
  myTask: string;
  editMode: boolean = false;
  taskToEdit: Task;

  constructor(private db: AngularFirestore, private taskService: TaskService) {
    // this.taskService.setCollection('/users/SSoas1zyj4kKckq2YODh/tasks');

    // this.tasks = db.collection<Task>('tasks').snapshotChanges();
    // this.items = db.collection('tasks').snapshotChanges();
    // this.items.forEach((next: DocumentChangeAction[]) => {
    //   console.log(next.payload.doc.data());
    // })
  }

  ngOnInit() {
    // this.tasks = this.db.collection(config.collection_endpoint).valueChanges();
    this.tasks = this.db
      .collection(this.taskService.collectionEndpoint)
      // .collection(config.collection_endpoint)
      .snapshotChanges()
      .pipe(
        map(
          actions => {
            return actions.map(a => {
              //Get document data
              const data: Task = a.payload.doc.data() as Task;
              data.docId = a.payload.doc.id;
              //Get document id
              // const id: string = a.payload.doc.id;
              console.warn(data);
              //Use spread operator to add the id to the document data
              // return { id, ...data };
              return data;
            });
          }));
  }

  printClient() {
    console.log("printClient() called.");
    this.taskService.printClientDoc("jason");
  }

  printUser() {
    console.log("printUser() called.");
    this.taskService.printUserDoc("jason");
  }

  edit(task) {
    console.log(task);
    //Set taskToEdit and editMode
    this.taskToEdit = task;
    this.editMode = true;
    //Set form value
    this.myTask = task.description;
  } //edit

  saveTask() {
    if (this.myTask !== null) {
      //Get the input value
      let task = {
        description: this.myTask
      };
      if (!this.editMode) {
        console.log(task);
        this.taskService.addTask(task);
      } else {
        //Get the task id
        let taskId = this.taskToEdit.docId;
        //update the task
        this.taskService.updateTask(taskId, task);
      }
      //set edit mode to false and clear form
      this.editMode = false;
      this.myTask = "";
    }
  } //saveTask

  deleteTask(task) {
    //Get the task id
    let taskId = task.docId;
    //delete the task
    this.taskService.deleteTask(taskId);
  } //deleteTask

}

