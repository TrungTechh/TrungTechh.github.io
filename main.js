const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'TRUNG_DEP_TRAI';

const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');

const btnPlay = $('.btn.btn-toggle-play');
const btnNext = $('.btn.btn-next');
const btnPrev = $('.btn.btn-prev');
const btnRandom = $('.btn.btn-random');
const btnRepeat = $('.btn.btn-repeat');

const volumeBtn = $('.volume-btn')
const volume_change = $('#controls_lever_range')

const player = $('.player')
const progress = $('.progress'); 
const playList = $('.playlist');

const app = {
	currentIndex: 0,
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	isMute  : false,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
	songs:[
		{
			name: "Bước qua nhau",
			singer: 'Vũ',
			path: '/music/song1.mp3',
			img: '/music/song1.jpg'
		},
		{
			name: 'Thức giấc',
			singer: 'DA LAB',
			path: '/music/song2.mp3',
			img: '/music/song2.jpg'
		},
		{
			name: 'Muộn rồi mà sao còn',
			singer: 'Sơn Tùng MTP',
			path: '/music/song3.mp3',
			img: '/music/song3.jpg'
		},
		{
			name: 'Chạy về khóc với anh',
			singer: 'Erik',
			path: '/music/song4.mp3',
			img: '/music/song4.jpg'
		},
		{
			name: 'Có hẹn với thanh xuân',
			singer: 'MONSTAR',
			path: '/music/song5.mp3',
			img: '/music/song5.jpg'
		},{
			name: 'Chúng ta của hiện tại',
			singer: 'Sơn Tùng MTP',
			path: '/music/song6.mp3',
			img: '/music/song6.jpg'
		},{
			name: 'I\'m still loving you',
			singer: 'Noo Phước Thịnh',
			path: '/music/song7.mp3',
			img: '/music/song7.jpg'
		},{
			name: 'Tạm gác hết những âu lo',
			singer: 'DA LAB ft Miu Lê',
			path: '/music/song8.mp3',
			img: '/music/song8.jpg'
		},{
			name: 'Đi để trở về',
			singer: 'Soobin Hoàng Sơn',
			path: '/music/song9.mp3',
			img: '/music/song9.jpg'
		},
		{
			name: 'Đi để trở về 2',
			singer: 'Soobin Hoàng Sơn',
			path: '/music/song10.mp3',
			img: '/music/song10.jpg'
		},
		{
			name: 'Lalala',
			singer: 'Soobin Hoàng Sơn',
			path: '/music/song11.mp3',
			img: '/music/song11.jpg'
		},{
			name: 'GENE',
			singer: 'BINZ',
			path: '/music/song12.mp3',
			img: '/music/song12.jpg'
		},
	],
	setConfig: function(key,value){
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
	},
	loadConfig: function(){
		this.isRandom = this.config.isRandom
		this.isRepeat = this.config.isRepeat
	},

	defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
	render: function(){
		const htmls = this.songs.map((song,index) => {
			return `
			<div class="song" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.img}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
					
                
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
				<div class="spectrum">
                    <div></div>
				</div>
            </div>
			`
		})
		playList.innerHTML=htmls.join('');
	},

	handleEvents: function(){
		const _this = this;
		const cd = $('.cd');
		const cdWidth = cd.offsetWidth;

		//Xử lí cd quay
		const cdThumbAnimate = cdThumb.animate([
			{transform: 'rotate(360deg)'},
		],{
			duration: 10000,
			iterations: Infinity
		})
		cdThumbAnimate.pause();

		//Xử lí phóng to, thu nhỏ
		document.onscroll = function (){
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const newWidth = cdWidth - 1.15*scrollTop;
			cd.style.width = newWidth>0?(newWidth + 'px'):0;
			cd.style.opacity = newWidth/cdWidth;
		}

		//Nút play
		btnPlay.onclick = function(){
			if(_this.isPlaying){
				audio.pause(); 
			}
			else{
				audio.play();
			}
		}
		audio.onplay = function(){
			_this.isPlaying = true;
			player.classList.add('playing');
            $('.song.active .spectrum').classList.remove('paused')
            $('.song.active .spectrum').classList.add('active')
			cdThumbAnimate.play();
		}
		audio.onpause = function(){
			_this.isPlaying = false;
			player.classList.remove('playing');
			$('.song.active .spectrum').classList.remove('active')
            $('.song.active .spectrum').classList.add('paused')
			cdThumbAnimate.pause();
		}

		//Nút nextSong
		btnNext.onclick = function(){
			if(_this.isRandom){
				_this.randomSong();
			}
			else{
				_this.nextSong();
			}
			audio.play();
		}
		//nút prevSong
		btnPrev.onclick = function(){
			if(_this.isRandom){
				_this.randomSong();
			}
			else{
				_this.prevSong();
			}
			audio.play()
		}
		//Nút random
		btnRandom.onclick = function(){
			_this.isRandom = !_this.isRandom;
			_this.setConfig('isRandom',_this.isRandom);
			btnRandom.classList.toggle('active', _this.isRandom);
		}
		//Nút repeat
		btnRepeat.onclick = function(){
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig('isRepeat',_this.isRepeat);
			btnRepeat.classList.toggle('active', _this.isRepeat);
		}
		//Nút load
		volumeBtn.onclick = function(){
			if(audio.muted){
				audio.muted = false;
				volumeBtn.classList.remove('active',audio.muted);
				volume_change.classList.remove('active', audio.muted)
				audio.volume = '100';
			}
			else{
				audio.muted = true;
				volumeBtn.classList.add('active',!audio.muted);
				volume_change.classList.add('active', audio.muted)

			}
		}
		//Thanh chạy bài hát
		audio.ontimeupdate = function(){
			if (audio.duration) {
                const progressPercentage = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercentage
            }
		}
		//Khi bài hát kết thúc
		audio.onended = function(){
			if(_this.isRepeat){
				audio.play();
			}
			else{
				btnNext.click();
			}
		}
		//Tua bài hát
		progress.onchange = function(e){
			const seekTime = e.target.value*audio.duration/100;
			audio.currentTime = seekTime;
		}

		//Xử lí khi ấn vào playlist 
		playList.onclick = function (e) { 
			const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest('.option')
			
			if (songNode||optionNode) {
				_this.currentIndex=Number(songNode.dataset.index);
				_this.loadCurrentSong();
				audio.play();
			}
		}

		//Xử lí âm Thanh
		volume_change.oninput = function(e){
			audio.volume = e.target.value/100;
			if(audio.volume==0){
				volumeBtn.click();
			}
		}
		
	},
	loadCurrentSong: function(){
		const playListSong =$$('.song');
		header.innerText = this.currentSong.name
		cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
		audio.src = this.currentSong.path;
		for (let i = 0; i < playListSong.length; i++) {
            playListSong[i].classList.remove('active');
        }
        playListSong[this.currentIndex].classList.add('active')
	},
	nextSong: function(){
		this.currentIndex++;
		if(this.currentIndex>=this.songs.length){
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
		if(this.isPlaying){
			audio.play(); 
		}
		else{
			audio.pause();
		}
		setTimeout(() => {
            $('.song.active').scrollIntoView({
				behavior: 'smooth',
                block: "end"
            })
        }, 300)
		
	},
	prevSong: function(){
		this.currentIndex--;
		
		if(this.currentIndex<0){
			this.currentIndex = this.songs.length-1;
		}
		
		this.loadCurrentSong();
		if(this.isPlaying){
			audio.play(); 
		}
		else{
			audio.pause();
		}
		setTimeout(() => {
            $('.song.active').scrollIntoView({
				behavior: 'smooth',
                block: "end",
            })
        }, 300)
	},
	randomSong: function(){
		let newIndex = Math.random(this.songs.length);
		do{
			newIndex = Math.floor(Math.random()*this.songs.length);
		}while(newIndex === this.currentIndex);
		this.currentIndex = newIndex;
		this.loadCurrentSong();
		if(this.isPlaying){
			audio.play(); 
		}
		else{
			audio.pause();
		}
	},
	repeat: function(){

	},
	start: function(){
		// set configuration
        this.loadConfig();

		this.defineProperties();	

		this.render();

		this.loadCurrentSong();

		this.handleEvents();

		// Default UI settings
        if(this.isRandom){
            btnRandom.classList.add('active')
        }
        if(this.isRepeat){
            btnRepeat.classList.add('active')
        }
	}
}


app.start();
