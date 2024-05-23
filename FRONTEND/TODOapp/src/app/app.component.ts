import { Component, OnInit } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TODOapp';
  arrayDeTarefas: Tarefa[] = [];
  apiURL: string;
  usuarioLogado = false;
  tokenJWT = '{ "token":""}';
  nomeUsuario: string = ''; // Variável para armazenar o nome do usuário

  constructor(private http: HttpClient) {
    this.apiURL = 'http://localhost:3000'; // Coloque sua URL de API aqui
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
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`, { 'headers': idToken }).subscribe(
      (resultado) => { this.arrayDeTarefas = resultado; this.usuarioLogado = true },
      (error) => { this.usuarioLogado = false }
    );
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    const novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa, { headers: idToken }).subscribe(
      (resultado) => {
        console.log(resultado);
        this.READ_tarefas();
        localStorage.setItem('tasks', JSON.stringify(this.arrayDeTarefas));
      }
    );
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    const indice = this.arrayDeTarefas.indexOf(tarefaAserRemovida);
    const id = this.arrayDeTarefas[indice]._id;
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`, { headers: idToken }).subscribe(
      (resultado) => {
        console.log(resultado);
        this.READ_tarefas();
        localStorage.setItem('tasks', JSON.stringify(this.arrayDeTarefas));
      }
    );
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    const indice = this.arrayDeTarefas.indexOf(tarefaAserModificada);
    const id = this.arrayDeTarefas[indice]._id;
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`, tarefaAserModificada, { headers: idToken }).subscribe(
      (resultado) => {
        console.log(resultado);
        this.READ_tarefas();
        localStorage.setItem('tasks', JSON.stringify(this.arrayDeTarefas));
      }
    );
  }

  login(username: string, password: string) {
    var credenciais = { "nome": username, "senha": password }
    this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe(resultado => {
      this.tokenJWT = JSON.stringify(resultado);
      this.nomeUsuario = username; // Atribui o nome de usuário digitado à variável nomeUsuario
      this.READ_tarefas(); // Chama a função READ_tarefas após o login
    });
  }
}
