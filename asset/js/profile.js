const vars = {
 name: $("#name"),
 email: $("#email"),
 occupation: $("#occupation"),
 number: $("#number"),
 password: $("#password"),
 repeatPassword: $("#repeat-password"),
 profileId: $('.profile_id'),
 accountId: $('.account_id'),
 logout: $('#logout'),
 destroy: $('#destroy'),
 avatar: $('#avatar'),
 profileImg: $('#profile-img'),
 alert: $('#alert'),
 updatedAt: $('#updated_at'),
 previewImg: $('#preview_img'),
 status: $('#status'),
 save: $('.modal .save'),
};
// vars.status.fadeOut(0)
vars.avatar.on("change", async e => {
 if (e.target.files.length > 0) {
     alert('loading');
     let p = URL.createObjectURL(e.target.files[0]);
     const res = await upload(vars.avatar.find('input'));
     console.log(res);
     if(res.img != "") vars.profileImg.attr("src", res.img);
 }
});

vars.save.prev().on('change', async e => {
 if (e.target.files.length > 0) {
     // alert('loading');
     let p = URL.createObjectURL(e.target.files[0]);
     $(".modal-img").attr("src", p);

     vars.save.on('click', async e => {
         console.log(this.prev().find('input'))
         const res = await upload(this.prev().find('input'));
     console.log(res);
     if(res.img != "") vars.profileImg.attr("src", res.img);
     });
 }
})




 // file uploader
 function upload(input) {
     // instantiates the form data mechanism
     const image = new FormData();
     // attaches the input file to it
     image.append("avatar", input.prevObject[0].files[0]);
     // gets the file size
     const size = (vars.avatar.find('input').prevObject[0].files[0].size / 1000).toFixed(2) + 'KB';
     // uploads the image
     return fetch('/user/uploadPic', {
         method: 'POST',
         headers: {
             "authorization": `${localStorage.getItem('token')}`
         },
         body: image
     }).then(res => res.json()).then(response => {
         // console.log(response);
         
         if(response.okay){
          alert('success', response.message);
          // get the image from the server response and return it with the file size 
          
         return { img: response.data.image, size };
         }
         else {
             alert('error', response.message)
             // get the image from the server response and return it with the file size 
         return { img: "", size };
         }
         
     }).catch(err => {
         alert('error', err.message)

     });
 }


function alert(status, msg) {
 let color, icon, label;
 if (status == 'in progress' || status == 'loading') {
     color = 'alert-primary';
     icon = 'info-fill';
     label = 'info';
     msg = msg || 'Processing request . . .';
     // vars.alert.parent().css('transition', 'transform .5s');
     // vars.alert.parent().css('transform', 'translateX(100%) !important');
     
     vars.alert.parent().css('transform', 'translateX(-4%)');
     console.log(vars.alert.parent().css('transform'));
 } else if (status == 'error' || status == 'failed') {
     color = 'alert-danger';
     icon = 'exclamation-triangle-fill';
     label = 'danger';
     msg = msg || 'Failed to complete request';
     vars.alert.parent().css('transform', 'translateX(-4%)');
     setTimeout(() => {
         vars.alert.parent().css('transform', 'translateX(100%)');
     }, 3000)
 } else if (status == 'success') {
     color = 'alert-success';
     icon = 'check-circle-fill';
     label = 'success';
     msg = msg || 'Request processed successfully';
     vars.alert.parent().css('transform', 'translateX(-4%)');
     setTimeout(() => {
         vars.alert.parent().css('transform', 'translateX(100%)');
     }, 3000)
 } else {
     setTimeout(() => {
         vars.alert.parent().css('transform', 'translateX(100%)');
     }, 3000);
 }
 const html = `
<div class="alert ${color} d-flex align-items-center"  role="alert">
             <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="${label}:"><use xlink:href="#${icon}"/></svg>
             <div class='alert-msg'>
                 ${msg}
             </div>
         </div>
`;
 vars.alert.html(html)
}

fetch('/profile', {
 method: "POST",
 headers: { 'content-type': 'application/json', 'authorization': `${localStorage.getItem('token')}` }
}).then(res => res.json()).then(response => {
 response = response.data;
 console.log(response);
 vars.name.val(response.name);
 vars.email.val(response.email);
 vars.occupation.val(response.occupation);
 vars.number.val(response.number);
 vars.profileId.text(response._id);
 vars.accountId.text(response.accountId);
 vars.updatedAt.text(`${response.updatedAt.split('T')[0]} ${response.updatedAt.split('T')[1].split('.')[0]}`);
 vars.profileImg.attr("src", response.image);
 console.log(response.updatedAt.split('T')[0], response.updatedAt.split('T')[1].split('.')[0]);

 if (response.status == 'pending') {
     vars.status.fadeIn(300);
 }
}).catch(err => {
 console.log(err);
});