var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

var musicController = (function () {
  var data = {
    currentSongIndex: 0,
    isPlaying: false,
    isRandom: false,
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
    setIsPlaying: function (payload) {
      data.isPlaying = payload;
    },
    getisPlaying: function () {
      return data.isPlaying;
    },
    setCurrentSongIndex: function (currentIndex) {
      data.currentSongIndex = currentIndex;
    },
    getCurrentSongIndex: function () {
      return data.currentSongIndex;
    },
    setRandomStatus: function (status) {
      data.isRandom = status;
    },
    getRandomStatus: function () {
      return data.isRandom;
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
    nextBtn: ".btn-next",
    prevBtn: ".btn-prev",
    randomBtn: ".btn-random",
  };

  var animation = $(DOMstrings.compactDisc).animate(
    [{ transform: "rotate(360deg)" }],
    {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    }
  );
  animation.pause();

  var nextSong = function (musicCtrl, loadSongFn) {
    return function () {
      var nextSongIndex, playlistLength;

      playlistLength = musicCtrl.getPlaylist().length - 1;
      nextSongIndex = musicCtrl.getCurrentSongIndex() + 1;
      musicCtrl.setCurrentSongIndex(nextSongIndex);

      if (nextSongIndex > playlistLength) {
        musicCtrl.setCurrentSongIndex(0);
        nextSongIndex = 0;
      }

      loadSongFn(musicCtrl.getSong(nextSongIndex));
      musicCtrl.setIsPlaying(true);
      $(DOMstrings.audio).play();
    };
  };
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
        $(DOMstrings.playerEl).classList.add("playing");
        animation.play();
      };
    },
    audioOnPause: function () {
      $(DOMstrings.audio).onpause = function () {
        $(DOMstrings.playerEl).classList.remove("playing");
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
    audioOnEnded: function () {
      $(DOMstrings.audio).onended = function () {
        $(DOMstrings.nextBtn).click();
        // var isRadomActive = musicCtrl.getRandomStatus();
        // if (isRadomActive) {
        //   _this.playRandomSong(musicCtrl);
        // } else {
        //   nextSong(musicCtrl, _this.loadSong).call();
        // }
      };
    },
    playMusicBtn: function (musicController) {
      function handleEvent(musicController, DOMstrings) {
        return function () {
          if (!musicController.getisPlaying()) {
            $(DOMstrings.audio).play();
            musicController.setIsPlaying(true);
          } else {
            $(DOMstrings.audio).pause();
            musicController.setIsPlaying(false);
          }
        };
      }
      $(DOMstrings.playBtn).addEventListener(
        "click",
        handleEvent(musicController, DOMstrings),
        false
      );
    },
    nextSongBtn: function (musicCtrl) {
      var _this = this;
      $(DOMstrings.nextBtn).addEventListener(
        "click",
        function (musicCtrl) {
          var randomStatus = musicCtrl.getRandomStatus();
          if (randomStatus) {
            _this.playRandomSong(musicCtrl);
          } else {
            nextSong(musicCtrl, _this.loadSong).call();
          }
        }.bind($(DOMstrings.nextBtn), musicCtrl)
      );
    },
    prevSongBtn: function (musicCtrl) {
      var _this = this;
      function handleEvent(musicCtrl, loadSongFn) {
        return function () {
          var prevSongindex, playlistLength;

          playlistLength = musicCtrl.getPlaylist().length - 1;
          prevSongindex = musicCtrl.getCurrentSongIndex() - 1;

          musicCtrl.setCurrentSongIndex(prevSongindex);

          if (prevSongindex < 0) {
            musicCtrl.setCurrentSongIndex(playlistLength);
            prevSongindex = playlistLength;
          }

          loadSongFn(musicCtrl.getSong(prevSongindex));
          musicCtrl.setIsPlaying(true);
          $(DOMstrings.audio).play();
        };
      }

      $(DOMstrings.prevBtn).addEventListener(
        "click",
        handleEvent(musicCtrl, _this.loadSong)
      );
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    randomSongBtn: function (musicCtrl) {
      $(DOMstrings.randomBtn).addEventListener(
        "click",
        function (musicCtrl) {
          var isRandomActive = !musicCtrl.getRandomStatus();
          musicCtrl.setRandomStatus(isRandomActive);

          $(DOMstrings.randomBtn).classList.toggle("active", isRandomActive);
        }.bind($(DOMstrings.randomBtn), musicCtrl)
      );
    },
    playRandomSong: function (musicCtrl) {
      var _this = this;
      var currentSongIndex = musicController.getCurrentSongIndex();
      var randomSongIndex = Math.floor(
        Math.random() * musicCtrl.getPlaylist().length
      );
      if (currentSongIndex === randomSongIndex) {
        _this.playRandomSong(musicCtrl);
        return;
      }
      musicCtrl.setCurrentSongIndex(randomSongIndex);
      _this.loadSong(musicCtrl.getSong(randomSongIndex));
      $(DOMstrings.audio).play();
    },
  };
})();

var app = (function (musicCtrl, UICtrl) {
  var setupEventListener, currentSongIndex;
  currentSongIndex = musicCtrl.getCurrentSongIndex();
  setupEventListener = function () {
    UICtrl.displaySongs(musicCtrl.getPlaylist());
    UICtrl.loadSong(musicCtrl.getSong(currentSongIndex));
    UICtrl.scrollEvent();
    // Click on Prev Button
    UICtrl.prevSongBtn(musicCtrl);

    // Click on playmusic Button
    UICtrl.playMusicBtn(musicCtrl);

    // Click on Next Button
    UICtrl.nextSongBtn(musicCtrl);

    // Click on Random Button
    UICtrl.randomSongBtn(musicCtrl);

    UICtrl.audioOnPlay();
    UICtrl.audioOnPause();
    UICtrl.progressBarOnChange();
    UICtrl.audioOnChangeTime();
    UICtrl.audioOnEnded();
  };

  return {
    init: function () {
      console.log("Application has started...");
      setupEventListener();
    },
  };
})(musicController, UIController);

app.init();

// 1:06:06
