const apiUrl = (page) => {
  return `https://pokeapi.co/api/v2/pokemon/?offset=${page}&limit=131`;
};

const pokemonRepository = (() => {
  let pokemonList = [];

  async function loadList(api, page = 0) {
    $("#loader").show();

    if ($(".pokeCard")) {
      $(".pokeCard").remove();
    }

    let fetchedData = await (await fetch(api)).json();
    const pokeList = fetchedData.results;

    pokeList.map(async (pokemon) => {
      try {
        pokemonList.push(await (await fetch(pokemon.url)).json());
      } catch (err) {
        console.log(err);
        pokemonList.push({});
      }

      new Promise((res, rej) => {
        res(pokemonList);
      })
        .then((data) => {
          if (data.length >= page + 131) {
            if (data === null) return;
            console.log(data);
            const sorted = data.sort((a, b) => a.id - b.id);
            const list = [...new Set(sorted.map(JSON.stringify))].map(
              JSON.parse
            );
            list.map((item) => addListItem(item));
          }
        })
        .then(() => {
          setTimeout(() => {
            $("#loader").hide();
          }, 2000);
        });
    });
  }

  function addListItem(pokemon) {
    if (pokemon.id) {
      console.log("count");
      const pokerow = $(".pokerow");
      const pokeCard = document.createElement("button");
      const imgContainer = document.createElement("div");
      const pokeImg = document.createElement("img");
      const pokeName = document.createElement("div");

      let hp;
      let attack;
      let defense;
      let speed;
      const types = pokemon.types
        ? pokemon.types.map((item) => item.type.name)
        : null;

      if (!pokemon.stats) {
        hp = "N/A";
        attack = "N/A";
        defense = "N/A";
        speed = "N/A";
      } else {
        hp = pokemon.stats[0].base_stat;
        attack = pokemon.stats[1].base_stat;
        defense = pokemon.stats[2].base_stat;
        speed = pokemon.stats[5].base_stat;
      }

      // Defining background color of each Pokemon card with their types
      const color = () => {
        if ($.inArray("fire", types) !== -1) {
          return "#FA5543";
        }
        if ($.inArray("poison", types) !== -1) {
          return "#A65B9E";
        }
        if ($.inArray("psychic", types) !== -1) {
          return "#FA65B5";
        }
        if ($.inArray("grass", types) !== -1) {
          return "#8CD851";
        }
        if ($.inArray("ground", types) !== -1) {
          return "#E8C755";
        }
        if ($.inArray("ice", types) !== -1) {
          return "#96F1FF";
        }
        if ($.inArray("rock", types) !== -1) {
          return "#CDBC72";
        }
        if ($.inArray("dragon", types) !== -1) {
          return "#8874FF";
        }
        if ($.inArray("water", types) !== -1) {
          return "#56AEFF";
        }
        if ($.inArray("bug", types) !== -1) {
          return "#C2D120";
        }
        if ($.inArray("dark", types) !== -1) {
          return "#8A6955";
        }
        if ($.inArray("fighting", types) !== -1) {
          return "#A75544";
        }
        if ($.inArray("ghost", types) !== -1) {
          return "#7874D4";
        }
        if ($.inArray("steel", types) !== -1) {
          return "#C4C2DB";
        }
        if ($.inArray("flying", types) !== -1) {
          return "#79A4FF";
        }
        if ($.inArray("electric", types) !== -1) {
          return "#FDE53C";
        }
        if ($.inArray("fairy", types) !== -1) {
          return "#F9AEFF";
        }
      };

      $(pokeCard).addClass("pokeCard btn");
      $(pokeCard).attr("type", "button");
      $(pokeCard).attr("data-name", pokemon.name);
      $(pokeCard).attr(
        "data-bigImg",
        pokemon.sprites.other.dream_world.front_default
          ? pokemon.sprites.other.dream_world.front_default
          : pokemon.sprites.front_default
      );
      $(pokeCard).attr("data-height", pokemon.height);
      $(pokeCard).attr("data-weight", pokemon.weight);
      $(pokeCard).attr("data-types", types);
      $(pokeCard).attr("data-id", pokemon.id);
      $(pokeCard).attr("data-hp", hp);
      $(pokeCard).attr("data-attack", attack);
      $(pokeCard).attr("data-defense", defense);
      $(pokeCard).attr("data-speed", speed);
      $(pokeCard).attr("data-bgColor", color());

      $(pokeCard).css("background-color", color());

      $(imgContainer).addClass("imgContainer");
      $(imgContainer).attr("alt", `${pokemon.name}'s image`);

      $(pokeImg).addClass("pokeImg img-fluid");
      $(pokeImg).attr("src", pokemon.sprites.front_default);
      $(pokeImg).attr("alt", pokemon.name);

      $(pokeName).addClass("pokeName text-center text-wrap");
      $(pokeName).html(pokemon.name);

      $(pokeCard).append(imgContainer);
      $(imgContainer).append(pokeImg);
      $(pokeCard).append(pokeName);
      $(pokerow).append(pokeCard);

      $(window).mouseenter(() => {
        $(".pokeImg")
          .mouseenter((e) => {
            $(e.target).addClass("animate__heartBeat");
          })
          .mouseleave((e) => {
            $(e.target).removeClass("animate__heartBeat");
          });
      });
    }
  }

  function createModal(data) {
    $(".modal_id").text(`#${data.id}`);
    $(".profile_height").text(`${(data.height * 0.1).toFixed(1)}M`);
    $(".profile_weight").text(`${(data.weight * 0.1).toFixed()}KG`);
    $(".stats_hp").text(data.hp);
    $(".stats_attack").text(data.attack);
    $(".stats_defense").text(data.defense);
    $(".stats_speed").text(data.speed);
    $(".modal_img").attr("src", data.bigimg);
    $(".modal_pokeName").text(`${data.name}`);

    const types = data.types.split(",");
    types.forEach((type) => {
      $(".modal_types").append(`<li class="${type} modal_type">${type}</li>`);
    });
  }

  return {
    loadList,
    addListItem,
    createModal,
  };
})();

