// This script is for parsing through user input on the search bar

var search_text = document.getElementById("searchBar");
var search_button = document.getElementById("searchButton");
var search_list = document.getElementById("searchList");

search_button.addEventListener("click", function(){
    var search_input = document.createElement("list");
    search_input.innerHTML = search_text.value;
    search_list.appendChild(search_input);
    search_text.value = ""; 
});