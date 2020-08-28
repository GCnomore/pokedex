var apiUrl = (page) => {
  return `https://pokeapi.co/api/v2/pokemon/?offset=${page}&limit=131`;
};
var pokemonRepository = (() => {
  var pokemonList = [];
  var pokemonDetailList = [];

  function loadList(apiUrl) {
    var pokemons = {};
    return $.ajax(apiUrl, {
      method: 'GET',
      dataType: 'json',
    })
      .then((response) => {
        response.results.forEach((pokemon) => {
          pokemons = {
            name: pokemon.name,
            detailUrl: pokemon.url,
          };
          add(pokemons);
        });
      })
      .then(() => {
        pokemonList.forEach((pokemon) => {
          $.ajax(pokemon.detailUrl, {
            method: 'GET',
            dataType: 'json',
          })
            .then((response) => {
              return response;
            })
            .then((response) => {
              var type = [];
              for (var i = 0; response.types.length > i; i++) {
                type.push(response.types[i].type.name);
              }
              var pokemons = {
                name: response.name,
                img: response.sprites.front_default,
                bigImg: response.sprites.other.dream_world.front_default,
                height: response.height,
                weight: response.weight,
                types: type,
                id: response.id,
                stats: response.stats,
              };
              addDetails(pokemons);
            })
            .catch((e) => {
              console.error(e);
            });
        });
      });
  }

  function addDetails(pokemons) {
    pokemonDetailList.push(pokemons);
  }

  function add(pokemons) {
    pokemonList.push(pokemons);
  }

  function getAll() {
    return pokemonList;
  }

  function getDetails() {
    pokemonDetailList.sort((a, b) => {
      return a.id - b.id;
    });
    const data = Array.from(new Set(pokemonDetailList.map(JSON.stringify))).map(
      JSON.parse
    );
    return pokemonDetailList;
  }

  function addListItem(pokemon) {
    var hp = pokemon.stats[0].base_stat;
    var attack = pokemon.stats[1].base_stat;
    var defense = pokemon.stats[2].base_stat;
    var speed = pokemon.stats[5].base_stat;

    var color = () => {
      if ($.inArray('fire', pokemon.types) !== -1) {
        return '#FA5543';
      }
      if ($.inArray('poison', pokemon.types) !== -1) {
        return '#A65B9E';
      }
      if ($.inArray('psychic', pokemon.types) !== -1) {
        return '#FA65B5';
      }
      if ($.inArray('grass', pokemon.types) !== -1) {
        return '#8CD851';
      }
      if ($.inArray('ground', pokemon.types) !== -1) {
        return '#E8C755';
      }
      if ($.inArray('ice', pokemon.types) !== -1) {
        return '#96F1FF';
      }
      if ($.inArray('rock', pokemon.types) !== -1) {
        return '#CDBC72';
      }
      if ($.inArray('dragon', pokemon.types) !== -1) {
        return '#8874FF';
      }
      if ($.inArray('water', pokemon.types) !== -1) {
        return '#56AEFF';
      }
      if ($.inArray('bug', pokemon.types) !== -1) {
        return '#C2D120';
      }
      if ($.inArray('dark', pokemon.types) !== -1) {
        return '#8A6955';
      }
      if ($.inArray('fighting', pokemon.types) !== -1) {
        return '#A75544';
      }
      if ($.inArray('ghost', pokemon.types) !== -1) {
        return '#7874D4';
      }
      if ($.inArray('steel', pokemon.types) !== -1) {
        return '#C4C2DB';
      }
      if ($.inArray('flying', pokemon.types) !== -1) {
        return '#79A4FF';
      }
      if ($.inArray('electric', pokemon.types) !== -1) {
        return '#FDE53C';
      }
      if ($.inArray('fairy', pokemon.types) !== -1) {
        return '#F9AEFF';
      }
    };

    var pokeList = $('.pokemon-list');
    var pokeCard = $(
      `<li class="pokeCard" data-name="${pokemon.name}" data-bigImg="${
        pokemon.bigImg
      }" data-height="${pokemon.height}" data-weight="${
        pokemon.weight
      }" data-types="${pokemon.types}" data-id="${
        pokemon.id
      }" data-hp="${hp}" data-attack="${attack}" data-defense="${defense}" data-speed="${speed}" style="background-color:${color()}">
          <div class="imgContainer"><img src="${pokemon.img}" /></div>
          <div class="pokeName">${pokemon.name}</div>
        </li>`
    );
    pokeList.append(pokeCard);
    // Adding animation to elements
    (function addingStyles() {
      $('.pokeCard')
        .mouseenter((e) => {
          $(e.target).addClass('animate__heartBeat');
        })
        .mouseleave((e) => {
          $(e.target).removeClass('animate__heartBeat animate__bounceOut');
        });
      $('.imgContainer').mousedown((e) => {
        $(e.target).addClass('animate__bounceOut');
      });
    })();
  }

  function handleClick() {
    setTimeout(() => {
      $('.pokeCard').click(modal);
    }, 3500);
  }

  function modal(event) {
    var clicked = event.target;
    var data;
    if (clicked.nodeName == 'DIV') {
      data = clicked.parentNode.dataset;
      createModal(data);
    }
    if (clicked.nodeName == 'IMG') {
      data = clicked.parentNode.parentNode.dataset;
      createModal(data);
    }
  }

  function createModal(data) {
    var types = data.types.split(',');
    var modal = $(`
      <div class="modal">
        <div class="modal_id">
          <h1>#${data.id}</h1>
        </div>
        <div class="modal_contents">
          <div class="modal_left">
            <ul class="modal_types"></ul>
            <table class="modal_profile">
              <tr>
                <th>Height</th>
                <th>Weight</th>
              </tr>
              <tr>
                <td>${data.height}</td>
                <td>${data.weight}</td>
              </tr>
            </table>
            <table class="modal_stats">
              <tr>
                <th><i class="fas fa-heart"></i></th>
                <th><i class="fas fa-crosshairs"></i></th>
                <th><i class="fas fa-shield-alt"></i></th>
                <th><i class="fas fa-running"></i></th>
              </tr>
              <tr>
                <td>${data.hp}</td>
                <td>${data.attack}</td>
                <td>${data.defense}</td>
                <td>${data.speed}</td>
              </tr>
            </table>
          </div>
          <div class="modal_right">
            <img src="${data.bigimg}">
            <div class="modal_name"><h1>${data.name}</h1></div>
          </div>
        </div>
        <div class="modal_closeBtn"><i class="fas fa-times-circle"></i></div>
      </div>
    `);
    showModal(modal);
    $('.modal_closeBtn').click(closeModal);
    types.forEach((type) => {
      $('.modal_types').append(`<li>${type}</li>`);
    });
  }

  function closeModal() {
    $('.modal').remove();
    $('.pokemon-list').show();
  }

  function showModal(modal) {
    $('body').append(modal);
    $('.pokemon-list').hide();
  }

  return {
    loadList,
    add,
    getAll,
    addListItem,
    addDetails,
    getDetails,
    handleClick,
  };
})();

