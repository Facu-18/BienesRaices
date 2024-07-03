import { Dropzone } from 'dropzone'
import { header, param } from 'express-validator'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

console.log(token)

Dropzone.options.imagen = {
   dictDefaultMessage: 'Sube Tus Imagenes En Este Apartado',
   acceptedFiles: '.png,.jpg,.jpeg',
   maxFilesize: 5,
   maxFiles: 5,
   parallelUploads: 5,
   autoProcessQueue: false,
   addRemoveLinks: true,
   dictRemoveFile: 'Borrar Imagen',
   dictMaxFilesExceeded: 'El Limite son 5 Imagenes',
   headers: {
    'CSRF-Token': token
   },
   paramName : 'imagen',
   init: function(){
      const dropzone = this
      const btnPublicar = document.querySelector('#publicar')

      btnPublicar.addEventListener('click', function(){
         dropzone.processQueue()
      })

      dropzone.on('queuecomplete', function(){
         if(dropzone.getActiveFiles().length == 0){
            window.location.href= '/mis-propiedades'
         }
      })
   
   }

}