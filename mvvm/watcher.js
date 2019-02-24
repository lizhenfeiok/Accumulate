


//部门
function Department(){
    this.noticers = [];
}

Department.prototype = {
    addNoticer:function(noticer){
        this.noticers.push(noticer);
    },
    notify:function(){
        this.noticers.forEach(noticer=>noticer.toNotice());
    }
}

//创建部门
function buildDeparts(seller){

    Object.keys(seller).forEach(function(product){

        buildByEachProduct(seller,product);

    });

    function buildByEachProduct(seller,product){
        var depart = new Department();
        var msg  = seller[product];
    
        Object.defineProperty(seller,product,{
            //每个部门招聘自己的通知员
            get:function(){
                if(Department.target){
                    depart.addNoticer(Department.target);
                }
                return msg;
            },
            //找见部门，通知变化
            set:function(newMsg){
                msg = newMsg;
                depart.notify();
            }      
        });
    }
}


//通知员
function Noticer(seller,product,notice){
    this.seller = seller;
    this.product = product;
    this.notice = notice;

    Department.target = this;
    this.msg = seller[product];
    Department.target = null;
}

Noticer.prototype = {
    toNotice:function(){
        var newMsg = this.seller[this.product];
        this.notice(newMsg,this.msg);
        this.msg = newMsg;
    }
}

function Connect(options){
    var seller = this.seller = options.seller;
    var customs = this.customs = options.customs;

    //根据卖家建立通知部门
    buildDeparts(seller);

    //如果有买家
    if(customs){
        Object.keys(customs).forEach(function(product){
            var notices = customs[product];
            notices.forEach(function(notice){
                new Noticer(seller,product,notice);
            });
        })
    }

}

var farm = {"西红柿":"3","土豆":"6"};
new Connect({
    //卖家
    seller:farm,
    //买家
    customs:{
        "西红柿":[function(newMsg,oldMsg){
            console.log("西红柿以前 是:"+oldMsg+"块,现在是 :"+newMsg+"块");
        },function(newMsg,oldMsg){
            console.log("西红柿炒鸡蛋以前是："+(+oldMsg+10)+"块,现在是："+(+newMsg+10)+"块")
        }],
        "土豆":[function(newMsg,oldMsg){
            console.log("土豆以前是 :"+oldMsg+"块,现在是:"+newMsg+"块");
        }]
    }
})

console.log("过了一年之后....")
farm["西红柿"] = "10";
farm["土豆"] = "19"
console.log("过了十年之后....")
farm["西红柿"] = "100";
farm["土豆"] = "190"


var restaurant = {"炒饼":"50元","面条":"20元"};
new Connect({
    //卖家
    seller:restaurant,
    //买家
    customs:{
        "炒饼":[function(newMsg,oldMsg){
            console.log("炒饼以前 是:"+oldMsg+"块,现在是 :"+newMsg+"块");
        }],
        "面条":[function(newMsg,oldMsg){
            console.log("土豆以前是 :"+oldMsg+"块,现在是:"+newMsg+"块");
        },function(newMsg,oldMsg){
            console.log("这么贵，竟然要 "+newMsg)
        }]
    }
})


console.log("过了一年之后....")
restaurant["炒饼"] = "1002";
restaurant["面条"] = "1900"
console.log("过了十年之后....")
restaurant["炒饼"] = "100000";
restaurant["面条"] = "190000"
