import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class ServerService {
  // pathToData: '../'
  constructor(private http: Http) { }



  getServers() {
    // return this.http.get('assets/servers.json').map(res => res.json());
    const serverDataUrl = 'assets/servers.json';
    return this.http.get(serverDataUrl)
    .map(x => x.json());
    // this.http.get('assets/servers.json').map(res => res.json()).subscribe((data) => {
    //   console.log('data');
    //   console.log(data);
    //   this.data = data;
    //   return data;
    // });

    //  const navItems = this.http.get('../model/servers.json').map(res => res.json())
    // .do(data => console.log(data));
  }
}
