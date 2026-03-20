import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clases.html',
  styleUrls: ['./clases.css'],
})
export class Clases {

}
