import {Injectable} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import { User } from './../models/User';
import {JwtHelperService} from '@auth0/angular-jwt';

const TOKEN_KEY = 'token';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    me: User = null;

    constructor(private http: HttpClient) {
        const token = this.getToken();
        this.setUserFromToken(token);
    }


    login(User: { email: string, password: string }): Observable<{ token: string }> {
        return this.http
            .post<{ token: string }>('http://localhost:8000/api/login', User)
            .pipe(
            tap(response => {
                this.setToken(response.token);
            })
        );
    }

    setToken(token: string) {
        this.setUserFromToken(token);
        token ? window.localStorage.setItem(TOKEN_KEY, token): window.localStorage.removeItem(TOKEN_KEY);
    }


    private setUserFromToken(token: string){
        const decodedPayload = new JwtHelperService().decodeToken(token); //3 partes - pegar 2 parte
        this.me = decodedPayload ? {
            id: decodedPayload.sub,
            name: decodedPayload.name,
            email: decodedPayload.email,
            profile: decodedPayload.profile
        }: null;
    }


    getToken(): string | null {
        return window.localStorage.getItem(TOKEN_KEY);
    }


    isAuth(): boolean{
       const token = this.getToken();
       return !new JwtHelperService().isTokenExpired(token, 30);
    }



    /*   login(user) {
           return this.http.post<{ token: string }>('http://localhost:8000/api/login', user)
               .pipe(
                   tap(data => window.localStorage.setItem('token', data.token))
               );
           //~5M
       }*/

    logout(): Observable<any>{
        return this.http
            .post<{ token: string }>('http://localhost:8000/api/logout', {})
            .pipe(
            tap(() => {
                this.setToken(null);
            })
        );
    }


    get authorizationHeader(){
        return `Bearer ${this.getToken()}`;
    }


    refresh() {
        return this.http.post<{ token: string }>('http://localhost:8000/api/refresh', {})
            .pipe(
                tap(data => window.localStorage.setItem('token', data.token))
            );
    }
}
