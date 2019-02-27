
//Project based off of demo app at https://medium.com/@coderonfleek/firebase-firestore-and-angular-todo-list-application-d0fe760f6bca
//The Firestore setup for angular is taken from https://github.com/angular/angularfire2

import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
import { config } from "./app.config";
import { TaskService } from './app.service';
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
  tasks: Observable<any[]>;
  myTask: string;
  editMode: boolean = false;
  taskToEdit: any = {};

  constructor(private db: AngularFirestore, private taskService: TaskService) {


    // this.tasks = db.collection<Task>('tasks');
    // this.items = db.collection('tasks').snapshotChanges();
    // this.items.forEach((next: DocumentChangeAction[]) => {
    //   console.log(next.payload.doc.data());
    // })
  }

  ngOnInit() {
    // this.tasks = this.db.collection(config.collection_endpoint).valueChanges();
    this.tasks = this.db
      .collection(config.collection_endpoint)
      .snapshotChanges()
      .pipe(
        map(
          actions => {
            return actions.map(a => {
              //Get document data
              const data: Task = a.payload.doc.data() as Task;
              //Get document id
              const id: string = a.payload.doc.id;

              console.warn({ id, ...data });
              //Use spread operator to add the id to the document data
              return { id, ...data };
            });
          }));
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
        let taskId = this.taskToEdit.id;
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
    let taskId = task.id;
    //delete the task
    this.taskService.deleteTask(taskId);
  } //deleteTask

}

