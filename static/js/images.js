define([], function() {
    'use strict';

    var exports = function(element, options) {

        this._element = element;
        this._options = options;

        this._images = options.images;
        this._initial = true;

        this._modal = document.getElementById('modalImage');
        this._modalClose = this._modal.querySelector('.u-modal__trigger');
        this._modalNext = this._modal.querySelector('.u-modal--image__next');
        this._modalPrev = this._modal.querySelector('.u-modal--image__prev');
        this._modalActive = true;

        this._currentImage = 0;

        this._activeClass = 'is-active';
        this._inactiveClass = 'is-inactive';

        this._url = window.location.origin;

        this._initialize();
    };

    exports.prototype = {

        /**
         * Initialize Header functionality
         * @private
         */
        _initialize: function() {

            this._bindEvents();

            this._toggleModal(false);

            this._toggleNextPrevButtons(true);

        },

        /**
         * Bind events
         * @private
         */
        _bindEvents: function(){
            this._clickHandler = [];
            var _this = this;

            Array.prototype.forEach.call(_this._images, function(el, k){
                _this._clickHandler[k] = _this._imageClickHandler.bind(this, el, _this);
                el.addEventListener('click', _this._clickHandler[k]);
                el.setAttribute('data-imageid', k);
            });

            this._hideHandler = this._closeClickHandler.bind(this, _this);
            this._modalClose.addEventListener('click', this._hideHandler);

            window.addEventListener('keydown', function(e){ _this._bindNextPrev(e) });

            this._modalNext.addEventListener('click', function(e){
                e.preventDefault();
                _this._switchImage('next')
            });

            this._modalPrev.addEventListener('click',function(e){
                e.preventDefault();
                _this._switchImage('prev')
            });

        },

        /**
         * Bind escape key
         * @private
         */
        _bindEscape: function(){
            this._onEscapeBind = this._onEscape.bind(this);
            window.addEventListener('keydown', this._onEscapeBind, false);
        },

        /**
         * unbind escape key
         * @private
         */
        _unbindEscape: function(){
            window.removeEventListener('keydown', this._onEscapeBind);
        },

        /**
         * Bind next/prev buttons
         * @param e
         * @private
         */
        _bindNextPrev: function(e){
            if (e.keyCode == 39){
                // next
                this._switchImage('next');
            } else if (e.keyCode == 37) {
                // prev
                this._switchImage('prev');
            }
        },

        /**
         * Escape handler
         * @param e
         * @private
         */
        _onEscape: function(e){
            if ( e.keyCode == 27) {
                this._toggleModal(true);
            }
        },

        /**
         * Close anchor click handler
         * @param exp : module exports (this)
         * @param e : event
         * @private
         */
        _closeClickHandler: function (exp, e) {
            e.preventDefault();
            exp._toggleModal(true);
        },

        /**
         *
         * @param anchor : clicked anchor
         * @param exp : module exports (this)
         * @param e : event
         * @private
         */
        _imageClickHandler: function(anchor, exp, e){
            e.preventDefault();
            exp._toggleModal(true);

            exp._renderImage(anchor);
        },


        /**
         * Toggle modal view
         * @private
         */
        _toggleModal: function () {

            if (arguments[0] === true){
                if (!this._modalActive){
                    this._displayModalToggle(true);
                    this._modal.classList.add(this._activeClass);
                    this._modal.classList.remove(this._inactiveClass);
                    this._modalActive = true;
                    this._bindEscape();
                } else {
                    this._modal.classList.add(this._inactiveClass);
                    this._modal.classList.remove(this._activeClass);
                    this._modalActive = false;
                    //this._displayModalToggle(false);
                    this._unbindEscape();
                    if (this._initial) {
                        this._modal.classList.remove('u-modal--initial-message');
                    }
                }
            } else {
                if (this._modalActive){
                    this._modal.removeAttribute('style');
                    this._modalActive = false;
                } else {
                    //this._modal.setAttribute('style', 'display:none;');
                    this._modalActive = false;
                    if (arguments[0]){
                        this._modal.classList.add(this._inactiveClass);
                        this._modal.classList.remove(this._activeClass);
                    }
                }
            }

        },

        /**
         *
         * @param display
         * @private
         */
        _displayModalToggle: function(display){
            if (display){
                this._modal.removeAttribute('style');
            }
        },

        /**
         * Render image in modal
         * @param anchor
         * @private
         */
        _renderImage: function (anchor) {

            var url = anchor.getAttribute('href'),
                alt = anchor.getAttribute('title'),
                img = this._modal.querySelector('.u-modal__image img');

            if (img){
                img = this._modal.querySelector('.u-modal__image img');
            } else {
                img = document.createElement('img');
            }

            img.setAttribute('src', this._url + url);
            img.setAttribute('alt', alt);

            this._modal.querySelector('.u-modal__image').appendChild(img);

            this._currentImage = anchor.getAttribute('data-imageid');

            this._toggleNextPrevButtons();
        },

        /**
         * Switch image in modal
         * @param direction
         * @private
         */
        _switchImage: function(direction) {

            if (direction == 'next' && this._currentImage < this._images.length - 1){
                this._currentImage++;

                this._renderImage(this._images[this._currentImage]);

            } else if (direction == 'prev' && this._currentImage > 0 ) {
                this._currentImage--;

                this._renderImage(this._images[this._currentImage]);
            }
            this._toggleNextPrevButtons();

        },

        /**
         * Enable disable next/prev buttons on first/last or single image
         * @private
         */
        _toggleNextPrevButtons: function(){
            if (arguments[0] && this._images.length > 1){
                this._modalNext.classList.add(this._activeClass);
                this._modalPrev.classList.add(this._activeClass);
            }

            if (this._currentImage == 0){
                this._modalPrev.classList.remove(this._activeClass);
            }
            if (this._currentImage >= 1){
                this._modalPrev.classList.add(this._activeClass);
            }
            if (this._currentImage < this._images.length - 1){
                this._modalNext.classList.add(this._activeClass);
            }
            if (this._currentImage == this._images.length - 1){
                this._modalNext.classList.remove(this._activeClass);
            }


        },

        /**
         * Called by Conditioner when unloading the module.
         * @public
         */
        unload: function () {
            var _this = this;

            Array.prototype.forEach.call(_this._images, function(el, k){
                el.removeEventListener('click', _this._clickHandler[k]);
            });

            this._unbindEscape();
        }


    };

    return exports

});