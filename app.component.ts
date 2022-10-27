import { Component, VERSION, OnInit,ViewChild,ElementRef} from '@angular/core';
import '@tensorflow/tfjs-backend-webgl';
import * as blazeface from '@tensorflow-models/blazeface';
import { angularMath } from 'angular-ts-math/dist/angular-ts-math/angular-ts-math';

declare var MediaRecorder: any;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('recordedVideo') recordVideoElementRef: ElementRef;
  @ViewChild('video') videoElementRef: ElementRef;


 


  name = 'Angular ' + VERSION.major;
  video!: any;
  state = 0;
  can!: any;
  ctx!: any;
  videoElement!: HTMLVideoElement;
  recordVideoElement!: HTMLVideoElement;
  mediaRecorder: any;
  recordedBlobs!: any;
  isRecording: boolean = false;
  downloadUrl!: any;
  stream!: any;
  videoBuffer!: any;
  downloadBtn!: any;
  
  
 

  constructor() {}

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
    
    navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 360
      }
    })
    .then(stream => {
      this.videoElement = this.videoElementRef.nativeElement;
      this.recordVideoElement = this.recordVideoElementRef.nativeElement;

      this.stream = stream;
      this.videoElement.srcObject = this.stream;
    });


    this.setupCamera();
    this.predictFace();
    
    this.video = document.getElementById('video');
    this.can = document.getElementById('canv');
    this.ctx = this.can.getContext("2d");
    this.ctx.rect(155,40,70,80);
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
  
  startRecording() {
    this.recordedBlobs = [];
    let options: any = { mimeType: 'video/webm' };

    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start(); // collect 100ms of data
    this.isRecording = !this.isRecording;
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
    console.log('Recorded Blobs: ', this.recordedBlobs);
  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      console.log('cannot play.');
      return;
    }
    this.recordVideoElement.play();
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  download(){
    let url = this.downloadUrl 
    this.downloadBtn = document.getElementById("downloadButton");

    try{
      console.log("download working")
      const aTag = document.createElement("a");

        aTag.href = url;

        aTag.download = url.replace(/^.*[\\\/]/, '');

        document.body.appendChild(aTag);

        aTag.click();

        this.downloadBtn.innerText = "File Downloaded";
      
    }
    catch{
      console.log("Cant Download")
    }

  }
  
  
  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.recordedBlobs, {
          type: 'video/webm'
        });
        
          this.downloadUrl = window.URL.createObjectURL(videoBuffer);
          this.recordVideoElement.src = this.downloadUrl;
          console.log(window.URL.createObjectURL(videoBuffer))
          
          
        
        // this.downloadUrl = window.URL.createObjectURL(videoBuffer);
        
        // you can download with <a> tag
        //this.recordVideoElement.src = this.downloadUrl;
         //console.log("button()")
        // console.log(window.URL.createObjectURL(videoBuffer))
      };
    } catch (error) {
      console.log(error);
    }
   
  }
}
