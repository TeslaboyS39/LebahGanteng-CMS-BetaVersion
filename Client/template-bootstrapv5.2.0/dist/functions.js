function doLogin() {
  // proses ambil value dari form login
  const email = $("#login-email").val();
  const password = $("#login-password").val();

  $.ajax(`${BASE_URL}/login`, {
    method: "POST",
    data: {
      email,
      password,
    },
  })
    .done((response) => {
      // console.log(response);
      // proses penyimpanan access_token di local storage
      localStorage.setItem("access_token", response.access_token);
      $("#login-section").hide();
      $("#home-section").show();
      $("#dashboard-section").show();
      $("#product-section").hide();
      $("#new-product-section").hide();
      $("#category-section").hide();
      $("#new-category-section").hide();

      $("#nav-dashboard").addClass("active");

      // console.log(response);
      localStorage.setItem("registered_username", response.userName);
      $("#username").text(` ${response.userName} !`);

      fetchDataDashboard();
      Swal.fire("Login Success!", "Welcome to our moviesDB site", "success");
    })
    .fail((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.responseJSON.message,
      });
      // console.log(err.responseJSON.message);
    });
}

function fetchDataMovies() {
  $.ajax(`${BASE_URL}/movies`, {
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((data) => {
      // console.log(data)
      let htmlReplace = "";

      data.forEach((el, index) => {
        htmlReplace += `
          <tr style="text-align: center;">
              <td scope="row">${index + 1}</td>
              <td class="fw-bold">${el.title}</td>
              <td>
                <img
                  src="${el.imageUrl}"
                />
              </td>
              <td>${el.synopsis}</td>
              <td>⭐${el.rating}/10</td>
              <td class="fw-bold"><a href="${
                el.trailerUrl
              }" target="_blank">Watch Trailer</a></td>
              <td>${el.Genre.name}</td>
              <td>${el.User.userName}</td>
              <td>
                <a href="" class="ms-3 delete-movie-btn" data-movie-id="${
                  el.id
                }"
                  ><span
                    class="icon material-symbols-outlined text-danger"
                    >delete</span
                  ></a
                >
              </td>
            </tr>
          `;
      });
      $("#table-product").html(htmlReplace);
    })
    .fail((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.responseJSON.message,
      });
      // console.log(err.responseJSON.message);
    });
}

function fetchDataGenres() {
  $.ajax(`${BASE_URL}/genres`, {
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((data) => {
      // console.log(data)
      genres = data;
      let htmlReplace = "";

      data.forEach((el, index) => {
        htmlReplace += `
              <tr>
                  <td scope="row">${index + 1}</td>
                  <td class="fw-bold">${el.name}</td>
                  <td>
                    <a href="" class="ms-3"
                      ><span
                        class="icon material-symbols-outlined text-danger"
                        >delete</span
                      ></a
                    >
                  </td>
                </tr>
              `;
      });
      $("#table-category").html(htmlReplace);
    })
    .fail((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.responseJSON.message,
      });
      // console.log(err.responseJSON.message);
    });
}

function fetchDataDashboard() {
  $.ajax(`${BASE_URL}/movies`, {
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((data) => {
      const totalMovies = data.length;
      $("#total-product").text(totalMovies);
    })
    .fail((err) => {
      console.log(err.responseJSON.message);
    });

  $.ajax(`${BASE_URL}/genres`, {
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((data) => {
      const totalGenres = data.length;
      $("#total-category").text(totalGenres);
    })
    .fail((err) => {
      console.log(err.responseJSON.message);
    });
}

function deleteMovie(movieId) {
  $.ajax({
    url: `${BASE_URL}/movies/${movieId}`,
    method: "DELETE",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done(() => {
      console.log("Movie deleted successfully");
      fetchDataMovies();
      Swal.fire(
        "Delete movie success!",
        "Dont forget to delete movie with responsibility",
        "success"
      );
    })
    .fail((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.responseJSON.message,
      });
      // console.log(err.responseJSON.message);
    });
}

function fetchGenresForDropdown() {
  $.ajax(`${BASE_URL}/genres`, {
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((data) => {
      genres = data
      let dropdownOptions = `
                    <option value="" selected disabled>
                            -- Select Genre --
                    </option>
                    `;
      data.forEach((genre) => {
        dropdownOptions += `<option value="${genre.id}">${genre.name}</option>`;
      });
      $("#product-category").html(dropdownOptions);
    })
    .fail((err) => {
      console.log(err.responseJSON.message);
    });
}

function doLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("registered_username");

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this! and probably regretting this decision in rest of your life!",
    icon: "warning",
    showCancelButton: false,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, just log out...duh!",
  }).then((result) => {
    if (result.isConfirmed) {
      $("#login-section").show();
      $("#home-section").hide();
      $("#dashboard-section").hide();
      $("#product-section").hide();
      $("#new-product-section").hide();
      $("#category-section").hide();
      $("#new-category-section").hide();

      $("#register-username").val("");
      $("#register-email").val("");
      $("#register-password").val("");
      $("#register-phone").val("");
      $("#register-address").val("");
    }
  });
}