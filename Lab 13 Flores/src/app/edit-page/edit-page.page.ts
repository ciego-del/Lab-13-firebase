import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.models';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {

  post = {} as Post;
  id: any;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
   }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id: string){
    let loader = await this.loadingCtrl.create({
      message: 'Espere un momento por favor...',
    });
    await loader.present();

    this.firestore
    .doc("posts/"+id)
    .valueChanges()
    .subscribe((data: any) => {
      const { title, details } = data as { title: string, details:string};
      this.post.title = data.title;
      this.post.details = data.details;

      loader.dismiss();
  });  

  await loader.dismiss();
}

async updatePost(post: Post){
  let loader = await this.loadingCtrl.create({
    message: 'Actualizando...',
  });
  await loader.present();

  this.firestore
  .doc("posts/"+this.id)
  .update(post)
  .then(() => {
    console.log("elemento actualizado correctamente!");
    this.router.navigate(['/home']);
    loader.dismiss();
})
.catch((error) => {
  console.error("Error al actualizar el elemento: ",error);
  loader.dismiss();
});
}

formValidation(){
  if (!this.post.title) {
    this.showToast("Ingrese un titulo");
    return false;
  }

  return true;
}

showToast(message: string){
  this.toastCtrl.create({
    message: message,
    duration: 5000 // Aumneta la duracion del mansaje a 5 segundos
  }).then(toastData => toastData.present());

}
}