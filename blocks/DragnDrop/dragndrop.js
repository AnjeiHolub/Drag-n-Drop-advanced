(function () {
  class Instagram {
    constructor ({elem}) {
      this._elem = elem;
      this._onMouseDown = this._onMouseDown.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onMouseUp = this._onMouseUp.bind(this);
      this._dragObject = {};
      this._initEvent();
    }
    
    _initEvent () {
      this._elem.addEventListener('mousedown', this._onMouseDown);
      this._elem.addEventListener('startdrag', (event) => {

        if (event.target.contains('.instagram__photo')) event.preventDefault();
      });
        
    }

    _onMouseDown (event) {
      if (event.which != 1) return;
      let elem = event.target.closest('.instagram__list');
      if (!elem) return;
      this._dragObject.elem = elem;
      this._dragObject.startX = event.pageX;
      this._dragObject.startY = event.pageY;

      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('mouseup', this._onMouseUp);

    }

    _onMouseMove (event) {
      if (!this._dragObject.elem) return;

      if (!this._dragObject.avatar) {
        let moveX = this._dragObject.startX - event.pageX;
      	let moveY = this._dragObject.startY - event.pageY;
      	if (Math.abs(moveX) < 5 && Math.abs(moveY) < 5) return;
        
        this._dragObject.avatar = this._createAvatar();

        let coords = this._getCoords(this._dragObject.avatar);

        this._dragObject.shiftX = this._dragObject.startX - coords.left;
        this._dragObject.shiftY = this._dragObject.startY - coords.top;
        
        this._startDrag();
      }

      this._dragObject.avatar.style.left = event.pageX - this._dragObject.shiftX + 'px';
      this._dragObject.avatar.style.top = event.pageY - this._dragObject.shiftY + 'px';
    }

    _onMouseUp (event) {
      if (this._dragObject.avatar) this._finishDrag(event);

      this._dragObject = {};
      document.removeEventListener('mousemove', this._onMouseMove);
      document.removeEventListener('mouseup', this._onMouseUp);
    }

    _finishDrag (event) {
      let dropElem = this._findDroppable(event);
      console.log(dropElem);

      if (dropElem) {
      	this._dragObject.avatar.parentNode.removeChild(this._dragObject.avatar);
      } else {
      	this._dragObject.avatar.rollback();
      }
    }

    _findDroppable (event) {
      this._dragObject.avatar.style.display = 'none';
      let elem = document.elementFromPoint(event.clientX, event.clientY);
      this._dragObject.avatar.style.display = 'inline-block';
      console.log(elem);

      if (elem == null) {
        return null;
      }
      return elem.classList.contains('print__icon');
    }

    _createAvatar () {
      let avatar = this._dragObject.elem;

      let old = {
        parent: avatar.parentNode,
        nextSibling: avatar.nextSibling,
        position: avatar.style.position || '',
        left: avatar.style.left || '',
        top: avatar.style.top || '',
        zIndex: avatar.style.zIndex || ''
      }

      avatar.rollback = function () {
        old.parent.insertBefore(avatar, old.nextSibling);
        avatar.style.position = old.position;
        avatar.style.left = old.left;
        avatar.style.top = old.top;
        avatar.style.zIndex = old.zIndex
      }
      return avatar;
    }

    _getCoords (avatar) {
      let box = avatar.getBoundingClientRect();
      return {
      	top: box.top + pageYOffset,
      	left: box.left + pageXOffset
      }
    }

    _startDrag () {
      var avatar = this._dragObject.avatar;

      document.body.appendChild(avatar);
      avatar.style.zIndex = 9999;
      avatar.style.position = 'absolute';
    }


  }

  window.instagram = Instagram;
})();