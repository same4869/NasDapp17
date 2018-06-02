$(function () {
    var pageId = window.location.search.split("=")[1];
    console.log(pageId);
    var dappContactAddress;
    var serialNumber;
    var NebPay;
    var nebPay;
    var nebulas;
    dappContactAddress = "n1tUuqqCmGfoTWTr3q4BbvHeTS3yy88qxzD";
    nebulas = require("nebulas"), neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
    
    NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    nebPay = new NebPay();	
    var myneb = new Neb();
    var nasApi = myneb.api;	

    var curWallectAdd;


    function getWallectInfo() {
        console.log("getWallectInfo");
        window.addEventListener('message', getMessage);
    
        window.postMessage({
            "target": "contentscript",
            "data": {},
            "method": "getAccount",
        }, "*");
    }
    
    function getMessage(e){
        if (e.data && e.data.data) {
            console.log("e.data.data:", e.data.data)
            if (e.data.data.account) {
                var address = e.data.data.account;
                curWallectAdd = address;
                console.log("address="+address);
            }
        }
    }

    getGaokaoItemInfos();

    function getGaokaoItemInfos(){
        var from = dappContactAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "getGaokaoItemInfos";
        var callArgs = "";
        // console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
    neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;   
        console.log("getGaokaoItemInfos result : " + result);
        result = JSON.parse(result);
        var box=null;
        for(var i = 0; i < result.length; i++){
            box=$(
                '<div class="box">' +
                    '<p class="item-content">' + result[i].msg+ '</p>' +
                    '<div class="item-name">' + result[i].name+ '</div>' +
                    '<div class="item-school">' + result[i].school+ '</div>' +
                '</div>'
            );
			box.appendTo(contianer);
			box.drag();
        }
        // setItemsProperties(result);
 
    }).catch(function (err) {
        console.log("error :" + err.message);
    })
   }

   function addANewComment(nick_name,school,content){
    var to = dappContactAddress;
    var value = "0";
    var callFunction = "addANewGaokaoItem";
    var callArgs = "[\"" + nick_name + "\",\"" + school + "\",\"" + content + "\"]";
    console.log(callArgs);
    serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
            listener: function (resp) {
                try{
                    if(resp.indexOf("Transaction rejected by user") > 0){
                        alert("您拒绝了合约调用，请重试");
                    }
                }catch(e){
                    var hash = resp.txhash;
                    regetTransactionReceipt(hash, function (status) {
                        if(status == 1){
                            alert('添加成功！');
                            location.reload();
                        }else{
                            alert('添加失败，请重新提交！');
                        }
                    })
                }
                    //upadte card status into in progress...
            }
        }); 
    }

    function regetTransactionReceipt(hash, cb) {
        var task = setInterval(function () {
            getTransactionReceipt(hash, function (resp) {
//                console.log(resp)
                var status = resp.result.status;
                console.log('status:' +status)
                if(status == 1 || status == 0){
                    clearInterval(task);
                    cb(status);
                }
            })
        }, 1000);
    }

    function getTransactionReceipt(hash, cb){
        $.post('https://testnet.nebulas.io/v1/user/getTransactionReceipt', JSON.stringify({
            "hash": hash
        }), function (resp) {
            console.log(resp);
            cb(resp)
        })
    }

    getWallectInfo();
    
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        // modal.find('.modal-title').text('New message to ' + recipient)
        // modal.find('.modal-body input').val(recipient)
      })

      $("#submit_contents").on("click", function(event) {
        var nick_name = $("#nick-name").val();
        var school = $("#school-text").val();
        var content = $("#content-text").val();;
        if(nick_name && school && content) {
            $("#nick_name").css("border-color","#ced4da");
            $("#school-text").css("border-color","#ced4da");
            $("#content-text").css("border-color","#ced4da");
            addANewComment(nick_name,school,content);
        } else if (!nick_name) {
            $("#nick-name").css("border-color","red");
        }else if (!school) {
            $("#school-text").css("border-color","red");
        }else if (!content) {
            $("#content-text").css("border-color","red");
        }
        
    });
})