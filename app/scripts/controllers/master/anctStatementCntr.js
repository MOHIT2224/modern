app.controller('anctStatementCntr', function ($scope, $http, $filter, sessionService, loginService, $interval,$stateParams) {
   
    var columnDefs = [
             
        { headerName: "Date", width: 100, field: "Sdate", cellClass: function (params) { return (params.data.isBack == '1' ? 'lay-head' : 'back-head'); } },
        { headerName: "UserName", width: 100, field: "mstrUserId", cellClass: function (params) { return (params.data.isBack == '1' ? 'lay-head' : 'back-head'); } },
        { headerName: "Chips", width: 100, field: "Chips", cellClass: function (params) { return (params.data.isBack == '1' ? 'lay-head' : 'back-head'); } },
        { headerName: "Narration", width: 500, field: "Narration", cellClass: function (params) { return (params.data.isBack == '1' ? 'lay-head' : 'back-head'); } },
        { headerName: "Credit", width: 100, field: "Credit", cellClass: function (params) { return (params.data.isBack == '1' ? 'lay-head' : 'back-head'); } },
        { headerName: "Debit", width: 130, field: "Debit", cellClass: function (params) { return (params.data.isBack == '1' ? 'lay-head' : 'back-head'); } },
        { headerName: "Balance", width: 130, field: "Balance", cellClass: function (params) { return (params.data.isBack == '1' ? 'lay-head' : 'back-head'); } },
        
    ];
   
    /*function GetOddsName(params) {
        if (params.data.OddValue==0) {
             return "DOWN[Back]";
        }else{
             return "UP[Lay]";
        }
       // return thisYear - params.data.OddValue + params.data.age;
    }*/
    var gridOptions = {
        // note - we do not set 'virtualPaging' here, so the grid knows we are doing standard paging
        enableSorting: true,
        enableFilter: true,
        debug: true,
        rowSelection: 'multiple',
        enableColResize: true,
        paginationPageSize: 500,
        columnDefs: columnDefs,
        pagination: 'true',
        onGridReady: function () {
            //gridOptions.api.sizeColumnsToFit();
        }
    };
    function onPageSizeChanged(newPageSize) {
        this.gridOptions.paginationPageSize = new Number(newPageSize);
        createNewDatasource();
    }
    var allOfTheData;
    function createNewDatasource() {
        if (!allOfTheData) {return;}
        var dataSource = {
            //rowCount: ???, - not setting the row count, infinite paging will be used
            getRows: function (params) {
                // this code should contact the server for rows. however for the purposes of the demo,
                // the data is generated locally, a timer is used to give the experience of
                // an asynchronous call
                //console.log('asking for ' + params.startRow + ' to ' + params.endRow);
                setTimeout(function () {
                    var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                    var lastRow = -1;
                    if (allOfTheData.length <= params.endRow) {
                        lastRow = allOfTheData.length;
                    }
                    params.successCallback(rowsThisPage, lastRow);
                }, 500);
            }
        };
        var s = gridOptions.api.setDatasource(dataSource);
        //gridOptions.api.sizeColumnsToFit(s);
    }

    function autoSizeAll() {
        var allColumnIds = [];
        columnDefs.forEach(function (columnDef) {
            allColumnIds.push(columnDef.field);
        });
        gridOptions.columnApi.autoSizeColumns(allColumnIds);
    }

    function setRowData(rowData) {
        allOfTheData = rowData;
        createNewDatasource();
    }
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    $scope.loading=true;
    $scope.GetLeger=function(){
        $http.get('Betentrycntr/AcStatement/' + $stateParams.userId).success(function (data, status, headers, config) {
            $scope.loading=false;
            $scope.BetHistory = data.BetHistory;
            
            gridOptions.api.setRowData(data.BetHistory);
            //gridOptions.api.sizeColumnsToFit();
            $scope.SumOfP_L = $scope.sum($scope.BetHistory, 'Chips');
            $scope.SumOfProfit = $scope.sum($scope.BetHistory, 'Credit');
            $scope.SumOfLiability = $scope.sum($scope.BetHistory, 'Debit'); 
        });  
    }
    $scope.GetLeger();
    
    $scope.sum = function(items, prop){
        
        return items.reduce( function(a, b){
             
             if (b[prop]==null || b[prop]=="") b[prop]=0;            
                return parseFloat(a) + parseFloat(b[prop]);
        }, 0);
    };
    $scope.onBtExport = function () {
        var params = {
            skipHeader: false,
            skipFooters: true,
            skipGroups: true,
            fileName: "BetHistory.csv"
        };
        gridOptions.api.exportDataAsCsv(params);
    }
});
