var state = 0;

var Proc = function () {
    this.mystate = 0;
    console.log('Proc constructor called');
}

Proc.prototype.transform = function (mystate) {
    this.mystate = mystate;
    state= mystate;
};

Proc.prototype.toString= function () {
    return '(STATE:'+state+',this.mystate :'+this.mystate+')';
};


module.exports = Proc;
