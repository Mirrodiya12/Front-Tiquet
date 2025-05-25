import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';   // Importa CommonModule para *ngIf y *ngFor
import { RouterModule } from '@angular/router';   // Importa RouterModule para usar [routerLink]


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    if (this.username && this.password) {
      alert(`Intentando login con usuario: ${this.username}`);
    }
  }
}
