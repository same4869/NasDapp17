var GaokaoItems = function () {
    LocalContractStorage.defineMapProperty(this, "gaokaoItems", {
        parse: function (text) {
            return new GaokaoItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });
    LocalContractStorage.defineProperty(this, "size");
};

var GaokaoItem = function(text){
    if(text){
       var obj = JSON.parse(text);
       this.from = obj.from;
       this.name = obj.name;
       this.school = obj.school;
       this.msg = obj.msg;
    }
};

GaokaoItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};

GaokaoItems.prototype ={
    init:function(){
        this.size = 0
    },

    addANewGaokaoItem:function(name,school,msg){
        var from = Blockchain.transaction.from;

        var id = this.size;
        var gaokaoItem = this.gaokaoItems.get(id);
        if (!gaokaoItem) {
            gaokaoItem = {};
            gaokaoItem.from = from;
            gaokaoItem.name = name;
            gaokaoItem.school = school;
            gaokaoItem.msg = msg;
            this.size += 1
            LocalContractStorage.set("size", this.size);
        }

        this.gaokaoItems.put(id,gaokaoItem);
    },

    getGaokaoItemById:function(id){
        if(!id){
            throw new Error("没查到这个玩家")
        }
        return this.gaokaoItems.get(id);
    },

    getGaokaoItemInfos:function(){
        this.size = LocalContractStorage.get("size", this.size);
        var info = []
        for(var i = 0; i < this.size; i++){
            info.push(this.gaokaoItems.get(i))
        }
        return info;
    }
}

module.exports = GaokaoItems;

