var game = new Phaser.Game(1368, 700, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update, })
//shift octaves left / right
var lower_offset = 24, upper_offset = 36, click_flag = true
// piano bg co-ordinates
var pX = 50, pY = 250
var keys_down = {}
//key map
var lower_octave = [65, 90, 83, 88, 67, 70, 86, 71, 66, 78, 74, 77, 75, 188, 76, 190, 191, 222]
var upper_octave = [49, 81, 50, 87, 69, 52, 82, 53, 84, 89, 55, 85, 56, 73, 57, 79, 80, 189, 219, 187, 221]
//note markers
var cursor_low =  [1, 3, 4, 6, 8, 9, 11, 13, 15, 16, 18, 20, 21, 23, 25, 27, 28, 30, 32, 33, 35, 37, 39, 40, 42, 44, 45, 47, 49, 51, 52, 54, 56, 57, 59, 61 , 63, 64, 66, 68, 69, 71, 73, 75, 76, 78, 80, 81, 83, 85, 87, 88]
var cursor_high = {2: 15, 5: 62, 7: 89, 10: 135, 12: 161, 14: 186, 17: 233, 19: 259, 22: 303, 24: 329,  26: 353, 29: 400, 31: 426, 34: 470,  36: 496,  38: 522, 41: 566,  43: 592, 46: 636,  48: 662,  50: 688, 53: 732,  55: 758, 58: 802,  60: 828,  62: 854, 65: 898,  67: 924, 70: 970,  72: 996,  74:1022, 77: 1067, 79: 1093, 82: 1138, 84: 1164, 86: 1190 } 

function preload() {
    game.load.image('keys', 'assets/img/p.png')
    game.load.image('body', 'assets/img/bg.png')
    game.load.audio('notes', ['assets/aud/keys.mp3','assets/aud/keys.ogg'] ) 
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.stage.backgroundColor = '#707070'
    game.add.sprite(pX-12, pY-100, 'body')
    game.add.sprite(pX, pY, 'keys')
    notes = game.add.audio('notes')
    notes.allowMultiple = true
    secs = 0.0
    duration = 1.5
    for (i=1; i<=88; i++, secs++) notes.addMarker(i, secs++, duration)

    game.input.keyboard.onDownCallback = function() {
        pressed = game.input.keyboard.event.keyCode
        if (!(pressed in keys_down)){ 
            keys_down[pressed] = true
            if (pressed == 37){
                //left arrow
                if(lower_offset-12 >= 0){
                    lower_offset -= 12
                    upper_offset -= 12
                }
            }   
            if (pressed == 39){
                //right arrow
                if(lower_offset+12 <= 60){
                    lower_offset += 12
                    upper_offset += 12
                }                
            }

            audio_tag = -1
            if (upper_octave.indexOf(pressed) != -1)
                audio_tag = upper_octave.indexOf(pressed) + upper_offset
            else if (lower_octave.indexOf(pressed)!= -1)
                audio_tag = lower_octave.indexOf(pressed) + lower_offset
            play_note(audio_tag)                 
    }}

     game.input.keyboard.onUpCallback = function() {
            delete keys_down[game.input.keyboard.event.keyCode]
     }        
}

function update() {
   if(this.game.input.activePointer.isDown && click_flag) clicked()

    if (this.game.input.activePointer.isUp) click_flag =  true
}

function play_note(audio_tag){
    if (audio_tag != -1 && 1 <= audio_tag && 88 >= audio_tag){
            notes.play(audio_tag)
            if(audio_tag in cursor_high){
                draw (cursor_high[audio_tag], 345)
            }
            else draw(3 + cursor_low.indexOf(audio_tag)*24, 437)
            }

}

function draw(x, y){
    var graphics = game.add.graphics(pX+x, y)
    graphics.lineStyle(2, 0x0000FF, 1)
    graphics.beginFill(0x0000FF, 0.5)
    graphics.drawRect(0, 0, 18, 18)
    graphics.endFill(0x0000FF, 0.5)
    setTimeout(function (){graphics.destroy()}, 100)
}

function clicked(){
    click_flag = false
    mX = this.game.input.mousePointer.x
    mY = this.game.input.mousePointer.y
    if (mX >= pX){
        if (pY < mY && mY < 460){
            if(mY < 360){
                x = mX - 50
                played = false
                for(audio_tag in cursor_high){
                    if (cursor_high[audio_tag] <= x && cursor_high[audio_tag] + 16 >= x){
                        play_note(audio_tag)
                        played = true
                        break
                    }
                }
                if (!played) play_note(cursor_low[Math.floor((mX - 50)/24)])
                }
            
            else{
                audio_tag = cursor_low[Math.floor((mX - 50)/24)]
                play_note(audio_tag)
            }
        }
    }    
}