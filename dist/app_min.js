const apiUrl = (e) =>
    `https://pokeapi.co/api/v2/pokemon/?offset=${e}&limit=131`,
  pokemonRepository = (() => {
    let e = [],
      t = [];
    function a(e) {
      t.push(e);
    }
    return {
      loadList: function (t) {
        return fetch(t)
          .then((e) => e.json())
          .then((t) => {
            t.results.forEach((t) => {
              !(function (t) {
                e.push(t);
              })({ name: t.name, detailUrl: t.url });
            });
          })
          .then(() => {
            e.map((e) => {
              fetch(e.detailUrl)
                .then((e) => e.json())
                .then((e) => {
                  const t = e.types.map((e) => e.type.name);
                  a({
                    name: e.name,
                    img: e.sprites.front_default,
                    bigImg: e.sprites.other.dream_world.front_default,
                    height: e.height,
                    weight: e.weight,
                    types: t,
                    id: e.id,
                    stats: e.stats,
                  });
                })
                .catch((e) => {
                  console.error(e);
                });
            });
          });
      },
      addListItem: function (e) {
        let t, a, o, s;
        0 === e.stats.length
          ? ((t = 'N/A'), (a = 'N/A'), (o = 'N/A'), (s = 'N/A'))
          : ((t = e.stats[0].base_stat),
            (a = e.stats[1].base_stat),
            (o = e.stats[2].base_stat),
            (s = e.stats[5].base_stat));
        const n = () =>
            -1 !== $.inArray('fire', e.types)
              ? '#FA5543'
              : -1 !== $.inArray('poison', e.types)
              ? '#A65B9E'
              : -1 !== $.inArray('psychic', e.types)
              ? '#FA65B5'
              : -1 !== $.inArray('grass', e.types)
              ? '#8CD851'
              : -1 !== $.inArray('ground', e.types)
              ? '#E8C755'
              : -1 !== $.inArray('ice', e.types)
              ? '#96F1FF'
              : -1 !== $.inArray('rock', e.types)
              ? '#CDBC72'
              : -1 !== $.inArray('dragon', e.types)
              ? '#8874FF'
              : -1 !== $.inArray('water', e.types)
              ? '#56AEFF'
              : -1 !== $.inArray('bug', e.types)
              ? '#C2D120'
              : -1 !== $.inArray('dark', e.types)
              ? '#8A6955'
              : -1 !== $.inArray('fighting', e.types)
              ? '#A75544'
              : -1 !== $.inArray('ghost', e.types)
              ? '#7874D4'
              : -1 !== $.inArray('steel', e.types)
              ? '#C4C2DB'
              : -1 !== $.inArray('flying', e.types)
              ? '#79A4FF'
              : -1 !== $.inArray('electric', e.types)
              ? '#FDE53C'
              : -1 !== $.inArray('fairy', e.types)
              ? '#F9AEFF'
              : void 0,
          i = $('.pokerow'),
          d = document.createElement('button'),
          r = document.createElement('div'),
          m = document.createElement('img'),
          l = document.createElement('div');
        $(d).addClass('pokeCard btn'),
          $(d).attr('type', 'button'),
          $(d).attr('data-name', e.name),
          $(d).attr('data-bigImg', e.bigImg ? e.bigImg : e.img),
          $(d).attr('data-height', e.height),
          $(d).attr('data-weight', e.weight),
          $(d).attr('data-types', e.types),
          $(d).attr('data-id', e.id),
          $(d).attr('data-hp', t),
          $(d).attr('data-attack', a),
          $(d).attr('data-defense', o),
          $(d).attr('data-speed', s),
          $(d).attr('data-bgColor', n()),
          $(d).css('background-color', n()),
          $(r).addClass('imgContainer'),
          $(r).attr('src', e.img),
          $(r).attr('alt', `${e.name}'s image`),
          $(m).addClass('pokeImg img-fluid'),
          $(m).attr('src', e.img),
          $(m).attr('alt', e.name),
          $(l).addClass('pokeName text-center text-wrap'),
          $(l).html(e.name),
          $(d).append(r),
          $(r).append(m),
          $(d).append(l),
          $(i).append(d),
          $(window).mouseenter(() => {
            $('.pokeImg')
              .mouseenter((e) => {
                $(e.target).addClass('animate__heartBeat');
              })
              .mouseleave((e) => {
                $(e.target).removeClass('animate__heartBeat');
              });
          });
      },
      addDetails: a,
      getDetails: function () {
        return t;
      },
      createModal: function (e) {
        $('.modal_id').text(`#${e.id}`),
          $('.profile_height').text(`${(0.1 * e.height).toFixed(1)}M`),
          $('.profile_weight').text(`${(0.1 * e.weight).toFixed()}KG`),
          $('.stats_hp').text(e.hp),
          $('.stats_attack').text(e.attack),
          $('.stats_defense').text(e.defense),
          $('.stats_speed').text(e.speed),
          $('.modal_img').attr('src', e.bigimg),
          $('.modal_pokeName').text(`${e.name}`),
          e.types.split(',').forEach((e) => {
            $('.modal_types').append(`<li class="${e} modal_type">${e}</li>`);
          });
      },
      pokemonList: t,
    };
  })();
