document.addEventListener('DOMContentLoaded',() => {
    let btnSocials = document.getElementsByClassName('mdl-mega-footer--social-btn');
    if (btnSocials.length > 0) {
        for (var i in btnSocials)
            btnSocials[i].addEventListener('click',function(){
                if (typeof(this.dataset.href)!=="undefined") {
                    window.open(this.dataset.href,'_blank');
                }
            });
    }

});
