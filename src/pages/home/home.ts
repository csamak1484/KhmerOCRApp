import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { Http, Headers } from '@angular/http';
import { ImagePicker } from '@ionic-native/image-picker';
import { DomSanitizer } from '@angular/platform-browser';
import { Base64 } from '@ionic-native/base64';
import { Network } from '@ionic-native/network';
import { ToastController, LoadingController, App} from 'ionic-angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';

 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  cropperOptions: any;
  croppedImage = null;
 
  myImage = null;
  scaleValX = 1;
  scaleValY = 1;
  header: any;
  textDisplay: string;
  rawPhoto: any;
  photoGallery: any;
  editImage: boolean = false;
  isRecognized: boolean = false;
  isResultNull: boolean = false;
  loading: any;
 
  constructor(public navCtrl: NavController, 
    private camera: Camera, 
    private http: Http,
    private imagePicker: ImagePicker,
    private sanitizer: DomSanitizer,
    private base64: Base64,
    private network: Network,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private socialSharing: SocialSharing,
              private file: File

  ) {
    this.textDisplay = "Please input the image of Khmer Limon or Unicode text.";
    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 0,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
    };

    
  }
 
  captureImage() {

    this.myImage = "";
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
 
    this.camera.getPicture(options).then((imageData) => {
      this.presentLoadingNoDismiss('Loading photo...');
      console.log('photo from camera = '+imageData);
      this.myImage = 'data:image/jpeg;base64,' + imageData;
      this.dismissLoading();
    }, function(err) {
      // this.dismissLoading();
      console.log(JSON.stringify(err));

    });
  }

  async captureImageNew(useAlbum: boolean) {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      ...useAlbum ? {sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM} : {}
    }

    const imageData = await this.camera.getPicture(options);
    //console.log('================> Image: ',imageData);
    this.myImage = 'data:image/jpeg;base64,' + imageData;


  }

  openImagePicker() {
    this.myImage = "";
    let options = {
      maximumImagesCount: 1,
    }
    this.presentLoadingNoDismiss('Loading photo...');
    this.imagePicker.getPictures(options)
      .then((results) => {
        let path = this.file.tempDirectory;
        console.log('tmp path : '+path);
        console.log('photo from gallery : '+results);
      let filePath: string ='file://'+results;
        console.log('filePath : '+filePath);
        this.base64.encodeFile(filePath).then((base64File: string) => {
          alert(results);
          this.myImage = this.sanitizer.bypassSecurityTrustUrl(base64File);
          this.dismissLoading();
        }, (err) => {
          console.log(err);
          alert('error encode base 64 image');
        });
      }, (err) => { console.log(err) });
  }
 
  reset() {
    this.angularCropper.cropper.reset();
  }
 
  clear() {
    this.angularCropper.cropper.clear();
  }
 
  rotate() {
    this.angularCropper.cropper.rotate(90);
  }
 
  zoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }
 
  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }
 
  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }
 
  move(x, y) {
    this.angularCropper.cropper.move(x, y);
  }
 
  save() {
    this.presentLoadingNoDismiss('Cropping image...');
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImgB64String;
    this.editImage = true;
    if(this.croppedImage != null)
      this.dismissLoading();
    
    // this.generateKhmreocr();

  }

  setEditImage(){
    this.editImage = false;
    this.croppedImage = "";
    this.isRecognized = false;
    this.isResultNull = false;
  }

  setImageNull(){
    this.myImage = "";
    this.isRecognized = false;
    this.editImage = false;
    this.croppedImage = "";
    this.textDisplay = "Please input the image of Khmer Limon or Unicode text.";
  }

  generateKhmreocr() {
    
    var json_base64_data = [
      {
        "photo": this.croppedImage
      }
    ];

    return new Promise((resolve, reject) => {
      //var header = new Headers();
      this.header = {
        Accept: 'application/json'
      };
      console.log('data:');
      console.log(json_base64_data);
      if(this.network.type != "none")
      {
        //this.presentLoadingCustom(3000,'OCR is being generated...');
        this.presentLoadingNoDismiss('OCR is being generated...');
        this.http.post('http://khmerocr.open.org.kh/api/ocr_image_to_text', json_base64_data, { headers: this.header })
          .subscribe(res => {
          
            let result_text = res["_body"];
            let parse_result = JSON.parse(result_text);
            console.log('OCR output= '+parse_result.ocr_generated_text);
            if(parse_result.ocr_generated_text == null || parse_result.ocr_generated_text == " \n\f" || parse_result.ocr_generated_text == "" || parse_result.ocr_generated_text == " \n"  || parse_result.ocr_generated_text == "\f" )
            {
              this.presentToast("Cannot recognize your input image.");
              this.textDisplay = "Cannot recognize your input image.";
              this.isResultNull = true;
              this.isRecognized = true;
            } else {
              this.textDisplay = parse_result.ocr_generated_text;
              this.isResultNull = false;
              this.isRecognized = true;
            }
            // this.textDisplay ="";
            
            this.dismissLoading();
            resolve(res);
          }, err => {
            console.log('Error while recognizing Khmer OCR: ' + JSON.stringify(err));
            reject(err);
          });
      } else {
        this.presentToast("No internet connection!")
      }

    });
  }

     // * Function to show loading dialog * //
     // * Param1: duriationTime => how long to show the msg (milli-sec)* //
     // * Param2: str => text msg to be shown * //
     presentLoadingCustom(duriationTime: number, str: string) {
      let loading = this.loadingCtrl.create({
        content: `
          <div class="custom-spinner-container">
            <div class="custom-spinner-box"> `+ str +` </div>
          </div>`,
        duration: duriationTime
      });

      loading.onDidDismiss(() => {
        console.log('Dismissed loading');
      });

      loading.present();
    }

    // * Function to show loading dialog * //
     // * Param1: duriationTime => how long to show the msg (milli-sec)* //
     // * Param2: str => text msg to be shown * //
     presentLoadingNoDismiss(str: string) {
      this.loading = this.loadingCtrl.create({
        content: `
          <div class="custom-spinner-container">
            <div class="custom-spinner-box"> `+ str +` </div>
          </div>`,
          showBackdrop: true
      });

      this.loading.present();
    }

    dismissLoading(){
      this.loading.dismiss();
      /* this.loading.onDidDismiss(() => {
        console.log('Dismissed loading');
      }); */
    }

     // * Function to show simple dialog * //
     // * Param1: msg => the msg to be shown * //
    presentToast(msg: string) {
      let toastObj = this.toastCtrl.create({
        message: msg,
        position: "middle",
        duration: 4000
      });
      toastObj.present();
    }

    shareSheetShare() {
      this.socialSharing.share(this.textDisplay, "Khmer OCR-generated text", "", "").then(() => {
        console.log("shareSheetShare: Success");
      }).catch(() => {
        console.error("shareSheetShare: failed");
      });
    }

    infoButton(){
      this.myImage = "";
      this.isRecognized = false;
      this.editImage = false;
      this.croppedImage = "";
      this.textDisplay = "This Khmer OCR App uses the customised Khmer-OCR engines, trained using Tesseract 4.0 Library with Limon fonts and google training data. This engine is developed as an RestFul API which could be accessible through: http://khmerocr.open.org.kh/api/ocr_image_to_text by providing input based-64 image.";
    }
}