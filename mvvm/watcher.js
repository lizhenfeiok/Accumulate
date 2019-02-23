
var vm = {name:"张三",age:18}

//盒子
function Box(){
    this.items = [];
}

Box.prototype = {
    addItem:function(sub){
        this.items.push(sub);
    },
    notify:function(){
        this.items.forEach(item=>item.update());
    }
}

//定义连接器
function defineConnector(ob,prop){

    var box = new Box();
    var value = ob[prop];

    Object.defineProperty(ob,prop,{
        //新建一个盒子，收集一个一个连接器
        get:function(){
            if(Box.target){
                box.addItem(Box.target);
            }
            return value;
        },
        //找见那个盒子，触发连接器
        set:function(newVal){
            value = newVal;
            box.notify();
        }      
    })
    
}

//连接器 
function Connector(ob,prop,callback){
    this.ob = ob;
    this.prop = prop;
    this.callback = callback;

    Box.target = this;
    this.value = ob[prop];
    Box.target = null;
}

Connector.prototype = {
    update:function(){
        var newVal = this.ob[this.prop];
        this.callback(newVal,this.value);
        this.value = newVal;
    }
}


function main(ob,callbackMap){
    Object.keys(ob).forEach(function(prop){
        defineConnector(ob,prop);
        new Connector(ob,prop,callbackMap[prop]);
    })
}

main(vm,{
    name:function(newVal,oldVal){
        console.log("old name is :"+oldVal+",new name is :"+newVal);
    },
    age:function(newVal,oldVal){
        console.log("old age is :"+oldVal+",new old is :"+newVal);
    }
})

vm.name = "李四";
vm.age = "19"

vm.name = "王五";
vm.age = "20"

