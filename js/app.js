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
    var hp;
    var attack;
    var defense;
    var speed;
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
        pokemon.bigImg ? pokemon.bigImg : pokemon.img
      }" data-height="${pokemon.height}" data-weight="${
        pokemon.weight
      }" data-types="${pokemon.types}" data-id="${
        pokemon.id
      }" data-hp="${hp}" data-attack="${attack}" data-defense="${defense}" data-speed="${speed}" data-bgColor="${color()}" style="background-color:${color()}">
          <div class="imgContainer"><img class="pokeImg" src="${
            pokemon.img
          }" /></div>
          <div class="pokeName">${pokemon.name}</div>
        </li>`
    );
    pokeList.append(pokeCard);
    // Adding animation to elements
    (function addingStyles() {
      $('.pokeImg')
        .mouseenter((e) => {
          $(e.target).addClass('animate__heartBeat');
        })
        .mouseleave((e) => {
          $(e.target).removeClass('animate__heartBeat');
        });
      $('.imgContainer').mousedown((e) => {
        $(e.target).addClass('animate__bounceOut');
      });
      $('.pokeName').mousedown((e) => {
        $(e.target).addClass('animate__bounceOut');
      });
    })();
  }

  $(window).click((e) => {
    if (
      e.target.classList[0] == 'pokeImg' ||
      e.target.classList[0] == 'pokeName'
    ) {
      handleClick(e);
    }
  });

  function handleClick(e) {
    setTimeout(() => {
      $('.pokeCard').click(modal(e));
    }, 650);
  }

  function modal(event) {
    var clicked = event.target;
    var data;
    if (clicked.nodeName == 'DIV') {
      data = clicked.parentNode.dataset;
      createModal(data, clicked);
    }
    if (clicked.nodeName == 'IMG') {
      data = clicked.parentNode.parentNode.dataset;
      createModal(data, clicked);
    }
  }

  function createModal(data, clicked) {
    var types = data.types.split(',');
    var modal = $(`
      <div class="modal animate__bounceIn">
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
    showModal(modal, clicked);
    types.forEach((type) => {
      $('.modal_types').append(`<li class="${type} modal_type">${type}</li>`);
    });
  }

  function closeModal(clicked) {
    $('.modal').remove();
    $('.pokemon-list').css('opacity', '1');
    $(clicked).removeClass('animate__bounceOut');
  }

  function showModal(modal, clicked) {
    $('.modal').remove();
    $('body').append(modal);

    //Adding animations
    $('.modal').ready(() => {
      $('.modal_img').hide();
      $('.modal_name').hide();
      $('.modal_id').hide();
      $('.profile').hide();
      $('.stats').hide();
      $('.modal_closeBtn').hide();
      $('.modal_type').hide();

      $('.pokemon-list').css('opacity', '0.2');

      $('.modal_type').each((index, element) => {
        setTimeout(() => {
          $('.modal_type').show();
          $(element).addClass(`animate__bounceInLeft${index}`);
        }, 1500);
      });

      setTimeout(() => {
        $('.modal_closeBtn').show();
        $('.modal_closeBtn').addClass('fadeInUp');
      }, 1000);

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
    });

    if ($('body').is($('.modal').parent())) {
      $(window).click((e) => {
        setTimeout(() => {
          if (e.target.parentNode.className == 'pokedex') {
            closeModal(clicked);
          }
        });
      });
    }
    $('.modal_closeBtn').click(() => {
      closeModal(clicked);
    });
    $('.fa-times-circle').click(() => {
      closeModal(clicked);
    });
    $(window).keydown((e) => {
      if (e.key === 'Escape') {
        closeModal(clicked);
      }
    });
  }

  return {
    loadList,
    addListItem,
    addDetails,
    getDetails,
    pokemonList: pokemonDetailList,
    closeModal,
  };
})();

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
      $('.modal').remove();
      $('.pokemon-list').css('opacity', '1');
      $('.pokeName').removeClass('animate__bounceOut');
      $('.imgContainer').removeClass('animate__bounceOut');
      $('.pokeImg').removeClass('animate__bounceOut');
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
