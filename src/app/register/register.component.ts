import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';

  onRegister() {
    if (this.fullName && this.email && this.password) {
      alert(`Registrando usuario:\nNombre: ${this.fullName}\nCorreo: ${this.email}`);
    }
  }
}

