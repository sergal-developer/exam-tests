import{S as o}from"./storage.42d81459.js";import{U as r}from"./utils.115e600c.js";class s{constructor(){this.utils=new r,this.storage=new o("exam"),this.sections={modal:null,userDetails:null}}init(){this.profile=this.storage.get("profile"),this.sections.userDetails=document.querySelector("#userDetails"),this.profile?this.sections.userDetails.style.cssText="display: inline-block;":(this.sections.modal=$(".ui.modal"),this.sections.modal.modal("setting","closable",!1).modal("show"))}createUser(){let t=document.querySelector("#username").value.trim();t?(this.sections.modal.modal("hide"),this.storage.save({username:t,topics:{list:[],total:0}},"profile"),this.utils.redirect("/exam-tests/")):document.querySelector(".ui.input").classList.add("error")}getProfileDetails(){return this.profile=this.storage.get("profile"),this.utils.assignDataInner(this.profile.username,"#usernameTitle"),this.profile}}const i=new s;window.onload=e=>{i.init(),l()};function l(){document.querySelector("#buttonCreateUser").addEventListener("click",()=>{i.createUser()})}const a=new s;a.getProfileDetails();
