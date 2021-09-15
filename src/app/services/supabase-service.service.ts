import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
const TODO_DB = 'todos';
 
export interface Todo {
  id: number;
  inserted_at: string;
  is_complete: boolean;
  task: string;
  user_id: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private _todos: BehaviorSubject<Todo[]> = new BehaviorSubject([]);
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
 
  private supabase: SupabaseClient;
 
  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      autoRefreshToken: true,
      persistSession: true
    });
 
    // Try to recover our user session
    this.loadUser();
 
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN') {
        this._currentUser.next(session.user);
      } else {
        this._currentUser.next(false);
      }
    });
  }
 
  async loadUser() {
    const user = await this.supabase.auth.user();
 
    if (user) {
      this._currentUser.next(user);
    } else {
      this._currentUser.next(false);
    }
  }
 
  get currentUser(): Observable<User> {
    return this._currentUser.asObservable();
  }
 
  async signUp(credentials: { email, password }) {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signUp(credentials)
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }
 
  signIn(credentials: { email, password }) {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signIn(credentials)
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }
 
  signOut() {
    this.supabase.auth.signOut().then(_ => {
      // Clear up and end all active subscriptions!
      this.supabase.getSubscriptions().map(sub => {
        this.supabase.removeSubscription(sub);
      });
      
      this.router.navigateByUrl('/');
    });
  }
}