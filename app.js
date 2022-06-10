var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

var musicController = (function () {
  var data = {
    playlist: [
      {
        id: 1,
        name: "On My Way",
        singer: "Alan Walker",
        url: "https://c1-ex-swe.nixcdn.com/Sony_Audio60/OnMyWay-AlanWalkerSabrinaCarpenterFarruko-5919403.mp3?st=vHK7l3pwWYrBmd-Rl_qaGg&e=1654836657&t=1654750146688",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2019/03/21/b/2/9/4/1553136202684_500.jpg",
      },
      {
        id: 2,
        name: "Don't Call Me",
        singer: "Luke Combs",
        url: "https://c1-ex-swe.nixcdn.com/Unv_Audio112/DonTCallMe-NevadaLoote-5660977.mp3?st=HppMBlXb9aR8-CE-0yVPEA&e=1654836482&t=1654749970883",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2018/09/13/a/f/1/5/1536797156492_500.jpg",
      },
      {
        id: 3,
        name: "Denim & Rhinestones",
        singer: "Carrie",
        url: "https://f9-stream.nixcdn.com/NhacCuaTui1026/DenimRhinestones-CarrieUnderwood-7182887.mp3?st=XV1la9bUYSl6_Zr4t-MHpA&e=1654831545&t=1654745034909",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2022/04/05/1/f/a/d/1649149056764_500.jpg",
      },
      {
        id: 4,
        name: "Something Just Like This",
        singer: "The Chainsmokers",
        url: "https://c1-ex-swe.nixcdn.com/Sony_Audio39/SomethingJustLikeThis-TheChainsmokersColdplay-5337136.mp3?st=wPZnDJRE5sEyHq86T1yl4g&e=1654836775&t=1654750264341",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2017/05/23/c/c/d/9/1495542089406_500.jpg",
      },
      {
        id: 5,
        name: "All Falls Down",
        singer: "Alan Walker",
        url: "https://c1-ex-swe.nixcdn.com/Sony_Audio57/AllFallsDown-AlanWalkerNoahCyrusDigitalFarmAnimalsJuliander-5817723.mp3?st=Pb4CT7B6BS3hW8arv989bg&e=1654836874&t=1654750362944",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2018/01/04/5/6/9/b/1515043838519_500.jpg",
      },
    ],
  };
  return {
    getPlaylist: function () {
      return data.playlist;
    },
    getSong: function (index) {
      return data.playlist[index] ?? undefined;
    },
  };
})();

var UIController = (function () {
  var DOMstrings = {
    playlistEl: ".playlist",
    compactDisc: ".cd",
    songLabel: "header h2",
    songThumb: ".cd-thumb",
    audio: "#audio",
    playBtn: ".btn-toggle-play",
    playerEl: ".player",
    progressEl: "#progress",
  };

  var animation = $(DOMstrings.compactDisc).animate(
    [{ transform: "rotate(360deg)" }],
    {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    }
  );
  animation.pause();

  return {
    displaySongs: function (songs) {
      var htmls, newHtmls;
      htmls = songs.map(function (song) {
        return `
            <div class="song">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `;
      });

      newHtmls = htmls.join("");
      $(DOMstrings.playlistEl).insertAdjacentHTML("beforeend", newHtmls);
    },
    scrollEvent: function () {
      var scrollTop, newCdWidth, cdWidth;
      cdWidth = $(DOMstrings.compactDisc).offsetWidth;

      document.onscroll = function () {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        newCdWidth = cdWidth - scrollTop;

        if (newCdWidth > 0) {
          $(DOMstrings.compactDisc).style.width = newCdWidth + "px";
        } else {
          $(DOMstrings.compactDisc).style.width = 0;
        }

        $(DOMstrings.compactDisc).style.opacity = newCdWidth / cdWidth;
      };
    },
    loadSong: function (song) {
      $(DOMstrings.songLabel).textContent = song.name;
      $(DOMstrings.songThumb).style.backgroundImage = `url(${song.image})`;
      $(DOMstrings.audio).src = song.url;
    },
    audioOnPlay: function () {
      $(DOMstrings.audio).onplay = function () {
        animation.play();
      };
    },
    audioOnPause: function () {
      $(DOMstrings.audio).onpause = function () {
        animation.pause();
      };
    },
    audioOnChangeTime: function () {
      $(DOMstrings.audio).ontimeupdate = function () {
        if ($(DOMstrings.audio).duration) {
          $(DOMstrings.progressEl).value = Math.floor(
            ($(DOMstrings.audio).currentTime / $(DOMstrings.audio).duration) *
              100
          );
        }
      };
    },
    progressBarOnChange: function () {
      $(DOMstrings.progressEl).addEventListener("change", function (e) {
        $(DOMstrings.audio).currentTime =
          (e.target.value * $(DOMstrings.audio).duration) / 100;
      });
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

var app = (function (musicCtrl, UICtrl) {
  var DOM = UICtrl.getDOMstrings();
  var setupEventListener = function () {
    UICtrl.displaySongs(musicCtrl.getPlaylist());
    UICtrl.loadSong(musicCtrl.getSong(0));
    UICtrl.scrollEvent();

    $(DOM.playBtn).addEventListener("click", playMusic);

    UICtrl.audioOnPlay();
    UICtrl.audioOnPause();
    UICtrl.progressBarOnChange();
    UICtrl.audioOnChangeTime();
  };

  var playMusic = function () {
    if ($(DOM.playerEl).getAttribute("cd") === "start") {
      $(DOM.audio).play();
      $(DOM.playerEl).setAttribute("cd", "starting");
      $(DOM.playerEl).classList.add("playing");
    } else {
      $(DOM.audio).pause();
      $(DOM.playerEl).setAttribute("cd", "start");
      $(DOM.playerEl).classList.remove("playing");
    }
  };

  return {
    init: function () {
      console.log("Application has started...");
      setupEventListener();
    },
  };
})(musicController, UIController);

app.init();

// 49: 08
