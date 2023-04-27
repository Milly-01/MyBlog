function Google_signIn(response) {
    const responsePayload = decodeJwtResponse(response.credential);

    // console.log("ID: " + responsePayload.sub);
    // console.log("Full Name: " + responsePayload.name);
    // console.log("Given Name: " + responsePayload.given_name);
    // console.log("Family Name: " + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    // console.log("Email: " + responsePayload.email);

    document.querySelector("#name").innerHTML =  responsePayload.name;
    document.querySelector("#email").innerHTML =  responsePayload.email;


    document.querySelector(".comment-section2").style.display = "block";
    document.querySelector("#email2").value =  responsePayload.email;
    document.querySelector("#myimage2").value = responsePayload.picture;
    document.querySelector("#myname2").value = responsePayload.name;
}

function decodeJwtResponse(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        atob(base64)
        .split("")
        .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
}
