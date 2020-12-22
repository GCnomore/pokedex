const apiUrl = (page) => {
  return `https://pokeapi.co/api/v2/pokemon/?offset=${page}&limit=131`;
};
const pokemonRepository = (() => {
  let pokemonList = [];
  let pokemonDetailList = [];

  function loadList(apiUrl) {
    return fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        response.results.forEach((pokemon) => {
          const pokemons = {
            name: pokemon.name,
            detailUrl: pokemon.url,
          };
          add(pokemons);
        });
      })
      .then(() => {
        pokemonList.map((pokemon) => {
          fetch(pokemon.detailUrl)
            .then((response) => {
              return response.json();
            })
            .then((response) => {
              const type = response.types.map((types) => {
                return types.type.name;
              });
              const pokemons = {
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
    let hp;
    let attack;
    let defense;
    let speed;
    if (pokemon.stats.length === 0) {
      hp = 'N/A';
      attack = 'N/A';
      defense = 'N/A';
      speed = 'N/A';
    } else {
      hp = pokemon.stats[0].base_stat;
      attack = pokemon.stats[1].base_stat;
      defense = pokemon.stats[2].base_stat;
      speed = pokemon.stats[5].base_stat;
    }

    // Defining background color of each Pokemon card with their types
    const color = () => {
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

    const pokerow = $('.pokerow');
    const pokeCard = document.createElement('button');
    const imgContainer = document.createElement('div');
    const pokeImg = document.createElement('img');
    const pokeName = document.createElement('div');

    $(pokeCard).addClass('pokeCard btn');
    $(pokeCard).attr('type', 'button');
    $(pokeCard).attr('data-name', pokemon.name);
    $(pokeCard).attr(
      'data-bigImg',
      pokemon.bigImg ? pokemon.bigImg : pokemon.img
    );
    $(pokeCard).attr('data-height', pokemon.height);
    $(pokeCard).attr('data-weight', pokemon.weight);
    $(pokeCard).attr('data-types', pokemon.types);
    $(pokeCard).attr('data-id', pokemon.id);
    $(pokeCard).attr('data-hp', hp);
    $(pokeCard).attr('data-attack', attack);
    $(pokeCard).attr('data-defense', defense);
    $(pokeCard).attr('data-speed', speed);
    $(pokeCard).attr('data-bgColor', color());

    $(pokeCard).css('background-color', color());

    $(imgContainer).addClass('imgContainer');
    $(imgContainer).attr('src', pokemon.img);
    $(imgContainer).attr('alt', `${pokemon.name}'s image`);

    $(pokeImg).addClass('pokeImg img-fluid');
    $(pokeImg).attr('src', pokemon.img);
    $(pokeImg).attr('alt', pokemon.name);

    $(pokeName).addClass('pokeName text-center text-wrap');
    $(pokeName).html(pokemon.name);

    $(pokeCard).append(imgContainer);
    $(imgContainer).append(pokeImg);
    $(pokeCard).append(pokeName);
    $(pokerow).append(pokeCard);

    $(window).mouseenter(() => {
      $('.pokeImg')
        .mouseenter((e) => {
          $(e.target).addClass('animate__heartBeat');
        })
        .mouseleave((e) => {
          $(e.target).removeClass('animate__heartBeat');
        });
    });
  }
  function createModal(data) {
    $('.modal_id').text(`#${data.id}`);
    $('.profile_height').text(`${(data.height * 0.1).toFixed(1)}M`);
    $('.profile_weight').text(`${(data.weight * 0.1).toFixed()}KG`);
    $('.stats_hp').text(data.hp);
    $('.stats_attack').text(data.attack);
    $('.stats_defense').text(data.defense);
    $('.stats_speed').text(data.speed);
    $('.modal_img').attr('src', data.bigimg);
    $('.modal_pokeName').text(`${data.name}`);

    const types = data.types.split(',');
    types.forEach((type) => {
      $('.modal_types').append(`<li class="${type} modal_type">${type}</li>`);
    });
  }

  return {
    loadList,
    addListItem,
    addDetails,
    getDetails,
    createModal,
    pokemonList: pokemonDetailList,
  };
})();

$(window).click((e) => {
  let clicked = e.target;
  let data;
  if (
    e.target.classList[0] == 'pokeImg' ||
    e.target.classList[0] == 'pokeName' ||
    e.target.classList[0] == 'pokeCard' ||
    e.target.classList[0] == 'imgContainer'
  ) {
    $(clicked).addClass('animate__bounceOut');
    if (clicked.nodeName == 'DIV') {
      data = clicked.parentNode.dataset;
      pokemonRepository.createModal(data, clicked);
    }
    if (clicked.nodeName == 'IMG') {
      data = clicked.parentNode.parentNode.dataset;
      pokemonRepository.createModal(data, clicked);
    }
    if (clicked.nodeName == 'BUTTON') {
      data = clicked.dataset;
      pokemonRepository.createModal(data, clicked);
    }

    setTimeout(() => {
      $('#bsModal').modal('show');
    }, 650);

    // When modal shows
    $('#bsModal').on('show.bs.modal', function () {
      // Adding animations
      $('.modal').ready(() => {
        $('.modal_img').hide();
        $('.modal_name').hide();
        $('.modal_id').hide();
        $('.profile').hide();
        $('.stats').hide();
        $('.modal_closeBtn').hide();
        $('.modal_type').hide();

        $('.modal_type').each((index, element) => {
          setTimeout(() => {
            $('.modal_type').show();
            $(element).addClass(`animate__bounceInLeft${index}`);
          }, 1500);
        });

        setTimeout(() => {
          $('.modal_closeBtn').show();
          $('.modal_closeBtn').addClass('fadeInDown');
        }, 1000);

        setTimeout(() => {
          $('.modal_img').show();
          $('.modal_name').show();
          $('.modal_name').addClass('bounceOutDown');
          $('.modal_img').addClass('bounceInDown');
        }, 500);
        setTimeout(() => {
          $('.modal_name').hide();
          $('.modal_img').addClass('tada');
          $('.modal_id').show();
          $('.modal_id').addClass('bounceInDown');
        }, 800);
        setTimeout(() => {
          $('.modal_name').show();
          $('.modal_name').addClass('rollIn');
        }, 950);
        setTimeout(() => {
          $('.profile').show();
          $('.stats').show();
          $('.profile').addClass('fadeIn');
          $('.stats').addClass('fadeIn');
        }, 2000);
      });
    });
  }

  // When modal hides
  $('#bsModal').on('hide.bs.modal', () => {
    $(clicked).removeClass('animate__bounceOut');
    $('.modal_type').removeClass('animate__bounceInLeft');
    $('.modal_closeBtn').removeClass('fadeInDown');
    $('.modal_name').removeClass('bounceOutDown');
    $('.modal_img').removeClass('bounceInDown');
    $('.modal_img').removeClass('tada');
    $('.modal_id').removeClass('bounceInDown');
    $('.modal_name').removeClass('rollIn');
    $('.profile').removeClass('fadeIn');
    $('.stats').removeClass('fadeIn');
    $('.modal_type').remove();
  });
});

function init(api) {
  pokemonRepository.loadList(api).then(() => {
    setTimeout(() => {
      const data = Array.from(
        new Set(pokemonRepository.pokemonList.map(JSON.stringify))
      ).map(JSON.parse);

      //Sort by Pokemon ID
      var added = data.sort((a, b) => {
        return a.id - b.id;
      });
      added.forEach((pokemon) => {
        pokemonRepository.addListItem(pokemon);
      });
      $('#loader').hide();
    }, 3000);
  });
}

// Infinite scroll --- several pokemons with high ID# are missing many info on API

$(window).on('scroll', () => {
  const { scrollHeight } = document.documentElement;
  const scrollPos = $(window).height() + $(window).scrollTop();
  if ((scrollHeight - scrollPos) / scrollHeight == 0) {
    // Removes duplicates
    const data = [
      ...new Set(pokemonRepository.pokemonList.map(JSON.stringify)),
    ].map(JSON.parse);
    const curPage = data.length;

    pokemonRepository.loadList(apiUrl(curPage)).then(async () => {
      $('#loader').show();
      setTimeout(() => {
        const cutData = data.splice(curPage);

        // Sort by Pokemon ID
        const added = cutData.sort((a, b) => {
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

// Search box
$(document).ready(() => {
  $('.searchBox').on('keyup', function () {
    var value = $(this).val().toLowerCase();

    $('.pokerow button').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

init(apiUrl(0));
