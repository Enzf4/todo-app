import { Component, OnInit } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TODOapp';
  arrayDeTarefas: Tarefa[] = [];
  apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'https://married-clerissa-enzocodes.koyeb.app';
  }

  ngOnInit() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.arrayDeTarefas = JSON.parse(storedTasks);
    } else {
      this.READ_tarefas();
    }
  }

  READ_tarefas() {
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`).subscribe(
      resultado => {
        this.arrayDeTarefas = resultado;
        localStorage.setItem('tasks', JSON.stringify(this.arrayDeTarefas));
        console.log('Fetched tasks:', this.arrayDeTarefas);
      },
      error => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe(
      resultado => {
        console.log(resultado);
        this.READ_tarefas();
        localStorage.setItem('tasks', JSON.stringify(this.arrayDeTarefas));
      }
    );
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    var indice = this.arrayDeTarefas.indexOf(tarefaAserRemovida);
    var id = this.arrayDeTarefas[indice]._id;
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`).subscribe(
      resultado => {
        console.log(resultado);
        this.READ_tarefas();
        localStorage.setItem('tasks', JSON.stringify(this.arrayDeTarefas));
      }
    );
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    var indice = this.arrayDeTarefas.indexOf(tarefaAserModificada);
    var id = this.arrayDeTarefas[indice]._id;
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`,
      tarefaAserModificada).subscribe(
        resultado => {
          console.log(resultado);
          this.READ_tarefas();
          localStorage.setItem('tasks', JSON.stringify(this.arrayDeTarefas));
        }
      );
  }
}
