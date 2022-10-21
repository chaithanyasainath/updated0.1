import { Component, VERSION, OnInit } from '@angular/core';
import '@tensorflow/tfjs-backend-webgl';
import * as blazeface from '@tensorflow-models/blazeface';
import { angularMath } from 'angular-ts-math/dist/angular-ts-math/angular-ts-math';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  
  name = 'Angular ' + VERSION.major;
  video!: any;
  state = 0;
  can!: any;
  ctx!: any;
 

  async ngOnInit() {
    // navigator.permissions
    //   .query({ name: 'camera' })
    //   .then(function (permissionStatus) {
    //     if (permissionStatus.state == 'denied') {
    //       alert('Please give camera permission');
    //       console.log(permissionStatus.state);
    //     } else if (permissionStatus.state == 'granted') {
    //       console.log('Granted');
    //     }
    //     permissionStatus.onchange = function () {
    //       if (permissionStatus.state == 'denied') {
    //         console.log(permissionStatus.state);
    //         alert('Please refresh and give camera permission');
    //       }
    //     };
    //   });
    
    this.setupCamera();
    this.predictFace();
    
    this.video = document.getElementById('video');
    this.can = document.getElementById('canv');
    this.ctx = this.can.getContext("2d");
    this.ctx.rect(110,100,510,400*2 );
    //this.ctx.ellipse(100, 100, 50, 70, 0, 0, angularMath.getPi() * 2);
    this.ctx.stroke();
    //this.can.drawImage(this.video ,150 ,150 , 50 , 50);


    
  }
  setupCamera() {

    navigator.mediaDevices
    
      .getUserMedia({
        audio: false,
        video: {
          
          facingMode: 'user',
        },
      })
      .then((stream) => {
        this.video.srcObject = stream;
        // this.predictFace();
      })
      .catch((err) => {
        if (err.name == 'NotAllowedError') {
          console.log('Permission denied');
          alert('Please give camera permission');
          // this.setupCamera();
        }
      });
  }
  async predictFace() {
    
    const model = await blazeface.load();
    console.log('Model Loaded');
    setInterval(async () => {
      const predictions = model.estimateFaces(this.video);
      // if (predictions[0]['probability'][0] > 0.99) {

      //   console.log('face found');
      // }
      // else {
      //   console.log('face not found');
      // }

                
      if ((await predictions).length > 0) {
        for (let i = 0; i < (await predictions).length; i++) {
          console.log((await predictions));
        }
      }

    }, 1000);
  }
}