function init(e) {
  pokemonRepository.loadList(e).then(() => {
    setTimeout(() => {
      Array.from(new Set(pokemonRepository.pokemonList.map(JSON.stringify)))
        .map(JSON.parse)
        .sort((e, t) => e.id - t.id)
        .forEach((e) => {
          pokemonRepository.addListItem(e);
        }),
        $('#loader').hide();
    }, 3e3);
  });
}
$(window).click((e) => {
  let t,
    a = e.target;
  ('pokeImg' != e.target.classList[0] &&
    'pokeName' != e.target.classList[0] &&
    'pokeCard' != e.target.classList[0] &&
    'imgContainer' != e.target.classList[0]) ||
    ($(a).addClass('animate__bounceOut'),
    'DIV' == a.nodeName &&
      ((t = a.parentNode.dataset), pokemonRepository.createModal(t, a)),
    'IMG' == a.nodeName &&
      ((t = a.parentNode.parentNode.dataset),
      pokemonRepository.createModal(t, a)),
    'BUTTON' == a.nodeName &&
      ((t = a.dataset), pokemonRepository.createModal(t, a)),
    setTimeout(() => {
      $('#bsModal').modal('show');
    }, 650),
    $('#bsModal').on('show.bs.modal', function () {
      $('.modal').ready(() => {
        $('.modal_img').hide(),
          $('.modal_name').hide(),
          $('.modal_id').hide(),
          $('.profile').hide(),
          $('.stats').hide(),
          $('.modal_closeBtn').hide(),
          $('.modal_type').hide(),
          $('.modal_type').each((e, t) => {
            setTimeout(() => {
              $('.modal_type').show(),
                $(t).addClass(`animate__bounceInLeft${e}`);
            }, 1500);
          }),
          setTimeout(() => {
            $('.modal_closeBtn').show(),
              $('.modal_closeBtn').addClass('fadeInDown');
          }, 1e3),
          setTimeout(() => {
            $('.modal_img').show(),
              $('.modal_name').show(),
              $('.modal_name').addClass('bounceOutDown'),
              $('.modal_img').addClass('bounceInDown');
          }, 500),
          setTimeout(() => {
            $('.modal_name').hide(),
              $('.modal_img').addClass('tada'),
              $('.modal_id').show(),
              $('.modal_id').addClass('bounceInDown');
          }, 800),
          setTimeout(() => {
            $('.modal_name').show(), $('.modal_name').addClass('rollIn');
          }, 950),
          setTimeout(() => {
            $('.profile').show(),
              $('.stats').show(),
              $('.profile').addClass('fadeIn'),
              $('.stats').addClass('fadeIn');
          }, 2e3);
      });
    })),
    $('#bsModal').on('hide.bs.modal', () => {
      $(a).removeClass('animate__bounceOut'),
        $('.modal_type').removeClass('animate__bounceInLeft'),
        $('.modal_closeBtn').removeClass('fadeInDown'),
        $('.modal_name').removeClass('bounceOutDown'),
        $('.modal_img').removeClass('bounceInDown'),
        $('.modal_img').removeClass('tada'),
        $('.modal_id').removeClass('bounceInDown'),
        $('.modal_name').removeClass('rollIn'),
        $('.profile').removeClass('fadeIn'),
        $('.stats').removeClass('fadeIn'),
        $('.modal_type').remove();
    });
}),
  $(window).on('scroll', () => {
    const { scrollHeight: e } = document.documentElement;
    if ((e - ($(window).height() + $(window).scrollTop())) / e == 0) {
      const e = Array.from(
        new Set(pokemonRepository.pokemonList.map(JSON.stringify))
      ).map(JSON.parse).length;
      pokemonRepository.loadList(apiUrl(e)).then(async () => {
        $('#loader').show(),
          setTimeout(() => {
            Array.from(
              new Set(pokemonRepository.pokemonList.map(JSON.stringify))
            )
              .map(JSON.parse)
              .splice(e)
              .sort((e, t) => e.id - t.id)
              .forEach((e) => {
                pokemonRepository.addListItem(e);
              }),
              $('#loader').hide();
          }, 3e3);
      });
    }
  }),
  init(apiUrl(0));