$(window).click((e) => {
  let clicked = e.target;
  let data;
  if (
    e.target.classList[0] == "pokeImg" ||
    e.target.classList[0] == "pokeName" ||
    e.target.classList[0] == "pokeCard" ||
    e.target.classList[0] == "imgContainer"
  ) {
    $(clicked).addClass("animate__bounceOut");
    if (clicked.nodeName == "DIV") {
      data = clicked.parentNode.dataset;
      pokemonRepository.createModal(data, clicked);
    }
    if (clicked.nodeName == "IMG") {
      data = clicked.parentNode.parentNode.dataset;
      pokemonRepository.createModal(data, clicked);
    }
    if (clicked.nodeName == "BUTTON") {
      data = clicked.dataset;
      pokemonRepository.createModal(data, clicked);
    }

    setTimeout(() => {
      $("#bsModal").modal("show");
    }, 650);

    // When modal shows
    $("#bsModal").on("show.bs.modal", function () {
      // Adding animations
      $(".modal").ready(() => {
        $(".modal_img").hide();
        $(".modal_name").hide();
        $(".modal_id").hide();
        $(".profile").hide();
        $(".stats").hide();
        $(".modal_closeBtn").hide();
        $(".modal_type").hide();

        $(".modal_type").each((index, element) => {
          setTimeout(() => {
            $(".modal_type").show();
            $(element).addClass(`animate__bounceInLeft${index}`);
          }, 1500);
        });

        setTimeout(() => {
          $(".modal_closeBtn").show();
          $(".modal_closeBtn").addClass("fadeInDown");
        }, 1000);

        setTimeout(() => {
          $(".modal_img").show();
          $(".modal_name").show();
          $(".modal_name").addClass("bounceOutDown");
          $(".modal_img").addClass("bounceInDown");
        }, 500);
        setTimeout(() => {
          $(".modal_name").hide();
          $(".modal_img").addClass("tada");
          $(".modal_id").show();
          $(".modal_id").addClass("bounceInDown");
        }, 800);
        setTimeout(() => {
          $(".modal_name").show();
          $(".modal_name").addClass("rollIn");
        }, 950);
        setTimeout(() => {
          $(".profile").show();
          $(".stats").show();
          $(".profile").addClass("fadeIn");
          $(".stats").addClass("fadeIn");
        }, 2000);
      });
    });
  }

  // When modal hides
  $("#bsModal").on("hide.bs.modal", () => {
    $(clicked).removeClass("animate__bounceOut");
    $(".modal_type").removeClass("animate__bounceInLeft");
    $(".modal_closeBtn").removeClass("fadeInDown");
    $(".modal_name").removeClass("bounceOutDown");
    $(".modal_img").removeClass("bounceInDown");
    $(".modal_img").removeClass("tada");
    $(".modal_id").removeClass("bounceInDown");
    $(".modal_name").removeClass("rollIn");
    $(".profile").removeClass("fadeIn");
    $(".stats").removeClass("fadeIn");
    $(".modal_type").remove();
  });
});

// Infinite scroll --- several pokemons with high ID# are missing many info on API
let currentscrollHeight = 0;
let pg = 131;

$(window).on("scroll", () => {
  const scrollHeight = $(document).height();
  const scrollPos = Math.floor($(window).height() + $(window).scrollTop());
  const isBottom = scrollHeight - 300 < scrollPos;

  if (isBottom && currentscrollHeight < scrollHeight) {
    pokemonRepository.loadList(apiUrl(pg), pg);

    console.log("scroll");
    currentscrollHeight = scrollHeight;
  }
});

// Search box
$(document).ready(() => {
  $(".searchBox").on("keyup", function () {
    var value = $(this).val().toLowerCase();

    $(".pokerow :button").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

pokemonRepository.loadList(apiUrl(0));
