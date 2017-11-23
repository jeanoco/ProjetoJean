var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope, $http){//, $q) {
    
   var orders = new DevExpress.data.CustomStore({ //Store object para permitir implementar minha logica de acesso dos dados
        load: function (loadOptions) {
            var parameters = {}; //blank object

                    
            parameters.local = 'sbvt';
            parameters.msg = 'metar';
            parameters.data_ini = '2017010100';
            parameters.data_fim = '2017010123';
            
            var config = {
                params: parameters
            };
            
            return $http.get("https://www.redemet.aer.mil.br/api/consulta_automatica/index.php", config).then(function (response) { //.then para "tornar sincrono" a busca dos dados, primeiro function = sucesso e.g   p.then(function(value) {
                                                                                                                                                                                                                            // fulfillment
                                                                                                                                                                                                                      //}, function(reason) {
                                                                                                                                                                                                                            // rejection
                                                                                                                                                                                                                      //});
            
                return { data: dataToJson(response.data), totalCount: 2 };
            }, function (response) {
                return $q.reject("Data Loading Error");
            });
        }
    });
    
    function dataToJson(dataStr){
        
        var dataJson = [];
        
        //alert(dataStr);
        
        dataStr.split('=').forEach(function(txt) {
            txt = txt.replace(/\s/g, ''); //Remove espaços
            if(txt != ''){
                var aux = 10;
                //alert(txt.substring(0,10));
                dataJson.push({
                    data: txt.substring(0,aux),
                    localidade: txt.substring(16,20),
                    horaMinuto: txt.substring(22,26),
                    dirVento: txt.substring(27,30),
                    velVento: txt.substring(30,32),
                    Pressao: txt.substring(54,59)
                });
            }
        });    
      
              
        return dataJson;
    }
    
  $scope.dataGridOptions = {  //exemplo do uso de data grid extraido de: https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/RecordPaging/AngularJS/Light/
        dataSource: {
            store: orders
        },
        remoteOperations: {
            sorting: true,
            paging: true
        },
        paging: {
            pageSize: 5
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [8, 12, 20],
            showInfo: true
        },
        columns: ["data", "localidade", "horaMinuto", "dirVento", "velVento", "Pressao"]
    };
    
    
});