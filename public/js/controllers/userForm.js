function UserFormCtrl($scope){
    $scope.password='';
    $scope.$watch('password', function(val){
        $scope.cause = '';
        var el = $scope.userForm.pwd;
        if(val.length<4){
            el.$setValidity(false)
            $scope.cause += "Size"
        }
        if(!/\d+/.test(val)){
            $scope.cause += " Digits"
        }
        if(!/[A-z]/.test(val)){
            $scope.cause += " letters"
        }
        if($scope.cause==''){
            el.$setValidity('', true)
        }
    })
}