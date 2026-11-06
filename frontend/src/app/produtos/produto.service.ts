import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Produto } from './produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly apiUrl = 'http://localhost:3000/api/products';

  constructor(private readonly http: HttpClient) {}

  /** GET /api/products -> 200 com a lista de produtos */
  listar(): Observable<Produto[]> {
    return this.http
      .get<Produto[]>(this.apiUrl)
      .pipe(catchError((e) => this.tratarErro(e)));
  }

  /** GET /api/products/:id -> 200 com o produto | 404 se não existir */
  buscarPorId(id: number): Observable<Produto> {
    return this.http
      .get<Produto>(`${this.apiUrl}/${id}`)
      .pipe(catchError((e) => this.tratarErro(e)));
  }

  /** POST /api/products -> 201 com o produto criado | 400 se dados inválidos */
  cadastrar(produto: Produto): Observable<Produto> {
    return this.http
      .post<Produto>(this.apiUrl, produto)
      .pipe(catchError((e) => this.tratarErro(e)));
  }

  /** PUT /api/products/:id -> 200 com o produto atualizado | 400 | 404 */
  atualizar(id: number, produto: Produto): Observable<Produto> {
    return this.http
      .put<Produto>(`${this.apiUrl}/${id}`, produto)
      .pipe(catchError((e) => this.tratarErro(e)));
  }

  /** DELETE /api/products/:id -> 204 sem conteúdo | 404 */
  excluir(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError((e) => this.tratarErro(e)));
  }

  /**
   * Converte a resposta de erro do servidor em uma mensagem clara para o usuário.
   * A API devolve { "erro": "..." } nos status 400 e 404.
   */
  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    let mensagem: string;

    if (erro.status === 0) {
      mensagem = 'Não foi possível conectar ao servidor. Verifique se o Back-End está rodando na porta 3000.';
    } else if (erro.error?.erro) {
      mensagem = `${erro.error.erro} (status ${erro.status})`;
    } else {
      mensagem = `Erro inesperado no servidor (status ${erro.status}).`;
    }

    console.error('[ProdutoService]', erro);
    return throwError(() => new Error(mensagem));
  }
}