function init(api) {
  pokemonRepository.loadList(api).then(() => {
    setTimeout(() => {
      pokemonRepository.getDetails().forEach((pokemon) => {
        pokemonRepository.addListItem(pokemon);
      });
      $('#loader').hide();
    }, 3000);
  });
  pokemonRepository.handleClick();
}

//Infinite scroll --- several pokemons with high ID# are missing many info on API
window.addEventListener('scroll', () => {
  var curPage = pokemonRepository.getDetails().length;
  var forSplice = () => {
    if (curPage == 131) {
      return curPage;
    }
    if (curPage > 131) {
      return curPage - 131;
    }
  };
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  console.log(scrollTop, scrollHeight, clientHeight);
  if (scrollTop + clientHeight >= scrollHeight && scrollTop !== 0) {
    pokemonRepository.loadList(apiUrl(curPage)).then(() => {
      $('#loader').show();
      setTimeout(() => {
        const data = Array.from(
          new Set(pokemonRepository.getDetails().map(JSON.stringify))
        ).map(JSON.parse);
        var cutData = data.splice(forSplice());
        var added = cutData.sort((a, b) => {
          return a.id - b.id;
        });
        added.forEach((pokemon) => {
          pokemonRepository.addListItem(pokemon);
        });
        $('#loader').hide();
      }, 3000);
    });
  }
});

init(apiUrl(0));
