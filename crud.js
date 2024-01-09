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
// Create a full CRUD application of your choice using an API or JSON Server.
// used JSON server to create array of watchlists with properties for user to update ✅
// Use JQuery/AJAX to interact with the API.
// Use a form to post new entities.
// Build a way for users to update or delete entities.
// Include a way to get entities from the API.
// Use Bootstrap and CSS to style your project.

// const declaration for url
const url = "http://localhost:3000/watchlistArray";

// test to see if get is set up correctly
$.get(url).then((data) => console.log(data));
// transfer watchlist array information into cards and each shows array into each card
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
    for (let i = 0; i < watchlist.shows.length; i++) {
      $(".card-body").append(
        $(html`
          <ul class="list-group list-group-flush">
            <li class="list-group-item bg-dark text-light">
              ${watchlist.shows[i].name}
              <button
                class="btn btn-outline-light"
                onclick="deleteShow(${watchlist.shows[i]})"
              >
                🗑️
              </button>
              <ul class="list-group list-group-flush">
                <li id="showInfo" class="list-group-item bg-dark">
                  Type: ${watchlist.shows[i].type} <br />
                  Where to Stream: ${watchlist.shows[i].streamingService} <br />
                  Genre: ${watchlist.shows[i].genre}
                </li>
              </ul>
            </li>
          </ul>
        `)
      );
    }
  });
});

// create event listener for create new watchlist button
$("#createWatchlist").on("click", function (e) {
  console.log("creating watchlist", $("#firstShow").val());
  // prevent button from reloading page by default
  e.preventDefault();
  $.ajax({
    url: url,
    dataType: "json",
    data: JSON.stringify({
      listName: $("#listName").val(),
      shows: [
        {
          name: $("#firstShow").val(),
          type: $("#mediaType").val(),
          streamingService: $("#streamingService").val(),
          genre: $("#genre").val(),
        },
      ],
    }), //house is converted into a string
    contentType: "application/json",
    type: "POST",
  });
});

// function to UPDATE watchlist name
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

// function to delete entire watchlist
function deleteWatchlist(id) {
  $.ajax(`${url}/${id}`, {
    method: "DELETE",
  });
}

// function to delete show from watchlist
// use index of shows array within given watchlist
function deleteShow(show) {
  $.ajax(`${url}/${show}`, {
    method: "DELETE",
  });
}

// function to update shows array
function addShows(id) {
  console.log("Adding shows...", id);
  $.ajax(`${url}/${id}`, {
    method: "PUT",
    data: {
      shows: {
        name: $("#newShow").val(),
        type: $("#newType").val(),
        streamingService: $("#newStreamingService").val(),
        genre: $("#newGenre").val(),
      },
    },
  });
}
