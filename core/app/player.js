const Speaker = require('audio-speaker');

const AudioStream = require('./audio-stream');
const config = require('../../config.json').playback;
const providers = require('./providers');

class Player {
    constructor(ffmpegPath) {
        this._ffmpegPath = ffmpegPath;
        this._playing = false;
        this._audio = null;
        this._speaker = new Speaker({
            sampleRate: config.sampleRate,
            channels: config.channels,
            bitDepth: config.bitDepth
        });
    }

    load(source, song) {
        const load = source => {
            if (this._playing && this._audio) this._audio.unpipe(this._speaker);
            this._audio = source ? new AudioStream(source, this._ffmpegPath) : null;
            if (this._playing && this._audio) this._audio.pipe(this._speaker);
        };

        if (source) {
            providers.load(source, song).then(load);
        } else {
            load(null);
        }
    }

    unload() {

    }

    stop() {

    }

    play() {
        if (this._playing) throw 'Already playing';
        if (this._audio) this._audio.pipe(this._speaker);
        this._playing = true;
    }

    pause() {
        if (!this.playing) throw 'Already paused';
        if (this._audio) this._audio.unpipe(this._speaker);
        this._playing = false;
    }

    seek(seconds) {
        if (!this._audio) throw 'No audio loaded';
        this._audio.seek(seconds);
    }

    volume(volume) {
        console.log('volume');
    }

    next() {
        console.log('next');
    }

    prev() {
        console.log('prev');
    }

    shuffle(state) {
        console.log('shuffle', state);
    }

    get playing() {
        return this._playing;
    }
}

module.exports = Player;