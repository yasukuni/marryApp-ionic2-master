/**
 * Created by ASUS on 2017/10/23 0023.
 */
import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { ImgService } from '../../util/ImgService'
import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'

import {LargeImagePage} from "../large-image/large-image";

@Component({
  selector: 'page-controlImage',
  templateUrl: 'control-image.html'
})

export class ControlImagePage {

  /**
   * 证件类型
   * @type {Array}
     */
  private pictures = [];
  private icons = [];
  private waitIcons = [];

  private userId;

  constructor(public navCtrl: NavController, public myHttp : MyHttp, public imgService:ImgService,
              public memory: Memory, public events: Events, public navParams: NavParams, public alertCtrl: AlertController) {
    this.init();
  }

  init() {
    this.userId = this.memory.getUser().id;
    this.getAllPicture()
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

  /**
   * 图片操作
   * @param index 图片序号
   */
  controlImage(index) {
    console.log(index)
    this.alertCtrl.create({
      title: '图片操作',
      buttons: [{
        text:'查看大图',
        handler: ()=> {
          this.toLargeImage(1,this.pictures[index]);
        }
      },{
        text:'删除图片',
        handler: ()=> {
          this.delPicture(index);
        }
      },'取消']
    }).present();
  }

  /**
   * 查看大图
   * @param flag 1 来自图片 2 来自头像
   * @param picture
   */
  toLargeImage(flag,picture) {
    let pictureNow = picture
    let pictureAll = []
    if(flag==1){
      pictureAll = this.pictures
    }else if(flag==2){
      pictureAll = this.icons
    }
    this.navCtrl.push(LargeImagePage, {
      pictureNow : pictureNow,
      pictureAll : pictureAll
    });
  }

  /**
   * 图片操作
   * @param index 图片序号
   */
  controlIcon(index) {
    console.log(index)
    this.alertCtrl.create({
      title: '图片操作',
      buttons: [{
        text:'查看大图',
        handler: ()=> {
          this.toLargeImage(2,this.icons[index]);
        }
      },{
        text:'设为头像',
        handler: ()=> {
          this.changeImage(index);
        }
      },{
        text:'删除图片',
        handler: ()=> {
          this.delIcon(index);
        }
      },'取消']
    }).present();
  }

  /**
   * 修改图片
   * @param index 图片序号
   */
  changeImage(index) {
    this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
      picture: index,
      userId: this.memory.getUser().id
    }, (data)=>{
      this.events.publish("e-user-introduce");

    })
  }

  /**
   * 删除图片
   * @param index 下标
   */
  delPicture(index) {
    this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
      delPicture: index,
      userId: this.memory.getUser().id
    }, (data)=>{
      this.getAllPicture();
    })
  }

  /**
   * 删除头像图片
   * @param index 下标
   */
  delIcon(index) {
    this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
      delIcon: index,
      userId: this.memory.getUser().id
    }, (data)=>{
      this.getAllPicture();
    })
  }

  /**
   * 添加图片
   */
  addPicture() {
    this.imgService.chooseCamera((imageData) => {
      this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
        addPicture: imageData,
        userId: this.memory.getUser().id
      }, (data)=>{
        this.getAllPicture();
      })
    })
  }

  /**
   * 添加头像
   */
  addIcon() {
    this.imgService.chooseCamera((imageData) => {
      this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
        addIcon: imageData,
        userId: this.memory.getUser().id
      }, (data)=>{
        this.alertCtrl.create({
          title: "上传成功",
          subTitle: "请耐心等待审核结果",
          buttons: ["关闭"]
        }).present();
        this.getAllPicture();
      })
    })
  }

  /**
   * 获取全部图片
   */
  getAllPicture() {
    this.myHttp.post(MyHttp.URL_GET_ALL_SMALL_PICTURE, {
      userId: this.userId,
      otherUserId:this.userId
    }, (data) => {
      this.pictures = data.allPicture;
      this.icons = data.allIcon;
    });
    this.myHttp.post(MyHttp.URL_GET_WAIT_CRED_ICON, {
      userId: this.userId,
    }, (data) => {
      this.waitIcons = data.datas;
      console.log(this.waitIcons)
    });
  }

  /**
   * 判断图片是否已经满
   * @returns {boolean} 是否满
   */
  imageNotFull() : boolean {
    return this.pictures.length < 4;
  }


}
