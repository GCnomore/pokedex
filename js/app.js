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

  function getDetails() {
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
      }" data-hp="${hp}" data-attack="${attack}" data-defense="${defense}" data-speed="${speed}" data-bgColor="${color()}" style="background-color:${color()}">
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
    pokemonRepository.handleClick();
  }

  function handleClick() {
    setTimeout(() => {
      $('.pokeCard').click(modal);
    }, 3500);

    $(window).click((e) => {
      if ($('.modal_container').length !== 0) {
        console.log(e.target, $('.modal').length);
        if (e.target === $('.ul')) {
          closeModal();
        }
      }
    });
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
            <ul class="modal_types "></ul>
            <table class="modal_profile">
              <tr class="profile">
                <th>Height</th>
                <th>Weight</th>
              </tr>
              <tr class="profile">
                <td>${data.height}M</td>
                <td>${(data.weight * 0.1).toFixed()}KG</td>
              </tr>
            </table>
            <table class="modal_stats">
              <tr>
                <th class="stats"><i class="fas fa-heart"></i></th>
                <th class="stats"><i class="fas fa-crosshairs"></i></th>
                <th class="stats"><i class="fas fa-shield-alt"></i></th>
                <th class="stats"><i class="fas fa-running"></i></th>
              </tr>
              <tr>
                <td class="stats">${data.hp}</td>
                <td class="stats">${data.attack}</td>
                <td class="stats">${data.defense}</td>
                <td class="stats">${data.speed}</td>
              </tr>
            </table>
          </div>
          <div class="modal_right">
            <img class="modal_img" src="${data.bigimg}">
            <div class="modal_name"><h1>${data.name}</h1></div>
          </div>
        </div>
        <div class="modal_closeBtn"><i class="fas fa-times-circle"></i></div>
      </div>
    `);
    showModal(modal);
    types.forEach((type) => {
      $('.modal_types').append(`<li class="${type} modal_type">${type}</li>`);
    });
  }

  function closeModal() {
    $('.modal').hide();
    $('.pokemon-list').show();
    $('.pokemon-list').css('opacity', '1');
  }

  function showModal(modal) {
    $('.modal').remove();
    $('body').append(modal);

    //Adding animations
    $('.modal').ready(() => {
      $('.modal_type').each((index, element) => {
        $(element).addClass(`animate__bounceInLeft${index}`);
      });
    });
    $('.pokemon-list').css('opacity', '0.2');
    $('.modal_img').hide();
    $('.modal_name').hide();
    $('.modal_id').hide();
    $('.profile').hide();
    $('.stats').hide();
    setTimeout(() => {
      $('.modal_img').show();
      $('.modal_name').show();
      $('.modal_name').addClass('bounceOutDown');
      $('.modal_img').addClass('bounceInDown');
      setTimeout(() => {
        $('.modal_name').hide();
        $('.modal_img').addClass('tada');
        $('.modal_id').show();
        $('.modal_id').addClass('bounceInDown');
        setTimeout(() => {
          $('.modal_name').show();
          $('.modal_name').addClass('rollIn');
          setTimeout(() => {
            $('.profile').show();
            $('.stats').show();
            $('.profile').addClass('fadeIn');
            $('.stats').addClass('fadeIn');
          }, 1000);
        }, 950);
      }, 700);
    }, 400);

    $('.modal_closeBtn').click(closeModal);
    $(window).keydown((e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  return {
    loadList,
    addListItem,
    addDetails,
    getDetails,
    handleClick,
    pokemonList: pokemonDetailList,
  };
})();

function init(api) {
  pokemonRepository.loadList(api).then(() => {
    setTimeout(() => {
      pokemonRepository.pokemonList.forEach((pokemon) => {
        pokemonRepository.addListItem(pokemon);
      });
      $('#loader').hide();
    }, 3000);
  });
  pokemonRepository.handleClick();
}

//Infinite scroll --- several pokemons with high ID# are missing many info on API

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight && scrollTop !== 0) {
    const data = Array.from(
      new Set(pokemonRepository.pokemonList.map(JSON.stringify))
    ).map(JSON.parse);
    var curPage = data.length;
    pokemonRepository.loadList(apiUrl(curPage)).then(() => {
      $('#loader').show();
      setTimeout(() => {
        //Removes duplicates
        const data = Array.from(
          new Set(pokemonRepository.pokemonList.map(JSON.stringify))
        ).map(JSON.parse);
        var cutData = data.splice(curPage);

        //Sort by Pokemon ID
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

//removed useless codes from infinite scroll
//need to size up close button container to close modal when clicked outside
