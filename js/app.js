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
    var pokeList = $('.pokemon-list');
    var pokeCard = $(
      `<li class="pokeCard">
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

  return {
    loadList,
    add,
    getAll,
    addListItem,
    addDetails,
    getDetails,
  };
})();

function init(api) {
  pokemonRepository.loadList(api).then(() => {
    setTimeout(() => {
      pokemonRepository.getDetails().forEach((pokemon) => {
        pokemonRepository.addListItem(pokemon);
      });
    }, 3000);
  });
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
  if (scrollTop + clientHeight >= scrollHeight) {
    pokemonRepository.loadList(apiUrl(curPage)).then(() => {
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
      }, 3000);
    });
  }
});

init(apiUrl(0));
