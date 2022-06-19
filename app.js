var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

var musicController = (function () {
  var data = {
    currentSongIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeatable: false,
    playlist: [
      {
        id: 1,
        name: "On My Way",
        singer: "Alan Walker",
        url: "/assets/playlist/OnMyWay.mp3",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2019/03/21/b/2/9/4/1553136202684_500.jpg",
      },
      {
        id: 2,
        name: "Don't Call Me",
        singer: "Nevada, Loote",
        url: "/assets/playlist/o7mDYsLfQ8hL.mp3",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2018/09/13/a/f/1/5/1536797156492_500.jpg",
      },
      {
        id: 3,
        name: "Denim & Rhinestones",
        singer: "Carrie",
        url: "/assets/playlist/Carrie_Underwood.mp3",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2022/04/05/1/f/a/d/1649149056764_500.jpg",
      },
      {
        id: 4,
        name: "Something Just Like This",
        singer: "The Chainsmokers",
        url: "/assets/playlist/SomethingJustLikeThis.mp3",
        image:
          "https://avatar-ex-swe.nixcdn.com/playlist/2017/05/23/c/c/d/9/1495542089406_500.jpg",
      },
      {
        id: 5,
        name: "All Falls Down",
        singer: "Alan Walker",
        url: "/assets/playlist/AllFallsDown.mp3",
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
    setRepeatStatus: function (status) {
      data.isRepeatable = status;
    },
    getRepeatStatus: function () {
      return data.isRepeatable;
    },
  };
})();

var UIController = (function () {
  var DOMstrings = {
    playlistEl: ".playlist",
    compactDisc: ".cd",
    songLabel: "header h2",
    songThumb: ".cd-thumb",
    songDiv: ".song",
    activeSong: ".song.active",
    audio: "#audio",
    playBtn: ".btn-toggle-play",
    playerEl: ".player",
    progressEl: "#progress",
    nextBtn: ".btn-next",
    prevBtn: ".btn-prev",
    randomBtn: ".btn-random",
    repeatBtn: ".btn-repeat",
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
    displaySongs: function (songs, currentSongIndex) {
      var htmls, newHtmls;
      htmls = songs.map(function (song, index) {
        return `
            <div class="song ${
              index === currentSongIndex ? "active" : ""
            }" data-index-number=${index}>
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
      $(DOMstrings.audio).load();
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
          $(DOMstrings.progressEl).value =
            ($(DOMstrings.audio).currentTime / $(DOMstrings.audio).duration) *
            100;
        }
      };
    },
    progressBarOnChange: function () {
      $(DOMstrings.progressEl).addEventListener("change", function (e) {
        $(DOMstrings.audio).currentTime =
          (e.target.value * $(DOMstrings.audio).duration) / 100;
      });
    },
    audioOnEnded: function (musicCtrl) {
      $(DOMstrings.audio).onended = function (musicCtrl) {
        var isRepeated = musicCtrl.getRepeatStatus();
        if (isRepeated) {
          $(DOMstrings.audio).play();
        } else {
          $(DOMstrings.nextBtn).click();
        }
        // var isRadomActive = musicCtrl.getRandomStatus();
        // if (isRadomActive) {
        //   _this.playRandomSong(musicCtrl);
        // } else {
        //   nextSong(musicCtrl, _this.loadSong).call();
        // }
      }.bind($(DOMstrings.audio), musicCtrl);
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
    nextSong: function (musicCtrl, loadSongFn) {
      var _this = this;
      return function () {
        var nextSongIndex, playlistLength;

        playlistLength = musicCtrl.getPlaylist().length - 1;
        nextSongIndex = musicCtrl.getCurrentSongIndex() + 1;
        musicCtrl.setCurrentSongIndex(nextSongIndex);

        if (nextSongIndex > playlistLength) {
          musicCtrl.setCurrentSongIndex(0);
          nextSongIndex = 0;
        }
        _this.jumpActiveClass(nextSongIndex);

        loadSongFn(musicCtrl.getSong(nextSongIndex));
        musicCtrl.setIsPlaying(true);
        $(DOMstrings.audio).play();
      };
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
            _this.nextSong(musicCtrl, _this.loadSong).call();
          }
          _this.scrollIntoView();
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

          _this.jumpActiveClass(prevSongindex);
          _this.scrollIntoView();

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
    repeatSongBtn: function (musicCtrl) {
      $(DOMstrings.repeatBtn).addEventListener(
        "click",
        function (musicCtrl) {
          var isActive = !musicCtrl.getRepeatStatus();
          musicCtrl.setRepeatStatus(isActive);

          $(DOMstrings.repeatBtn).classList.toggle("active", isActive);
        }.bind($(DOMstrings.repeatBtn), musicCtrl)
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
      _this.jumpActiveClass(randomSongIndex);
      _this.loadSong(musicCtrl.getSong(randomSongIndex));
      $(DOMstrings.audio).play();
    },
    jumpActiveClass: function (currentSongIndex) {
      var songsArr = Array.prototype.slice.call($$(DOMstrings.songDiv));

      songsArr.find(function (song) {
        if (song.classList.contains("active")) {
          song.classList.remove("active");
          return song.dataset.indexNumber;
        }
      });

      songsArr[currentSongIndex].classList.add("active");
    },
    scrollIntoView: function () {
      var _this = this;
      window.scroll({
        top: _this.findPosition($(DOMstrings.activeSong)),
        left: 0,
        behavior: "smooth",
      });
    },
    findPosition: function (selector) {
      var curtop = 0;
      if (selector.offsetParent) {
        do {
          curtop += selector.offsetTop;
        } while ((selector = selector.offsetParent));
        return [curtop];
      }
    },
    playSong: function () {},
    playSongOnPlaylist: function (musicCtrl) {
      var _this = this;
      function handleEvent(e) {
        var optionClass = e.target.parentNode.classList.value;
        if (e.target.closest(".song.active") && !e.target.closest(".option"))
          return;

        if (optionClass === "option") return;

        if (e.target.closest(".song:not(.active)")) {
          var currentSongIndex, currentSong;
          currentSongIndex = parseInt(
            e.target.closest(".song:not(.active)").dataset.indexNumber
          );

          currentSong = musicCtrl.getSong(currentSongIndex);
          _this.jumpActiveClass(currentSongIndex);
          _this.loadSong(currentSong);
          $(DOMstrings.audio).play();
        }
      }

      $(DOMstrings.playlistEl).addEventListener("click", handleEvent);
    },
  };
})();

var app = (function (musicCtrl, UICtrl) {
  var setupEventListener, currentSongIndex;
  currentSongIndex = musicCtrl.getCurrentSongIndex();
  setupEventListener = function () {
    UICtrl.displaySongs(musicCtrl.getPlaylist(), currentSongIndex);
    UICtrl.loadSong(musicCtrl.getSong(currentSongIndex));
    UICtrl.scrollEvent();
    // Click on Random Button
    UICtrl.repeatSongBtn(musicCtrl);

    // Click on Prev Button
    UICtrl.prevSongBtn(musicCtrl);

    // Click on playmusic Button
    UICtrl.playMusicBtn(musicCtrl);

    // Click on Next Button
    UICtrl.nextSongBtn(musicCtrl);

    // Click on Random Button
    UICtrl.randomSongBtn(musicCtrl);

    // Click a specific song on the playlist.
    UICtrl.playSongOnPlaylist(musicCtrl);

    UICtrl.audioOnPlay();
    UICtrl.audioOnPause();
    UICtrl.progressBarOnChange();
    UICtrl.audioOnChangeTime();
    UICtrl.audioOnEnded(musicCtrl);
  };

  return {
    init: function () {
      console.log("Application has started...");
      setupEventListener();
    },
  };
})(musicController, UIController);

app.init();
