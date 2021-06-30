import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';

declare const CanvasJS: any;

interface Weight {
  timestamp: Date;
  weight: number;
}

type WeightWithId = Weight & { id?: string };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chart: any;
  isLoggedIn: Observable<boolean>;
  editingWeight: Partial<WeightWithId> = {};
  weights$: Observable<WeightWithId[]>;
  collection: AngularFirestoreCollection<unknown>;


  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
    this.isLoggedIn = this.auth.user.pipe(
      map(user => !!user)
    )
    this.collection = this.afs.collection("weights");  
    this.weights$ = this.collection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Weight;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.weights$.subscribe(data => this.displayData(data))
    
  }

  delete(weight: WeightWithId){
    this.collection.doc(weight.id).delete()
  }

  addOrUpdateWeight() {
    const item: Weight = {
      timestamp: this.editingWeight.timestamp as Date,
      weight: +(this.editingWeight.weight as number)
    }
    console.log(item)
    if(this.editingWeight.id){
      this.collection.doc(this.editingWeight.id).update(item)
    } else {
      this.collection.add(item)
    }
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
    this.chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: 'Suivi du poids',
      },
      axisX: {
        valueFormatString: 'DD MMM',
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      data: [
        {
          type: 'line',
          indexLabelFontSize: 16,
          dataPoints: [],
        },
      ],
    });

    this.chart.render();
  }

  displayData(weights: WeightWithId[]) {
    this.chart.options.data[0].dataPoints = weights
      .sort(function (a, b) {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      })
      .map((w) => ({
        x: new Date(w.timestamp),
        y: +w.weight,
      }));
    this.chart.render();
  }
}
