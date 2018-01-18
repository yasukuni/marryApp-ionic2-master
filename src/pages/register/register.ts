/**
 * Created by ASUS on 2017/9/4 0004.
 */
import {ChangeDetectorRef, Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';

import { UserDetailPage } from "../user-detail/user-detail"

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  /**
   * 注册的表单数据
   */
  public registerForm = {
    account: '',
    verifyCode:'',
    password: ''
  };
  //邀请码
  /*    invitaCode:''*/
  //界面刷新
  public getCode = "获取验证码";
  public show = "click";
  public timeShow = 60;
  public timer;

  //是否同意协议
  public cucumber=false;

  constructor(public navCtrl:NavController, private myHttp:MyHttp,
              public alertCtrl:AlertController,public changeDetectorRef:ChangeDetectorRef) {
  }

  ngReFresh(){
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=>{
      this.changeDetectorRef.detectChanges();
      if(this.timeShow>=1){
        this.timeShow -= 1;
        this.show="unclick";
        this.getCode = "获取验证码 ("+this.timeShow+")";
      }else{
        this.show="click";
        this.getCode="获取验证码"
        clearInterval(this.timer);
      }
      console.log("1");
    },1000);
  }

  /**
   * 注册
   */
  public register() {
    let rulePhone = /^1[3|4|5|7|8][0-9]{9}$/;
    let rulePas = /^[a-zA-Z0-9]{6,20}$/;
    console.log(this.registerForm)
    if(!this.cucumber){
      this.registerMessage("请同意协议内容");
      return;
    }
    for (let name in this.registerForm) {
      if (this.registerForm[name] === undefined || this.registerForm[name] === '') {
        this.registerMessage("信息必须填全");
        return;
      }
    }
    if(!rulePhone.test(this.registerForm.account)){
      this.registerMessage("请输入正确的手机号码");
      return;
    }
    if(!rulePas.test(this.registerForm.password)){
      this.registerMessage("请按密码格式输入");
      return;
    }

    this.myHttp.post(MyHttp.URL_REGISTER, this.registerForm, (data) => {
      if (data.registerResult === "0") {
        this.registerMessage("注册成功,请继续完善信息");
        clearInterval(this.timer);
        this.changeDetectorRef.detach();
        this.navCtrl.pop();
        this.navCtrl.push(UserDetailPage,{
          userId: data.userId
        })
      } else if (data.registerResult === "1") {
        this.registerMessage("该手机已经注册!");
      } else if (data.registerResult ==="4"){
        this.registerMessage("验证码错误");
      } else if (data.registerResult ==="5"){
        this.registerMessage("邀请码错误")
      }
    })
  }

  /**
   * 发送验证码
   */
  sendVerify(event : Event) {
    event.stopPropagation();
    console.log("xxxxxx")
    if(this.show == "click"){
      this.ngReFresh()
      this.timeShow = 60;
      this.myHttp.post(MyHttp.URL_SEND_VERIFY, {
        phone: this.registerForm.account
      }, (data) => {
        console.log(data);
        if (data.sendResult === "0") {
          this.registerMessage("发送验证码成功，请在10分钟内验证");
        } else if (data.sendResult === "1") {
          this.registerMessage("发送验证码失败：" + data.message);
        }
      })
    }
  }

  /**
   * 注册信息
   * @param subTitle
     */
  private registerMessage(subTitle: string) {
    this.alertCtrl.create({
      title: "注册",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 弹出用户协议
   */
  seeProtocol(){
    let protocol = "邂逅斯年软件服务协议\n" +
      "特别提示\n" +
      "\n" +
      "杭州来布科技有限公司（以下简称“来布科技”）在此特别提醒您（用户）在注册成为用户之前，请认真阅读本《用户协议》（以下简称“协议”），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。除非您接受本协议所有条款，否则您无权注册、登录或使用本协议所涉服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。 \n" +
      "本协议约定来布科技与用户之间关于“邂逅斯年”软件服务（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人。本协议可由来布科技随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本网站查阅最新版协议条款。在来布科技修改协议条款后，如果用户不接受修改后的条款，请立即停止使用来布科技提供的服务，用户继续使用来布科技提供的服务将被视为接受修改后的协议。\n" +
      "一、账号注册\n" +
      "1、用户在使用本服务前需要注册一个“邂逅斯年”账号。“邂逅斯年”账号应当使用手机号码绑定注册，请用户使用尚未与“邂逅斯年”账号绑定的手机号码，以及未被来布科技根据本协议封禁的手机号码注册“邂逅斯年”账号。来布科技可以根据用户需求或产品需要对账号注册和绑定的方式进行变更，而无须事先通知用户。 \n" +
      "2、鉴于“邂逅斯年”账号的绑定注册方式，您同意来布科技在注册时将使用您提供的手机号码自动提取您的手机设备识别码等信息用于注册。 \n" +
      "3、在用户注册及使用本服务时，来布科技需要搜集能识别用户身份的个人信息以便来布科技可以在必要时联系用户，或为用户提供更好的使用体验。来布科技搜集的信息包括但不限于用户的姓名、性别、年龄、出生日期、身份证号、地址、学校情况、公司情况、所属行业、兴趣爱好、常出没的地方、个人说明；来布科技同意对这些信息的使用将受限于第三条用户个人隐私信息保护的约束。 \n" +
      "4、“邂逅斯年”是一款面向有明确结婚意向的单身人士的实名制移动社交产品，用户需要向“邂逅斯年”提交可以证实自己个人信息真实性的包括但不限于用户的身份证件号码及正反面照片、护照证件号码及照片、学历学位证书正面照片、房产证件正面照片、汽车行驶证件正面照片，“邂逅斯年”有权对用户提交的认证信息进行审核并且确认通过或者否决通过。用户无法通过“邂逅斯年”的信息认证审核将无法使用“邂逅斯年”提供的包括但不限于即时通讯、关注他人产品功能，但可以查看其他会员的公开资料及使用“邂逅斯年”提供的条件搜索功能。“邂逅斯年”将对用户提交的用于个人信息真实性认证的资料进行严格的保密。\n" +
      "\n" +
      "二、服务内容\n" +
      "1、本服务的具体内容由来布科技根据实际情况提供，包括但不限于授权用户通过其账号进行即时通讯、关注他人、发布留言。来布科技可以对其提供的服务予以变更，且来布科技提供的服务内容可能随时变更；用户将会收到来布科技关于服务变更的通知。 \n" +
      "2、来布科技提供的服务包含免费服务与收费服务。用户可以通过付费方式购买收费服务，具体方式为：用户通过网上银行、支付宝或其他“邂逅斯年”平台提供的付费途径支付一定数额的人民币，然后根据来布科技公布的资费标准购买用户欲使用的收费服务，从而获得收费服务使用权限。对于收费服务，来布科技会在用户使用之前给予用户明确的提示，只有用户根据提示确认其同意按照前述支付方式支付费用并完成了支付行为，用户才能使用该等收费服务。支付行为的完成以银行或第三方支付平台生成“支付已完成”的确认通知为准。\n" +
      "\n" +
      "三、用户个人隐私信息保护\n" +
      "1、用户在注册账号或使用本服务的过程中，可能需要填写或提交一些必要的信息，如法律法规、规章规范性文件（以下称“法律法规”）规定的需要填写的身份信息。如用户提交的信息不完整或不符合法律法规的规定，则用户可能无法使用本服务或在使用本服务的过程中受到限制。 \n" +
      "2、个人隐私信息是指涉及用户个人身份或个人隐私的信息，比如，用户身份证件号码、手机号码、手机设备识别码、IP地址、学历学位证书照片，身份证件照片、房产证照片、汽车行驶证照片、用户聊天记录。非个人隐私信息是指用户对本服务的操作状态以及使用习惯等明确且客观反映在来布科技服务器端的基本记录信息、个人隐私信息范围外的其它普通信息，以及用户同意公开的上述隐私信息。 \n" +
      "3、尊重用户个人隐私信息的私有性是来布科技的一贯制度，来布科技将采取技术措施和其他必要措施，确保用户个人隐私信息安全，防止在本服务中收集的用户个人隐私信息泄露、毁损或丢失。在发生前述情形或者来布科技发现存在发生前述情形的可能时，将及时采取补救措施。 \n" +
      "4、来布科技未经用户同意不向任何第三方公开、 透露用户个人隐私信息。但以下特定情形除外：\n" +
      "(1) 来布科技根据法律法规规定或有权机关的指示提供用户的个人隐私信息； \n" +
      "(2) 由于用户将其用户密码告知他人或与他人共享注册帐户与密码，由此导致的任何个人信息的泄漏，或其他非因来布科技原因导致的个人隐私信息的泄露； \n" +
      "(3) 用户自行向第三方公开其个人隐私信息； \n" +
      "(4) 用户与来布科技及合作单位之间就用户个人隐私信息的使用公开达成约定，来布科技因此向合作单位公开用户个人隐私信息； \n" +
      "(5) 任何由于黑客攻击、电脑病毒侵入及其他不可抗力事件导致用户个人隐私信息的泄露。\n" +
      "5、用户同意来布科技可在以下事项中使用用户的个人隐私信息：\n" +
      "(1) 来布科技向用户及时发送重要通知，如软件更新、本协议条款的变更； \n" +
      "(2) 来布科技内部进行审计、数据分析和研究等，以改进来布科技的产品、服务和与用户之间的沟通；用户基本信息在平台的展示（不包含各项证件的证件内容）； \n" +
      "(3) 依本协议约定，来布科技管理、审查用户信息及进行处理措施； \n" +
      "(4) 适用法律法规规定的其他事项。\n" +
      "除上述事项外，如未取得用户事先同意，来布科技不会将用户个人隐私信息使用于任何其他用途。 \n" +
      "6、来布科技重视对未成年人个人隐私信息的保护。来布科技将依赖用户提供的个人信息判断用户是否为未成年人。任何18岁以下的未成年人注册账号或使用本服务应事先取得家长或其法定监护人（以下简称\"监护人\"）的书面同意。除根据法律法规的规定及有权机关的指示披露外，来布科技不会使用或向任何第三方透露未成年人的聊天记录及其他个人隐私信息。除本协议约定的例外情形外，未经监护人事先同意，来布科技不会使用或向任何第三方透露未成年人的个人隐私信息。任何18岁以下的用户不得下载和使用来布科技通过邂逅斯年软件提供的网络游戏。 \n" +
      "7、用户确认，其地理位置信息为非个人隐私信息，用户成功注册“邂逅斯年”账号视为确认授权来布科技提取、公开及使用用户的地理位置信息。用户地理位置信息将作为用户公开资料之一，由来布科技向其他用户公开。如用户需要终止向其他用户公开其地理位置信息，可随时自行设置为隐身状态。 \n" +
      "8、为了改善来布科技的技术和服务，向用户提供更好的服务体验，来布科技或可会自行收集使用或向第三方提供用户的非个人隐私信息。\n" +
      "\n" +
      "四、内容规范\n" +
      "1、本条所述内容是指用户使用本服务过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号头像、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复或自动回复消息和相关链接页面，以及其他使用账号或本服务所产生的内容。 \n" +
      "2、用户不得利用“邂逅斯年”账号或本服务制作、上载、复制、发布、传播如下法律、法规和政策禁止的内容：\n" +
      "(1) 反对宪法所确定的基本原则的； \n" +
      "(2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的； \n" +
      "(3) 损害国家荣誉和利益的； \n" +
      "(4) 煽动民族仇恨、民族歧视，破坏民族团结的； \n" +
      "(5) 破坏国家宗教政策，宣扬邪教和封建迷信的； \n" +
      "(6) 散布谣言，扰乱社会秩序，破坏社会稳定的； \n" +
      "(7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的； \n" +
      "(8) 侮辱或者诽谤他人，侵害他人合法权益的； \n" +
      "(9) 不遵守法律法规底线、社会主义制度底线、国家利益底线、公民合法权益底线、社会公共秩序底线、道德风尚底线和信息真实性底线的“七条底线”要求的； \n" +
      "(10) 含有法律、行政法规禁止的其他内容的信息。\n" +
      "3、用户不得利用“邂逅斯年”账号或本服务制作、上载、复制、发布、传播如下干扰“邂逅斯年”正常运营，以及侵犯其他用户或第三方合法权益的内容：\n" +
      "(1) 含有任何性或性暗示的； \n" +
      "(2) 含有辱骂、恐吓、威胁内容的； \n" +
      "(3) 含有骚扰、垃圾广告、恶意信息、诱骗信息的； \n" +
      "(4) 涉及他人隐私、个人信息或资料的； \n" +
      "(5) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的； \n" +
      "(6) 含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。\n" +
      "\n" +
      "五、使用规则\n" +
      "1、用户在本服务中或通过本服务所传送、发布的任何内容并不反映或代表，也不得被视为反映或代表来布科技的观点、立场或政策，来布科技对此不承担任何责任。 \n" +
      "2、用户不得利用“邂逅斯年”账号或本服务进行如下行为：\n" +
      "(1) 提交、发布虚假信息，或盗用他人头像或资料，冒充、利用他人名义的； \n" +
      "(2) 强制、诱导其他用户关注、点击链接页面或分享信息的； \n" +
      "(3) 虚构事实、隐瞒真相以误导、欺骗他人的； \n" +
      "(4) 利用技术手段批量建立虚假账号的； \n" +
      "(5) 利用“邂逅斯年”账号或本服务从事任何违法犯罪活动的； \n" +
      "(6) 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的； \n" +
      "(7) 其他违反法律法规规定、侵犯其他用户合法权益、干扰“邂逅斯年”正常运营或来布科技未明示授权的行为。\n" +
      "3、用户须对利用“邂逅斯年”账号或本服务传送信息的真实性、合法性、无害性、准确性、有效性等全权负责，与用户所传播的信息相关的任何法律责任由用户自行承担，与来布科技无关。如因此给来布科技或第三方造成损害的，用户应当依法予以赔偿。 \n" +
      "4、来布科技提供的服务中可能包括广告，用户同意在使用过程中显示来布科技和第三方供应商、合作伙伴提供的广告。除法律法规明确规定外，用户应自行对依该广告信息进行的交易负责，对用户因依该广告信息进行的交易或前述广告商提供的内容而遭受的损失或损害，来布科技不承担任何责任。\n" +
      "\n" +
      "六、帐户管理\n" +
      "1、 “邂逅斯年”账号的所有权归来布科技所有，用户完成申请注册手续后，获得“邂逅斯年”账号的使用权，该使用权仅属于初始申请注册人，禁止赠与、借用、租用、转让或售卖。来布科技因经营需要，有权回收用户的“邂逅斯年”账号。 \n" +
      "2、用户可以更改、删除“邂逅斯年”帐户上的个人资料、注册信息及传送内容等，但需注意，删除有关信息的同时也会删除用户储存在系统中的文字和图片。用户需承担该风险。 \n" +
      "3、用户有责任妥善保管注册账号信息及账号密码的安全，因用户保管不善可能导致遭受盗号或密码失窃，责任由用户自行承担。用户需要对注册账号以及密码下的行为承担法律责任。用户同意在任何情况下不使用其他用户的账号或密码。在用户怀疑他人使用其账号或密码时，用户同意立即通知来布科技。 \n" +
      "4、用户应遵守本协议的各项条款，正确、适当地使用本服务，如因用户违反本协议中的任何条款，来布科技在通知用户后有权依据协议中断或终止对违约用户“邂逅斯年”账号提供服务。如用户后续再次注册的，迈优有权继续中断或终止对违约用户新注册的“邂逅斯年”账号提供服务。同时，来布科技保留在任何时候收回“邂逅斯年”账号、用户名的权利。 \n" +
      "5、如用户注册“邂逅斯年”账号后一年不登录，通知用户后，来布科技可以收回该账号，以免造成资源浪费，由此造成的不利后果由用户自行承担。\n" +
      "\n" +
      "七、数据储存\n" +
      "1、来布科技不对用户在本服务中相关数据的删除或储存失败负责。 \n" +
      "2、来布科技可以根据实际情况自行决定用户在本服务中数据的最长储存期限，并在服务器上为其分配数据最大存储空间等。用户可根据自己的需要自行备份本服务中的相关数据。 \n" +
      "3、如用户停止使用本服务或本服务终止，来布科技可以从服务器上永久地删除用户的数据。本服务停止、终止后，来布科技没有义务向用户返还任何数据。\n" +
      "\n" +
      "八、风险承担\n" +
      "1、用户理解并同意，“邂逅斯年”仅为用户提供信息分享、传送及获取的平台，用户必须为自己注册账号下的一切行为负责，包括用户所传送的任何内容以及由此产生的任何后果。用户应对“邂逅斯年”及本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。来布科技无法且不会对因用户行为而导致的任何损失或损害承担责任。 如果用户发现任何人违反本协议约定或以其他不当的方式使用本服务，请立即向来布科技举报或投诉，来布科技将依本协议约定进行处理。 \n" +
      "2、用户理解并同意，因业务发展需要，来布科技保留单方面对本服务的全部或部分服务内容变更、暂停、终止或撤销的权利，用户需承担此风险。\n" +
      "\n" +
      "九、知识产权声明\n" +
      "1、除本服务中涉及广告的知识产权由相应广告商享有外，来布科技在本服务中提供的内容（包括但不限于网页、文字、图片、音频、视频、图表等）的知识产权均归来布科技所有，但用户在使用本服务前对自己发布的内容已合法取得知识产权的除外。 \n" +
      "2、除另有特别声明外，来布科技提供本服务时所依托软件的著作权、专利权及其他知识产权均归来布科技所有。 \n" +
      "3、来布科技在本服务中所涉及的图形、文字或其组成，以及其他来布科技标志及产品、服务名称（以下统称“来布科技标识”），其著作权或商标权归来布科技所有。未经来布科技事先书面同意，用户不得将来布科技标识以任何方式展示或使用或作其他处理，也不得向他人表明用户有权展示、使用、或其他有权处理来布科技标识的行为。 \n" +
      "4、上述及其他任何来布科技或相关广告商依法拥有的知识产权均受到法律保护，未经来布科技或相关广告商书面许可，用户不得以任何形式进行使用或创造相关衍生作品。\n" +
      "\n" +
      "十、法律责任\n" +
      "1、如果来布科技发现或收到他人举报或投诉用户违反本协议约定的，来布科技有权不经通知随时对相关内容，包括但不限于用户资料、聊天记录进行审查、删除，并视情节轻重对违规账号处以包括但不限于警告、账号封禁 、设备封禁 、功能封禁 的处罚，且通知用户处理结果。 \n" +
      "2、因违反用户协议被封禁的用户，可以自行到 http://51marryyou.com查询封禁期限，并在封禁期限届满后自助解封。其中，被实施功能封禁的用户会在封禁期届满后自动恢复被封禁功能。被封禁用户可向来布科技网站相关页面提交申诉，来布科技将对申诉进行审查，并自行合理判断决定是否变更处罚措施。 \n" +
      "3、用户理解并同意，来布科技有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应承担由此而产生的一切法律责任。 \n" +
      "4、用户理解并同意，因用户违反本协议约定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，用户应当赔偿来布科技与合作公司、关联公司，并使之免受损害。\n" +
      "\n" +
      "十一、不可抗力及其他免责事由\n" +
      "1、用户理解并确认，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务发生中断。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行为等。出现上述情况时，来布科技将努力在第一时间与相关单位配合，及时进行修复，但是由此给用户或第三方造成的损失，来布科技及合作单位在法律允许的范围内免责。 \n" +
      "2、本服务同大多数互联网服务一样，受包括但不限于用户原因、网络服务质量、社会环境等因素的差异影响，可能受到各种安全问题的侵扰，如他人利用用户的资料，造成现实生活中的骚扰；用户下载安装的其它软件或访问的其他网站中含有“特洛伊木马”等病毒，威胁到用户的计算机信息和数据的安全，继而影响本服务的正常使用等等。用户应加强信息安全及使用者资料的保护意识，要注意加强密码保护，以免遭致损失和骚扰。 \n" +
      "3、用户理解并确认，本服务存在因不可抗力、计算机病毒或黑客攻击、系统不稳定、用户所在位置、用户关机以及其他任何技术、互联网络、通信线路原因等造成的服务中断或不能满足用户要求的风险，因此导致的用户或第三方任何损失，来布科技不承担任何责任。 \n" +
      "4、用户理解并确认，在使用本服务过程中存在来自任何他人的包括误导性的、欺骗性的、威胁性的、诽谤性的、令人反感的或非法的信息，或侵犯他人权利的匿名或冒名的信息，以及伴随该等信息的行为，因此导致的用户或第三方的任何损失，来布科技不承担任何责任。 \n" +
      "5、用户理解并确认，来布科技需要定期或不定期地对“邂逅斯年”平台或相关的设备进行检修或者维护，如因此类情况而造成服务在合理时间内的中断，来布科技无需为此承担任何责任，但来布科技应事先进行通告。 \n" +
      "6、来布科技依据法律法规、本协议约定获得处理违法违规或违约内容的权利，该权利不构成来布科技的义务或承诺，来布科技不能保证及时发现违法违规或违约行为或进行相应处理。 \n" +
      "7、用户理解并确认，对于来布科技向用户提供的下列产品或者服务的质量缺陷及其引发的任何损失，来布科技无需承担任何责任：\n" +
      "(1) 来布科技向用户免费提供的服务； \n" +
      "(2) 来布科技向用户赠送的任何产品或者服务。\n" +
      "\n" +
      "8、用户理解并确认，来布科技会尽最大努力认真审核用户提交的所有认证资料，但由于是人工审核，不能保证每一个用户信息都是真实可靠的，仍需要用户在使用中自主鉴定其他用户的真实性。此外，用户需提交真实可靠的认证信息，由于用户造假所造成任何直接或间接问题，后果由该用户自己承担。 \n" +
      "9、在任何情况下，来布科技均不对任何间接性、后果性、惩罚性、偶然性、特殊性或刑罚性的损害，包括因用户使用“邂逅斯年”或本服务而遭受的利润损失，承担责任（即使来布科技已被告知该等损失的可能性亦然）。尽管本协议中可能含有相悖的规定，来布科技对用户承担的全部责任，无论因何原因或何种行为方式，始终不超过用户因使用来布科技提供的服务而支付给来布科技的费用(如有)。\n" +
      "\n" +
      "十二、服务的变更、中断、终止\n" +
      "1、鉴于网络服务的特殊性，用户同意来布科技有权随时变更、中断或终止部分或全部的服务（包括收费服务）。来布科技变更、中断或终止的服务，来布科技应当在变更、中断或终止之前通知用户，并应向受影响的用户提供等值的替代性的服务；如用户不愿意接受替代性的服务，如果该用户已经向来布科技支付的邂逅斯年币，来布科技应当按照该用户实际使用服务的情况扣除相应邂逅斯年币之后将剩余的邂逅斯年币退还用户的邂逅斯年币账户中。 \n" +
      "2、如发生下列任何一种情形，来布科技有权变更、中断或终止向用户提供的免费服务或收费服务，而无需对用户或任何第三方承担任何责任：\n" +
      "(1) 根据法律规定用户应提交真实信息，而用户提供的个人资料不真实、或与注册时信息不一致又未能提供合理证明； \n" +
      "(2) 用户违反相关法律法规或本协议的约定； \n" +
      "(3) 按照法律规定或有权机关的要求； \n" +
      "(4) 出于安全的原因或其他必要的情形。\n" +
      "\n" +
      "十三、服务说明与免责条款\n" +
      "1、“邂逅斯年”仅保证用户的个人信息在认证阶段时的真实性，但不保证时效性，对于用户的个人素养“邂逅斯年”也不担保，所有用户在使用产品功能进行聊天交友时需自己判断对方用户的个人品德等，做好自我防护，对于因用户个人品行等问题造成的后果将由用户自己承担。\n" +
      "\n" +
      "十四、其他\n" +
      "1、来布科技郑重提醒用户注意本协议中免除来布科技责任和限制用户权利的条款，请用户仔细阅读，自主考虑风险。未成年人应在法定监护人的陪同下阅读本协议。 \n" +
      "2、本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和来布科技之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交来布科技住所地有管辖权的人民法院管辖。 \n" +
      "3、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。\n" +
      "杭州来布科技有限公司\n";
    this.alertCtrl.create({
      subTitle:"邂逅斯年协议",
      message: protocol,
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 返回信息
   * @param {string} subTitle
   */
  backMessage() {
    let prompt = "婚姻是件严肃的事情，需要认真对待，您确定要放弃吗？";
    this.alertCtrl.create({
      subTitle: prompt,
      buttons: [
        {
          text:'狠心放弃',
          handler:()=>{
            clearInterval(this.timer);
            this.changeDetectorRef.detach();
            this.navCtrl.pop();
          }
        },
        {
          text:'再考虑一下'
        }
      ]
    }).present();
  }


  //password类型
  public pasType="password";
  showPas(){
    console.log("change");
    if(this.pasType=="password"){
      this.pasType="text";
    }else{
      this.pasType="password";
    }
  }
}
