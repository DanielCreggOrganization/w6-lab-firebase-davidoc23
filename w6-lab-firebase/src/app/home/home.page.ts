// src/app/home/home.page.ts
import { AfterViewInit, Component, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  AlertController, 
  LoadingController, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonButtons,
  IonList, 
  IonItemSliding, 
  IonItem, 
  IonLabel,
  IonIcon,
  IonCheckbox, 
  IonItemOptions, 
  IonItemOption, 
  IonModal, 
  IonInput, 
  IonRow, 
  IonCol, 
  IonFab, 
  IonFabButton, 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Observable } from 'rxjs';
import { logOutOutline, pencilOutline, trashOutline, add } from 'ionicons/icons';
import { AuthService } from '../auth.service';
import { TasksService, Task } from '../tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonItemOptions,
    IonItemOption,
    IonModal,
    IonInput,
    IonRow,
    IonCol,
    IonFab,
    IonFabButton,
  ],
})

export class HomePage implements AfterViewInit {
  newTask!: Task; // This is the task that will be added to the database.
  @ViewChild(IonModal) modal!: IonModal; // Find the first IonModal in my template and assign it to the modal property of my class.
  tasks$!: Observable<Task[]>; // This is an observable that will emit the current value of the tasks array.
  
  private authService = inject(AuthService);
  private tasksService = inject(TasksService);
  private router = inject(Router);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);

  constructor() {
    //this.resetTask();
    //addIcons({ logOutOutline, pencilOutline, trashOutline, add });
  }

  ngOnInit() {
    this.resetTask();
    addIcons({ logOutOutline, pencilOutline, trashOutline, add });
    this.tasks$ = this.tasksService.readTasks();
  }

  resetTask() {
    this.newTask = {
      content: '',
      completed: false,
    };
  }

  async logout() {
    await this.authService.signOutUser();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async addTask() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
        const taskId = await this.tasksService.createTask(this.newTask);
        console.log("Task added successfully ");
    } catch (error) {
        console.error("Error creating task:", error);
    } finally {
        await loading.dismiss();
        this.modal.dismiss(null, 'confirm');
        this.resetTask();
    }
  }

  async toggleTaskCompletion(task: Task) {
    // Toggle the completion status
    task.completed = !task.completed;

    try {
        // Update the task in the database
        await this.tasksService.updateTask(task);
        console.log(`Task ${task.completed ? 'completed' : 'incomplete'}: ${task.content}`);
        
        // If using Firestore, ensure to refresh the task list or call a method to re-fetch tasks
        this.tasks$ = this.tasksService.readTasks(); // Refresh the observable
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

  // New method to edit a task
  async editTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Edit Task',
      inputs: [
        {
          name: 'Task',
          type: 'text',
          placeholder: 'Task content',
          value: task.content, // Pre-fill with the current task content
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Update',
          handler: (data) => {
            if (data.Task && data.Task.trim() !== '') {
              task.content = data.Task; // Update the task content
              this.tasksService.updateTask(task); // Update the task in the database
              console.log(`Task updated to: ${task.content}`);
            } else {
              console.warn("Task content cannot be empty.");
            }
          },
        },
      ],
    });
    await alert.present(); // Present the alert to the user
  }

  deleteTask(task: Task) {
    console.log('Deleting task: ', task);
    this.tasksService.deleteTask(task);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.resetTask();
  }

  ngAfterViewInit() {
    this.modal.ionModalDidPresent.subscribe(() => {
      setTimeout(() => {
        const firstInput: any = document.querySelector('ion-modal input');
        firstInput.focus();
      }, 250);
    });
  }

  
}
