/* 
   lit-html snippet - Begin
   Add to the top of your code. Works with html or jsx!
   Formats html in a template literal  using the lit-html library 
   Syntax: html`<div> html or jsx here! ${variable} </div>`
*/
//lit-html snippet - Begin

let html = (strings, ...values) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
//lit-html snippet - End

// OBJECTIVES
// Create a full CRUD application of your choice using an API or JSON Server. ✅
// used JSON server to create array of watchlists with properties for user to update ✅
// Use JQuery/AJAX to interact with the API. ✅
// Use a form to post new entities. ✅
// Build a way for users to update or delete entities. ✅
// Include a way to get entities from the API. ✅
// Use Bootstrap and CSS to style your project. ✅

// const declaration for url
const url = "http://localhost:3000/watchlistArray";

// test to see if get is set up correctly ✅
$.get(url).then((data) => console.log(data));
// transfer watchlist array information into cards and each shows array into each card ✅
$.get(url).then((data) => {
  console.log("getting data", data);
  data.map((watchlist) => {
    $(".card").append(
      $(html`
        <div class="card-body border border-secondary rounded-2">
          <h6 class="text-end">Watchlist ${watchlist.id}</h6>
          <h5 class="card-title">
            ${watchlist.listName}
            <button
              class="btn btn-outline-light"
              onclick="deleteWatchlist(${watchlist.id})"
            >
              🗑️
            </button>
            <a
              href="#listId"
              class="btn btn-outline-danger"
              id="editBtn"
              role="button"
              >Edit Name</a
            >
          </h5>
          <form class="text-left form-control bg-dark border border-secondary">
            <label class="text-light" for="newShow"
              >Add Show to ${watchlist.listName}</label
            >
            <input id="newShow" placeholder="Enter new show name" />
            <button
              id="addShow"
              class="btn btn-outline-success"
              onclick="addShows(${watchlist.id})"
            >
              Add
            </button>
          </form>
        </div>
      `)
    );

    // for every show in a given watchlist, create html elements inside card body to hold show info
    for (let i = 0; i < watchlist.shows.length; i++) {
      $(".card-body").append(
        $(html`
          <ul class="list-group list-group-flush">
            <li class="list-group-item bg-dark text-light">
              ${watchlist.shows[i].name}
              <button
                class="btn btn-outline-light"
                onclick="deleteShow(${watchlist.shows[i].id})"
              >🗑️
              </button>
              <ul class="list-group list-group-flush">
                <li id="showInfo" class="list-group-item bg-dark">
                  Type: <span id="mediaType" contenteditable="true"></span> ${watchlist.shows[i].type} <br />
                  Where to Stream: <span id="streamingService" contenteditable="true"></span> ${watchlist.shows[i].streamingService} <br />
                  Genre: <span id="genre" contenteditable="true"></span> ${watchlist.shows[i].genre} <br />
                  <button class="btn btn-sm btn-outline-light text-secondary mt-3" id="doneEditing">Done Editing</button>
              </ul>
            </li>
          </ul>
        `)
      );
    }
  });
});

// post input values into json shows properties on click of editing button
$(document).on("click", "#doneEditing", function(e) {
  e.preventDefault();
  // want to hide the button when user is done editing
  $('#doneEditing').hide();
  // take inner html that user edits to post to db json
  $.ajax({
    url: url,
    dataType: "json",
    data: {
      listName: $("#listName").val(),
      shows: [
        {
          name: $("#firstShow").val(),
          type: $("#mediaType").html(),
          streamingService: $("#streamingService").html(),
          genre: $("#genre").html(),
        },
      ],
    },
    contentType: "application/json",
    type: "PUT",
    // button is hidden upon clicking however put request returns 400 error: bad request ⛔
  });
});

// create event listener for create new watchlist button
$("#createWatchlist").on("click", function (e) {
  console.log("creating watchlist", $("#firstShow").val());
  // prevent button from reloading page by default
  e.preventDefault();
  // post info to card for viewing/editing ✅
  $.ajax({
    url: url,
    dataType: "json",
    // convert data into string to properly post
    data: JSON.stringify({
      listName: $("#listName").val(),
      shows: [
        {
          name: $("#firstShow").val(),
          type: "",
          streamingService: "",
          genre: "",
        },
      ],
    }), 
    contentType: "application/json",
    type: "POST",
  });
});

// function to UPDATE watchlist name
// correctly updaates list name ✅ but clears all of the watchlists below it/hides them? ⛔
function updateListName(e) {
  console.log(e);
  e.preventDefault();
  let id = $("#listId").val();
  $.ajax(`${url}/${id}`, {
    method: "PUT",
    data: {
      listName: $("#updateName").val(),
    },
  });
}

$("#update").on("click", updateListName);

// function to DELETE entire watchlist
function deleteWatchlist(id) {
  $.ajax(`${url}/${id}`, {
    method: "DELETE",
  });
}

// function to DELETE show from watchlist using show id 
// grabs the correct id but returns a 404 error⛔
function deleteShow(id) {
  $.ajax(`${url}/${id}`, {
    method: "DELETE",
  });
}

// function to update shows array
// using put to add info to watchlist but is replacing all existing data instead of adding it ⛔
function addShows(id) {
  console.log("Adding shows...", id);
  $.ajax({
    url: url + `/${id}`,
    dataType: "json",
    data: JSON.stringify({
      listName: $("#listName").val(),
      shows: [
        {
          name: $("#newShow").val(),
          type: "",
          streamingService: "",
          genre: "",
        },
      ],
    }), 
    contentType: "application/json",
    type: "PUT",
  });
}
