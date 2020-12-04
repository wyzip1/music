const audio = new Vue({
    el: "#audio",
    data: {
        M_name: '',
        songs: [],
        imgSrc: undefined,
        isStart: false,
        audioUrl: undefined,
        videoUrl: undefined,
        mvplay: false,
        videoUrl: undefined,
        deg: 0,
        xz: undefined,
        hasLeav: false,
        hotcomments: []
    },
    methods: {
        search_M: function () {
            let key = this.M_name != '' ? this.M_name : '许嵩';
            getMusicDatas(key).then((res) => {
                this.songs = res.data.result.songCount > 0 ? res.data.result.songs : [];
                // 参数初始化
                this.M_name = '';
                this.imgSrc = undefined;
                this.isStart = false;
                this.hasLeav = false;
                this.mvplay = false;
                this.videoUrl = undefined;
                if (this.xz) {
                    clearInterval(this.xz);
                    this.xz = undefined;
                }
                let big = document.querySelector('#audio .down .image .big_border');
                big.style.transform = `rotateZ(${this.deg}deg)`;
            });

        },
        check: function (i) {
            let id = this.songs[i].id;
            getMusicImage(id).then((res) => {
                let big = document.querySelector('#audio .down .image .big_border');
                let picUrl = res.data.songs[0].al.picUrl;
                if (picUrl != this.imgSrc) {
                    this.imgSrc = picUrl;
                    this.deg = 0;
                    big.style.transform = `rotateZ(${this.deg}deg)`;
                }
            });
            getMusic(id).then((res) => {
                let url = res.data.data[0].url;
                if (url != this.audioUrl) this.audioUrl = url;
            });
            getLeav(id).then((res) => {
                this.hasLeav = res.data.hasMore;
                this.hotcomments = res.data.hotComments;
            });
        },
        start: function () {
            let big = document.querySelector('#audio .down .image .big_border');
            this.isStart = true;
            if (this.xz) {
                clearInterval(this.xz)
                this.xz = undefined;
            };
            this.xz = setInterval(() => {
                this.deg++;
                big.style.transform = `rotateZ(${this.deg}deg)`;
            }, 10);
        },
        stop: function (xz) {
            this.isStart = false;
            clearInterval(xz);
        },
        playmv: function (mvid) {
            getMusicMv(mvid).then((res) => {
                this.videoUrl = res.data.data.url;
                this.mvplay = true;
            });
        },
        closemv: function () {
            this.mvplay = false;
            this.videoUrl = undefined;
        }
    }
});



// 初始化数据
audio.search_M();

// 根据查询参数请求歌曲的数据
function getMusicDatas(M_name) {
    return new Promise((resolve, reject) => {
        axios.get(`https://autumnfish.cn/search?keywords=${M_name}`).then((response) => {
            resolve(response);
        }, (err) => reject(err));
    });
}
// 根据歌曲id获取歌曲封面
function getMusicImage(id) {
    return new Promise((res, rej) => {
        axios.get(`https://autumnfish.cn/song/detail?ids=${id}`).then((response) => {
            res(response);
        });
    });
}
// 根据歌曲id获取歌曲音频文件
function getMusic(id) {
    return new Promise((res, rej) => {
        axios.get(`https://autumnfish.cn/song/url?id=${id}`).then((response) => {
            res(response);
        });
    });
}
// 根据mvid获取歌曲mv
function getMusicMv(mvid) {
    return new Promise((res, rej) => {
        axios.get(`https://autumnfish.cn/mv/url?id=${mvid}`).then((response) => {
            res(response);
        });
    });
}
// 根据歌曲id获取用户评论
function getLeav(id) {
    return new Promise((res, rej) => {
        axios.get(`https://autumnfish.cn/comment/hot?type=0&id=${id}`).then((response) => {
            res(response);
        });
    });
}