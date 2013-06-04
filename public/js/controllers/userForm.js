function UserFormCtrl($scope){
    $scope.password='';
    $scope.$watch('password', function(val){
        $scope.cause = '';
        if(!val)
            return;

        var el = $scope.userForm.pwd;
        if(val.length<4){
            el.$setValidity(false)
            $scope.cause += "Size no less than 4 chars, "
        }
        if(!/\d+/.test(val)){
            $scope.cause += " at least 1 Digit"
        }
        if(!/[A-z]/.test(val)){
            $scope.cause += " at least 1 letter"
        }
        if($scope.cause==''){
            el.$setValidity('', true)
        }
    })
}