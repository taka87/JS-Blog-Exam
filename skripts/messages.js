function startApp() {
    sessionStorage.clear(); // Clear user auth data

    showHideMenuLinks();

    showView('viewAppHome');

    // Bind the navigation menu links
    $("#linkMenuAppHome").click(showHomeView);
    $("#linkMenuLogin").click(showLoginView);
    $("#linkMenuRegister").click(showRegisterView);

    $("#linkMenuUserHome").click(showUserHome);
    $("#linkUserHomeMyMessages").click(showMyMessages);
    $("#linkUserHomeSendMessage").click(showArchiveSent);
    $("#linkUserHomeArchiveSent").click(showSendMessage);
    $("#linkMenuLogout").click(logoutUser);


    // Bind the form submit buttons
    $("#formLogin").submit(loginUser);
    $("#formRegister").submit(registerUser);
    $("#formSendMessage input[type='submit']").click(createMessage);
    //$("#buttonEditBook").click(editBook); //todo za delete message

    // Bind the info / error boxes: hide on click
    //$("#infoBox, #errorBox").click(function() {
    //    $(this).fadeOut();
    //});

    //2h 25 min

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_HkJGZY97e";
    const kinveyAppSecret = "b2cb915299ea4ce5b7d7d3e724137295";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };



    function showHideMenuLinks(){
        //skrii vsichki sekcii
        $("#menu a").hide();
        if (sessionStorage.getItem('authToken')) {
            //with user
            //$("#linkMenuAppHome").show();
            $("#linkMenuUserHome").show();
            $("#linkMenuMyMessages").show();
            $("#linkMenuArchiveSent").show();
            $("#linkMenuSendMessage").show();
            $("#linkMenuLogout").show();
        }else{
            //no user
            $("#linkMenuAppHome").show();
            $("#linkMenuLogin").show();
            $("#linkMenuRegister").show();
        }
    }

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
    }

    function showHomeView() {
        showView('viewAppHome');
    }

    function loginUser(event){
        event.preventDefault();
        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=password]').val()
        };

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            data: JSON.stringify(userData),
            contentType: "application/json",
            headers: kinveyAppAuthHeaders,
            success: loginUserSuccess,
            error: handleAjaxError
        });

        function loginUserSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks(); //!!!
            showInfo('Login successful.');
        }

        //alert(userData);
    }

    function showLoginView() {
        showView('viewLogin');
        $('#formLogin').trigger('reset');
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister');
    }

    function registerUser(event) {
        event.preventDefault();
        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=password]').val(),
            name: $('#formRegister input[name=name]').val()
        };

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
            data: JSON.stringify(userData),
            contentType: "application/json",
            headers: kinveyAppAuthHeaders,
            success: registerSuccess,
            error: handleAjaxError
        });

        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks(); //!!!
            showInfo('User registration successful.');
        }

        //alert(userData);
    }

    function saveAuthInSession(userInfo){
        sessionStorage.setItem("username", userInfo.username);
        sessionStorage.setItem("authToken", userInfo._kmd.authtoken);
        $("#spanMenuLoggedInUser").text("Welcome, " + userInfo.username);
        showView('viewUserHome'); // ne e testvano raboti li
    }

    function handleAjaxError(response) {

        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
           errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
           response.responseJSON.description)
           errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }


    function showUserHome() {
        showView('viewUserHome');
        $('#viewUserHome').trigger('reset');
    }

    function showMyMessages(){

    }

    function showArchiveSent(){
            $('#sentMessages').trigger('reset'); //#sendMessages ne e qsno dali raboti za sega zahstoto tam e form a tuk nqma form
            showView('viewArchiveSent'); //pokazvame stranicata
    }

    function showSendMessage(){

    }

    function logoutUser() {
        sessionStorage.clear();
        $('#spanMenuLoggedInUser').text("");
        showHideMenuLinks();
        showView('viewAppHome');
        showInfo('Logout successful.');
    }

    function createMessage(){

    }

    function TODO(){

    }
}
